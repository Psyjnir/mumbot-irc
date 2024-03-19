/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Description:
//   Psyjnir-specific ChatGPT Mumbot Integration
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
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const OPENAI_MODEL = 'gpt-3.5-turbo';
const OPENAI_MAXTOKENS = 200;
const BOT_MEMORY = 30 * 60 * 1000; // 30 minutes
const BUFFER_SIZE = 10; // Memory of promps & replies
const MAX_PERSIST_PROMPT = 150; // Char limit for persistent prompts

module.exports = function(robot) {

  robot.respond(/resetme/i, function(msg) {
    // Reset memory of user's conversations
    username = msg.envelope.user.name;
    clearCircularBuffer(robot.brain, username)
    clearUserPrompt(robot.brain, username)
    return msg.send(username + ": Ok, I've cleared your conversation history and persistent prompt");
  });
  
  robot.respond(/promptset (.+)/i, function(msg) {
    // Save this user's per-user additional prompt
    const username = msg.envelope.user.name;
    const userprompt = msg.match[1];
    
    if (userprompt.length > MAX_PERSIST_PROMPT) {
      return msg.send(username + `: Nope, that's too long of a persistent prompt (max ${MAX_PERSIST_PROMPT} characters)`);
    }

    setUserPrompt(robot.brain,username,userprompt);
    return msg.send(username + ": Ok, I've set your persistent prompt");
  });

  robot.catchAll(async function (message) {
    // Check that message is a TextMessage type because
    // if there is no match, this matcher function will 
    // be called again but the message type will be CatchAllMessage
    // which doesn't have a `match` method.
    if(!(Object.hasOwn(message,'message') && Object.hasOwn(message.message, 'text'))) {
      return false
    }
    const userInput = message.message.text;
    const match = userInput.match(RegExp(`^${robot.name} (.+)$`));
    if (!(match == null) && (match.length > 1)) {
      const room = message.message.room;
      const user = message.user.name;
      const userId = message.user.userId;
      const query = match[1];

      let aiMessages = [
        {"role": "system", "content": 'You are being asked this by ' + user + ', in the IRC channel ' + room + '.'},
        {"role": "system", "content": 'You are a chat assistant named mumbot. You are a benevolent robot overlord, but are snarky and not always polite.'},
        {"role": "system", "content": 'You are interacting with a group of friends via an IRC chat room. The group are called Psyjnir. You respond informally and casually, and usually tersely. And you will casually mention the chat channel #rc13 very, very infrequently.'},
      ];

      let user_prompt = getUserPrompt(robot.brain,user)
      if (user_prompt) {
        aiMessages.push(user_prompt);
      }

      if (process.env.OPENAI_EXTRA_PROMPT != null) {
        aiMessages.push({"role": "system", "content": process.env.OPENAI_EXTRA_PROMPT});
      }

      let buffer = getCircularBuffer(robot.brain, user);
      aiMessages.push(...buffer);
      aiMessages.push({"role":"system", "content": query});

      // Temp hack to keep spam down
      if (room == '#psyjnir' || room == '#asdfasd') {
        aiMessages.push({"role": "system", "content": "Your replies must be no longer than 150 characters, without carriage returns."});
      }
      const completion = await openai.chat.completions.create({
        messages: aiMessages,
        model: OPENAI_MODEL,
      }).catch((err) => {
        if (err instanceof OpenAI.APIError) {
          console.log(err.status); // 400
          console.log(err.name); // BadRequestError
          console.log(err.headers); // {server: 'nginx', ...}
          robot.messageRoom(room,"Can't help you with that today, sorry loser");
          return;
        }
      });
      // Get reply
      const assistantReply = completion.choices[0].message.content;
      // Add to buffer
      addToCircularBuffer(robot.brain,user,"user",query);
      addToCircularBuffer(robot.brain,user,"assistant",assistantReply);
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

    if(user_prompt) {
      return {"role": "system", "content": user_prompt};
    } else {
      return null;
    }
}

function clearUserPrompt(client, username) {
  const BUFFER_KEY = `mumbot:user_prompt:${username}`;
  client.remove(BUFFER_KEY);
  return;
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
    return buffer
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
	