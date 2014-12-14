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