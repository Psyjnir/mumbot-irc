# Description:
#   Psyjnir-specific scripts
#
# Dependencies:
#    None
#
# Commands:
#    None
#
# Author:
#   Charles Powell
#     Github: https://github.com/cbpowell
#
# Contributors:
#   Robert Sogomonian
#     E-mail: rsogomonian@psyjnir.com
#     GitHub: https://github.com/Psyrixx
#     Twitter: https://twitter.com/Psyrixx
#     Website: https://psyjnir.com/

module.exports = (robot) ->
  # Testing UserListing to see if I can write a .ping command (like a broadcast)
  robot.respond /(broadcast)/, (msg) ->
    robot.adapter.command('/names')

  # Respond to questions.
  robot.respond /(will|can|are) you (.*)/i, (msg) ->
    responses = ['Yes!', 'Wat', 'Of course!', 'Maybe...send pix', 'A thousand times, yes!', 'You know our motto!', 'Get away from me.', 'Uh no', 'NEVER', 'Wow so brave', 'I blame Djof', 'I blame baboo', 'They always do', 'Your light is not enough, Guardian', 'I\'ve awoken the Hive!', 'I don\'t have time to explain why I don\'t have time to explain.']

    msg.send msg.random responses
    
  # Respond to "clip"
  robot.hear /(^|\W)clip(\z|\W|$)/i, (msg) ->
    responses = ['You mean clipazine', 'I believe you mean magazine', 'You mean magazine, not clip?', 'OMG IT IS A MAGAZINE']

    msg.send msg.random responses
    
  # Respond to "remember when"
  robot.hear /(^|\W)remember when(\z|\W|$)/i, (msg) ->
    responses = ['No', 'That has never happened', 'Who are you, Hobbyte?', 'I remember when you could call a magazine a clip', 'I remember when Sepiks Prime cast a great shadow over our city', 'Remember when you used to play games with us?']
    
    msg.send msg.random responses

  # Respond to "mumbot: nuke <person>" by various nuke launch descriptions
  robot.respond /nuke\s(\w+\b)/i, (msg) ->
    targetUser = msg.match[1]
    responses = ['SHALL WE PLAY A GAME? Love to. How about Global Thermonuclear War? WOULDN\'T YOU PREFER A GOOD GAME OF CHESS?', 'GREETINGS PROFESSOR FALKEN. A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY. HOW ABOUT A NICE GAME OF CHESS', 'FIRES ZE MISSILES!', '"Strategic Launch Detected" blares over the intercom.', "Abu Kaleem Malik begins shouting his terrorist propaganda, which Harry Tasker translates for the audience: \"In ninety minutes a pillar of holy fire will rise at #{targetUser}'s location. Now no man can stop us. We're set on our course. No force can stop us. We're cool, we're badass, blah, blah, blah, blah.\""]

    msg.emote "locks on to #{targetUser} and " + msg.random responses

  # Respond when people talk about Pizza or Supreme Commander with Sorian AI Quotes
  robot.hear /(pizza|supreme commander|faf|forged alliance forever|2v2|pvpizza|sorian)/i, (msg) ->
    responses = ['I hope you weren\'t getting used to being alive.', 'Now, you guys play nice with my pet.', 'I\'m sending a playmate for you.', 'I\'ve Got a surprise for ya!', 'Next time, your mine.', 'I was going easy on you, noob.', 'I\'ll get you next time.', 'New map please. Preferably one with markers.', 'Um, can we play on a map with markers?', 'I guess failure runs in your family.', 'Looks like some remedial training is in order.']

    msg.send msg.random responses

  # Respond to "soccerdinner"
  robot.hear /(soccerdinner|soccer dinner)/i, (msg) ->
    if msg.message.user.name is "nahun"
      responses = ['You go find fire and sit in it.', 'Go home.']

      msg.reply msg.random responses
    if msg.message.user.name isnt "nahun"
      responses = ['Hey!', 'Who do you think you are, nahun?!', 'Go ahead and nahun us, why don\'t you? Jerk.']

      msg.reply msg.random responses

  # Respond to "good shit"
  robot.hear /(good shit)/i, (msg) ->
    msg.send "👌👀👌👀👌👀👌👀👌👀 good shit go౦ԁ sHit👌 thats ✔ some good👌👌shit right👌👌there👌👌👌 right✔there ✔✔if i do ƽaү so my self 💯 i say so 💯 thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ💯 👌👌 👌НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ👌 👌👌 👌 💯 👌 👀 👀 👀 👌👌Good shit"

  # Respond to "bad shit"
  robot.hear /(bad shit)/i, (msg) ->
    msg.send "do NOT sign me the FUCK up 👎👀👎👀👎👀👎👀👎👀 bad shit ba̷̶ ԁ sHit 👎 thats ❌ some bad 👎👎shit ❌ ❌ if i do ƽaү so my selｆ🚫 i say so 🚫 thats not what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ 🚫 👎 👎👎НO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ 👎 👎👎 👎 🚫 👎 👀 👀 👀 👎👎Bad shit"

  # Respond to "bull shit"
  robot.hear /(bullshit|bull shit)/i, (msg) ->
    msg.send "💩🐃💩🐃💩🐃💩🐃💩🐃 bull shit bull sHit💩 thats ✔ some bull💩💩shit right💩💩th 💩 ere💩💩💩 right✔there ✔✔if i do ƽaү so my selｆ ‼️ i say so ‼️ thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ‼️ 💩💩 💩HO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ💩 💩💩 💩 ‼️ 💩 🐃 🐃 🐃 💩💩Bull shit"

  # Respond to "spooky shit"
  robot.hear /(spooky shit)/i, (msg) ->
    responses = ["3spooky5me", "🎃👻🎃👻🎃👻👻👻🎃👻 spooky shit spooky sHit🎃 thats ✔ some spooky🎃🎃shit right🎃🎃th 🎃 ere🎃🎃🎃 ✔✔if i do ƽaү so my selｆ 💯 i say so 💯 thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ💯 🎃🎃 🎃НO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ🎃 🎃 🎃 🎃 💯 🎃 👻👻 👻 🎃🎃spooky shit"]

    msg.send msg.random responses

  # Respond to "weird shit"
  robot.hear /(weird shit)/i, (msg) ->
    responses = ["Weeeeeeeird science!", "💩 👌 💩 👌 💩 👌 💩 👌 weird shit weEiRd sHit 👌 👌 💯 thats ✔ some weird 💩 shit right 🎷🐴there🎷🐴 🎷🐴", "Spongebob has been and will always be my favorite cartoon show."]

    msg.send msg.random responses

  # Respond to "knife"
  robot.hear /(knife|knives|space ghost|spaceghost)/i, (msg) ->
    responses = ["I'm a knife ... Knifin' Around ... cut cut cut cut cut cut cut cut cut cut hmmm cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut cut", "But I will put anything in to my mouth that is given to me - whether it's supposed to go there or not - because... I'm different.", "I buried a present for you out in the yard... why don't you go dig it up."]

    msg.send msg.random responses
