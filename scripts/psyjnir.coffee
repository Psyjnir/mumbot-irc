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
    responses = ['Yes!', 'Wat', 'Of course!', 'Maybe...send pix', 'A thousand times, yes!', 'You know our motto!', 'Get away from me.', 'Uh no', 'NEVER', 'Wow so brave']

    msg.send msg.random responses
    
  # Respond to cli
  robot.hear /(^|\W)clip(\z|\W|$)/i, (msg) ->
    responses = ['You mean clipazine', 'I believe you mean magazine', 'You mean magazine, not clip?', 'OMG IT IS A MAGAZINE']

    msg.send msg.random responses
    