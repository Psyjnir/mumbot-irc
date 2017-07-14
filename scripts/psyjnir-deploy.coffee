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
  # Depends on the below Dokku plugin, or similar, to get GIT_REV env var
  # https://github.com/cjblomqvist/dokku-git-rev
  development = process.env.GIT_REV
  robot.enter (res) ->
    if development
      robot.logger.debug "Attempting to set deployment with hash #{development}"
      github = new GitHubAPI(version: '3.0.0')
      github.authenticate
        type: 'oauth'
        token: process.env.GITHUB_STATUS_TOKEN
    
      github.statuses.create { user:'Psyjnir', repo:'mumbot-irc', sha:development, state:'success', context:'Mumbot-test', description:'Mumbot-test up and running'}, (err, res) ->
        if not err
          robot.logger.debug "Successfull deployed"
          robot.brain.set 'deployed', true
          robot.messageRoom process.env.HUBOT_DISCORDER_ANNOUNCE_ROOMS, "Deploy complete! Github notified."
        else
          errorMsg = JSON.stringify(err)
          robot.logger.debug "Deploy failed with error: #{errorMsg}"
          robot.messageRoom process.env.HUBOT_DISCORDER_ANNOUNCE_ROOMS, "Deploy uncertain. Response: " + errorMsg
  
    else
      if res.message.user.name is robot.name
        robot.messageRoom process.env.HUBOT_DISCORDER_ANNOUNCE_ROOMS, "You cannot handle my deployment, my deployment is too strong for you!"
  
  robot.hear /(^git hash$)/i, (msg) ->
    if development
      msg.send "My current git hash is #{development}, see https://github.com/Psyjnir/mumbot-irc/commit/#{development}"
    else
      msg.send "No git hash currently set"