/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Description:
//   Psyjnir-specific Claude Mumbot Integration
//
// Dependencies:
//    None
//
// Commands:
//    None
//
// Author:
//   Charles Powell
//     Github: https://github.com/cbpowell
//
// Contributors:

const { isNull } = require('lodash');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANTHROPIC_MODEL = process.env.MUMBOT_MODEL ?? 'claude-haiku-4-5';
const ANTHROPIC_MAXTOKENS = parseInt(process.env.MUMBOT_MAX_TOKENS) || 900;
const BOT_MEMORY = (parseInt(process.env.MUMBOT_MEMORY_MINUTES) || 30) * 60 * 1000;
const BUFFER_SIZE = parseInt(process.env.MUMBOT_BUFFER_SIZE) || 10;
const MAX_PERSIST_PROMPT = parseInt(process.env.MUMBOT_MAX_PERSIST_PROMPT) || 150;
const MAX_SEARCH_USE = parseInt(process.env.MUMBOT_MAX_SEARCH_USE) || 1;
const SEARCH_USER_COOLDOWN = parseInt(process.env.SEARCH_USER_COOLDOWN) || 60 * 60 * 1000;

module.exports = function(robot) {

  robot.respond(/resetme/i, function(msg) {
    // Reset memory of user's conversations
    username = msg.envelope.user.name;
    clearCircularBuffer(robot.brain, username);
    clearUserPrompt(robot.brain, username);
    return msg.send(username + ": Ok, I've cleared your conversation history and persistent prompt");
  });

  robot.respond(/promptset (.+)/i, function(msg) {
    // Save this user's per-user additional prompt
    const username = msg.envelope.user.name;
    const userprompt = msg.match[1];

    if (userprompt.length > MAX_PERSIST_PROMPT) {
      return msg.send(username + `: Nope, that's too long of a persistent prompt (max ${MAX_PERSIST_PROMPT} characters)`);
    }

    setUserPrompt(robot.brain, username, userprompt);
    return msg.send(username + ": Ok, I've set your persistent prompt");
  });

  robot.catchAll(async function (message) {
    // Check that message is a TextMessage type because
    // if there is no match, this matcher function will
    // be called again but the message type will be CatchAllMessage
    // which doesn't have a `match` method.
    if (!(Object.hasOwn(message, 'message') && Object.hasOwn(message.message, 'text'))) {
      console.log("No message text, ignoring");
      return false;
    }
    const userInput = message.message.text;
    const match = userInput.match(RegExp(`^${robot.name} (.+)$`));
    if (!(match == null) && (match.length > 1)) {
      const room = message.message.room;
      const user = message.user.name;
      const userId = message.user.userId;
      const query = match[1];

      // Build the system prompt by combining all system-level instructions
      let systemParts = [
        `You are being asked this by ${user}, in the IRC channel ${room}.`,
        'You are a chat assistant named mumbot. You are a benevolent robot overlord, but are snarky and not always polite.',
        'You are interacting with a group of friends via an IRC chat room. The group are called Psyjnir. You respond usually tersely. And you will casually mention the chat channel #rc13 very, very infrequently.',
      ];

      // Add per-user persistent prompt if set
      let user_prompt = getUserPrompt(robot.brain, user);
      if (user_prompt) {
        systemParts.push(user_prompt);
      }

      // Add extra environment prompt if set
      if (process.env.EXTRA_PROMPT != null) {
        systemParts.push(process.env.EXTRA_PROMPT);
      }

      // Temp hack to keep spam down
      if (room == '#psyjnir' || room == '#asdfasd') {
        systemParts.push("Your replies must be no longer than 150 characters, without carriage returns.");
      }

      const systemPrompt = systemParts.join('\n\n');

      // Build the messages array from conversation history + current query
      // Anthropic requires alternating user/assistant roles
      let buffer = getCircularBuffer(robot.brain, user);
      let aiMessages = [...buffer, { "role": "user", "content": query }];

      const allowSearch = canUserSearch(robot.brain, user);
      if (allowSearch) {
        console.log("Allowing search");
      }

      let response;
      try {
        response = await anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: ANTHROPIC_MAXTOKENS,
          system: [
              {
                type: "text",
                text: systemPrompt,
                cache_control: { type: "ephemeral" }
              }
            ],
          messages: aiMessages,
          ...(allowSearch && {
              tools: [{ type: "web_search_20250305", name: "web_search", max_uses: MAX_SEARCH_USE }]
            }),
        });
      } catch (err) {
        if (err instanceof Anthropic.APIError) {
          console.log(err.status);
          console.log(err.name);
          console.log(err.headers);
        } else {
          console.error('Unexpected error:', err);
        }
        robot.messageRoom(room, "Can't help you with that today, sorry loser");
        return;
      }

      if (!response) {
        console.log("Did not get API response!");
      };

      // If the model actually used the search tool, record it
      const didSearch = response.content.some(block => block.type === 'server_tool_use');
      if (didSearch) {
        console.log("Search executed");
        recordUserSearch(robot.brain, user);
      }

      // Get reply
      const textBlock = response.content.find(block => block.type === 'text');
      const assistantReply = textBlock?.text;
      // Add to buffer
      addToCircularBuffer(robot.brain, user, "user", query);
      addToCircularBuffer(robot.brain, user, "assistant", assistantReply);
      // Respond
      robot.messageRoom(room, assistantReply);
    }
  });
};

// Function to set the per-user prompt for a specific user
function setUserPrompt(client, username, user_prompt) {
    const BUFFER_KEY = `mumbot:user_prompt:${username}`;
    client.set(BUFFER_KEY, JSON.stringify(user_prompt));
    return;
}

// Function to get the per-user prompt for a specific user
function getUserPrompt(client, username) {
    const BUFFER_KEY = `mumbot:user_prompt:${username}`;
    let stored_prompt = client.get(BUFFER_KEY);
    let user_prompt = stored_prompt ? JSON.parse(stored_prompt) : null;

    // Return just the string; it will be added to the system prompt array
    return user_prompt || null;
}

function clearUserPrompt(client, username) {
  const BUFFER_KEY = `mumbot:user_prompt:${username}`;
  client.remove(BUFFER_KEY);
  return;
}

function recordUserSearch(client, username) {
  const KEY = `mumbot:last_search:${username}`;
  client.set(KEY, JSON.stringify(Date.now()));
}

function canUserSearch(client, username) {
  const KEY = `mumbot:last_search:${username}`;
  const now = Date.now();

  const stored = client.get(KEY);
  const last = stored ? JSON.parse(stored) : null;
  //console.log(`canUserSearch: last=${last}, type=${typeof last}`);

  if (last && (now - last) < SEARCH_USER_COOLDOWN) {
    //console.log("Not allowing search");
    return false;
  }
  return true;
}

// Function to add an object to the circular buffer for a specific user
function addToCircularBuffer(client, username, messageRole, message) {
    const BUFFER_KEY = `mumbot:circular_buffer:${username}`;
    const timestamp = Date.now();

    let reply = client.get(BUFFER_KEY);
    let buffer = reply ? JSON.parse(reply) : [];
    buffer.push({"role": messageRole, "content": message, "timestamp": timestamp});
    if (buffer.length > BUFFER_SIZE) {
      buffer = buffer.slice(buffer.length - BUFFER_SIZE);
    }
    client.set(BUFFER_KEY, JSON.stringify(buffer));
    return buffer;
}

// Function to retrieve the circular buffer for a specific user
function getCircularBuffer(client, username) {
    const BUFFER_KEY = `mumbot:circular_buffer:${username}`;
    const now = Date.now();

    let reply = client.get(BUFFER_KEY);
    let buffer = reply ? JSON.parse(reply) : [];
    const filteredBuffer = buffer.filter(item => now - item.timestamp <= BOT_MEMORY);

    const formattedBuffer = filteredBuffer.map(item => ({
      role: item.role,
      content: item.content
    }));

    return formattedBuffer;
}

// Function to retrieve the circular buffer for a specific user
function clearCircularBuffer(client, username) {
  const BUFFER_KEY = `mumbot:circular_buffer:${username}`;

  let reply = client.get(BUFFER_KEY);
  let buffer = [];
  client.set(BUFFER_KEY, JSON.stringify(buffer));

  return buffer;
}
