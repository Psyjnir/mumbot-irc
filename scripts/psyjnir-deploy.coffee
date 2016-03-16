# Description:
#   Psyjnir-specific Mumbot build testing and deployment
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

module.exports = (robot) ->
  # Respond to questions.
  robot.respond /(What is your git hash?)/i, (msg) ->
    answer = process.env.GIT_REV
    unless answer?
      msg.send "You cannot handle my git hash, my test vars are too strong for you!!!"
    msg.send "My current git hash is #{answer}"