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

module.exports = function(robot) {
  // Testing UserListing to see if I can write a .ping command (like a broadcast)
  // robot.respond /(broadcast)/, (msg) ->
  //   robot.adapter.command('names')

  // Respond to "remember when"
  robot.hear(/(^)remember when(\z|\W|$)/i, function(msg) {
    const responses = ['No', 'That has never happened', 'Who are you, Hobbyte?', 'I remember when you could call a magazine a clip', 'I remember when Sepiks Prime cast a great shadow over our city', 'Remember when you used to play games with us?'];
    
    return msg.send(msg.random(responses));
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
	
  //nice
  robot.hear(/69/i, msg => msg.send("nice"));


	//dice roll
	robot.hear(/^roll/i, function(msg) {

		var getRandomInt = function(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    }

    var dice = msg.message.text.split(" ")[1];

		if(dice)
		{
			//check 1d6 format
			var matches = dice.match(/(\d+)d(\d+)/);
			if(matches)
			{
				var numDice = matches[1];
				var diceSize = matches[2];
				if(numDice < 1000)
				{
					var sum = 0;
	
					for(var i = 0; i < numDice; i++)
					{
						sum += getRandomInt(1,diceSize);
					}
	
					return msg.Send(sum.toString());
				}
			}

			//check for x-y format
			matches = dice.match(/(\d+)[-](\d+)/);
			if(matches)
			{
				var min = matches[1];
				var max = matches[2];

				return msg.send(getRandomInt(min,max).toString());
			}

			//check for 1-x format
			matches = dice.match(/(\d+)/);
			if(matches)
			{
				var max = matches[1];

				return msg.send(getRandomInt(1,max).toString());
			}

		}
		return null;
  });
};

	
