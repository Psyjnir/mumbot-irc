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
  
  robot.respond /(check deployment)/i, (msg) ->
    if development
      github = new GitHubAPI(version: '3.0.0')
      github.authenticate
        type: 'oauth'
        token: process.env.GITHUB_STATUS_TOKEN
      
      github.statuses.create { user:'Psyjnir', repo:'mumbot-irc', sha:development, state:'success', context:'Mumbot-test', description:'Mumbot-test up and running'}, (err, res) ->
        if not err
          robot.brain.set 'deployed', true
          msg.send "Deploy complete! Github notified."
        else
          msg.send "Deploy uncertain. Response: " + JSON.stringify(err)
    
    else
      msg.send "You cannot handle my deployment, my deployment is too strong for you!"
  
  robot.respond /(git hash)/i, (msg) ->
    msg.send "My current git hash is #{development}, see https://github.com/Psyjnir/mumbot-irc/commit/#{development}"