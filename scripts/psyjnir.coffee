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
#   cbpowell
#
# Contributors:
#   Robert Sogomonian
#     E-mail: rsogomonian@psyjnir.com
#     GitHub: https://github.com/Psyrixx
#     Twitter: https://twitter.com/Psyrixx
#     Website: https://psyjnir.com/

module.exports = (robot) ->
  # Respond to questions
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

  # Respond to "!nuke" by slapping someone as mumbot
  robot.hear /nuke\s(\w+\b)/i, (msg) ->
    targetUser = msg.match[1]
    responses = ['FIRES ZE MISSILES!', '"Strategic Launch Detected" blares over the intercom.', "Abu Kaleem Malik begins shouting his terrorist propaganda, which Harry Tasker translates for the audience: \"In ninety minutes a pillar of holy fire will rise at #{targetUser}'s location. Now no man can stop us. We're set on our course. No force can stop us. We're cool, we're badass, blah, blah, blah, blah.\""]

    msg.emote "locks on to #{targetUser} and " + msg.random responses

  # Respond when people talk about Pizza or Supreme Commander with Sorian AI Quotes
  robot.hear /(pizza|supreme commander|faf|forged alliance forever|2v2|pvpizza|sorian)/i, (msg) ->
    responses = ['I hope you weren\'t getting used to being alive.', 'Now, you guys play nice with my pet.', 'I\'m sending a playmate for you.', 'I\'ve Got a surprise for ya!', 'Next time, your mine.', 'I was going easy on you, noob.', 'I\'ll get you next time.', 'New map please. Preferably one with markers.', 'Um, can we play on a map with markers?', 'I guess failure runs in your family.']

    msg.send msg.random responses
