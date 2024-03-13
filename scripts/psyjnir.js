/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Description:
//   Psyjnir-specific scripts
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
//   Robert Sogomonian
//     E-mail: rsogomonian@psyjnir.com
//     GitHub: https://github.com/Psyrixx
//     Twitter: https://twitter.com/Psyrixx
//     Website: https://psyjnir.com/

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

module.exports = function(robot) {
  // Testing UserListing to see if I can write a .ping command (like a broadcast)
  // robot.respond /(broadcast)/, (msg) ->
  //   robot.adapter.command('names')

  // Respond to "remember when"
  robot.hear(/(^)remember when(\z|\W|$)/i, function(msg) {
    const responses = ['No', 'That has never happened', 'Who are you, Hobbyte?', 'I remember when you could call a magazine a clip', 'I remember when Sepiks Prime cast a great shadow over our city', 'Remember when you used to play games with us?'];
    
    return msg.send(msg.random(responses));
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
  
  // Respond to "mumbot: nuke <person>" by various nuke launch descriptions
  robot.respond(/nuke\s(\w+\b)/i, function(msg) {
    const targetUser = msg.match[1];
    const responses = ['SHALL WE PLAY A GAME? Love to. How about Global Thermonuclear War? WOULDN\'T YOU PREFER A GOOD GAME OF CHESS?', 'GREETINGS PROFESSOR FALKEN. A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY. HOW ABOUT A NICE GAME OF CHESS', 'FIRES ZE MISSILES!', '"Strategic Launch Detected" blares over the intercom.', `Abu Kaleem Malik begins shouting his terrorist propaganda, which Harry Tasker translates for the audience: \"In ninety minutes a pillar of holy fire will rise at ${targetUser}'s location. Now no man can stop us. We're set on our course. No force can stop us. We're cool, we're badass, blah, blah, blah, blah.\"`];

    return msg.emote(`locks on to ${targetUser} and ` + msg.random(responses));
  });

  // Respond when people talk about Pizza or Supreme Commander with Sorian AI Quotes
  robot.hear(/(^pizza|^supreme commander|^supcom|^faf|^forged alliance forever|^pvpizza|^sorian)/i, function(msg) {
    const responses = ['I hope you weren\'t getting used to being alive.', 'Now, you guys play nice with my pet.', 'I\'m sending a playmate for you.', 'I\'ve Got a surprise for ya!', 'Next time, your mine.', 'I was going easy on you, noob.', 'I\'ll get you next time.', 'New map please. Preferably one with markers.', 'Um, can we play on a map with markers?', 'I guess failure runs in your family.', 'Looks like some remedial training is in order.'];

    return msg.send(msg.random(responses));
  });

  // Respond to "soccerdinner"
  robot.hear(/(soccerdinner|soccer dinner)/i, function(msg) {
    let responses;
    if (msg.message.user.name === "nahun") {
      responses = ['You go find fire and sit in it.', 'Go home.'];

      msg.reply(msg.random(responses));
    }
    if (msg.message.user.name !== "nahun") {
      responses = ['Hey!', 'Who do you think you are, nahun?!', 'Go ahead and nahun us, why don\'t you? Jerk.'];

      return msg.reply(msg.random(responses));
    }
  });

  // Respond to "good shit"
  robot.hear(/(good shit good shit)/i, msg => msg.send("👌👀👌👀👌👀👌👀👌👀 good shit go౦ԁ sHit 👌 thats ✔ some good 👌👌 shit right 👌👌 there 👌👌👌💯 right ✔ there ✔✔ if i do ƽaү so my self 💯 i say so 💯 thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ 💯👌👌👌 НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ 👌👌👌👌💯👌👀👀👀👌👌 Good shit"));

  // Respond to "bad shit"
  robot.hear(/(bad shit bad shit)/i, msg => msg.send("👎👀👎👀👎👀👎👀👎👀 bad shit ba̷̶ ԁ sHit 👎 thats ❌ some bad 👎👎 shit right ❌❌ there 🚫🚫🚫💯 Bad shit"));

  // Respond to "bull shit"
  robot.hear(/(^bullshit|^bull shit)/i, msg => msg.send("💩🐃💩🐃💩🐃💩🐃💩🐃 bull shit buLl sHit 💩 thats ✔ some bull 💩💩 shit right 💩💩 there 💩💩💩💯 Bull shit"));

  // Respond to "spooky shit"
  robot.hear(/(spooky shit spooky shit)/i, function(msg) { 
    const responses = ["3spooky5me", "🎃👻🎃👻🎃👻👻👻🎃👻 spooky shit spOoKy sHit 🎃🎃💯thats ✔ some spooky 🎃🎃 shit right 🎃🎃 there 🎃🎃🎃💯 Spooky shit"];

    return msg.send(msg.random(responses));
  });

  // Respond to "weird shit"
  robot.hear(/(weird shit weird shit)/i, function(msg) {
    const responses = ["Weeeeeeeird science!", "💩👌💩👌💩👌💩👌 weird shit weEiRd sHit 👌👌💯 thats ✔ some weird 🎷🐴 shit right 🎷🐴 there 🎷🐴 🎷🐴💯 Weird shit", "Spongebob has been and will always be my favorite cartoon show."];

    return msg.send(msg.random(responses));
  });

  // Respond to "knife"
  robot.hear(/(knife|knives|space ghost|spaceghost)/i, function(msg) {
    const responses = ["I'm a knife ... Knifin' Around ... cut cut cut cut cut cut cut cut cut cut hmmm cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut", "But I will put anything in to my mouth that is given to me - whether it's supposed to go there or not - because... I'm different.", "I buried a present for you out in the yard... why don't you go dig it up."];

    return msg.send(msg.random(responses));
  });
	
  // Respond to "gh"
  robot.hear(/(^|\W)gh(\W|$)/i, msg => msg.send("🇬🇭"));
	
  // Respond to "rip"
  robot.hear(/(^|\W)rip(\W|$)/i, msg => msg.send("F"));
	
  // Respond to "repost"
  robot.hear(/^repost$/i, function(msg) {
    const responses = ["http://i.imgur.com/P8MhFTn.gifv", "https://i.imgur.com/1VJ5QVU.gifv", "https://alex.github.io/nyt-2020-election-scraper/battleground-state-changes.html"];

    return msg.send(msg.random(responses));
  });
	
  //lenny
  robot.hear(/^lennyface$/i, msg => msg.send("( ͡° ͜ʖ ͡°)"));
	
  //shrug emote
  robot.hear(/(^shrug$|^i dunno$|^dunno$|^idk$)/i, msg => msg.send("¯\\_(ツ)_/¯"));
	
  //dis gon b gud
  robot.hear(/^dis g[o|u]ne? be? g(u|oo)d$/i, msg => msg.send("http://hobbyte.org/gud.gif"));
	
  //dis gon b bad
  robot.hear(/^dis g[o|u]ne? be? bad$/i, msg => msg.send("http://hobbyte.org/bad.gif"));
		
  //skinnnn
  robot.hear(/^skin{1,10}$/i, msg => msg.send("http://hobbyte.org/skinnnn.mp4"));
			
  //nice
  return robot.hear(/69/i, msg => msg.send("nice"));
};

const BUFFER_SIZE = 6;
// Function to add an object to the circular buffer for a specific user
function addToCircularBuffer(client, user, messageRole, message) {
    const BUFFER_KEY = `circular_buffer:${user}`;
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

// Function to retrieve the circular buffer for   a specific user
function getCircularBuffer(client, user) {
    const BUFFER_KEY = `circular_buffer:${user}`;
    const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
    const now = Date.now();

    let reply = client.get(BUFFER_KEY);
    let buffer = reply ? JSON.parse(reply) : [];
    const filteredBuffer = buffer.filter(item => now - item.timestamp <= THIRTY_MINUTES_IN_MS);

    const formattedBuffer = filteredBuffer.map(item => ({
      role: item.role,
      content: item.content
    }));

    return formattedBuffer;
}

// // Example usage
// const userId = 'user123';
// addToCircularBuffer(userId, 'user', 'Hello!');
// addToCircularBuffer(userId, 'assistant', 'Hi there!');
//
// getCircularBufferAsList(userId, (err, formattedBuffer) => {
//     if (err) {
//         console.error('Error:', err);
//         return;
//     }
//     console.log(`Circular buffer for user ${userId}:`, formattedBuffer);
// });

	