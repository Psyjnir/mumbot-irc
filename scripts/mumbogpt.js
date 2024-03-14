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

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const BOT_MEMORY = 30 * 60 * 1000; // 30 minutes
const BUFFER_SIZE = 8; // Memory reply

module.exports = function(robot) {

  robot.hear(/^\/resetme$'/i, function(msg) {
    // Reset memory of user's conversations
    username = message.user.user.name;
    clearCircularBuffer(robot.brain, username)
    return msg.send(username + "I've cleared your conversation history");
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
    const match = userInput.match(RegExp('^(M|m)umbot (.*)'));
    if (!(match == null) && (match.length > 1)) {
      const room = message.message.room;
      const user = message.user.name;
      const userId = message.user.userId;
      const query = match[2];

      let aiMessages = [
        {"role": "system", "content": 'You are being asked this by ' + user + ', in the IRC channel ' + room + '.'},
        {"role": "system", "content": 'You are a chat assistant named mumbot. You are a benevolent robot overlord, but are snarky and not always polite.'},
        {"role": "system", "content": 'You are interacting with a group of friends via an IRC chat room. The group are called Psyjnir. You respond informally and casually, and usually tersely. And you will casually mention the chat channel #rc13 very, very infrequently.'},
      ];

      if (process.env.OPENAI_EXTRA_PROMPT != null) {
        aiMessages.push({"role": "system", "content": process.env.OPENAI_EXTRA_PROMPT});
      }

      let buffer = getCircularBuffer(robot.brain, user);
      aiMessages.push(...buffer);
      aiMessages.push({"role":"system", "content": query});

      const completion = await openai.chat.completions.create({
        messages: aiMessages,
        model: "gpt-3.5-turbo",
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

// Function to add an object to the circular buffer for a specific user
function addToCircularBuffer(client, username, messageRole, message) {
    const BUFFER_KEY = `circular_buffer:${username}`;
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
    const BUFFER_KEY = `circular_buffer:${username}`;
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
  const BUFFER_KEY = `circular_buffer:${username}`;

  let reply = client.get(BUFFER_KEY);
  let buffer = [];
  client.set(BUFFER_KEY, JSON.stringify(buffer));

  return buffer;
}
	