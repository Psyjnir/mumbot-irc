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

GitHubAPI = require 'github'

module.exports = (robot) ->
  development = process.env.GIT_REV
  robot.enter (res) ->
    if development
      github = new GitHubAPI(version: '3.0.0')
      github.authenticate
        type: 'oauth'
        token: process.env.GITHUB_STATUS_TOKEN
    
      github.statuses.create { user:'Psyjnir', repo:'mumbot-irc', sha:development, state:'success', context:'Mumbot-test', description:'Mumbot-test up and running'}, (err, res) ->
        if not err
          robot.brain.set 'deployed', true
          res.send "Deploy complete! Github notified."
        else
          res.send "Deploy uncertain. Response: " + JSON.stringify(err)
  
    else
      robot.messageRoom process.env.HUBOT_DISCORDER_ANNOUNCE_ROOMS, "You cannot handle my deployment, my deployment is too strong for you!"
  
  robot.respond /(git hash)/i, (msg) ->
    if development
      msg.send "My current git hash is #{development}, see https://github.com/Psyjnir/mumbot-irc/commit/#{development}"