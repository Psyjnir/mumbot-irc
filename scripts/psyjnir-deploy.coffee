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
    if res.message.user.name is not robot.name
      robot.logger.debug "Join event is not the robot"
      return
      
    if development
      if not process.env.GITHUB_STATUS_TOKEN
        robot.logger.debug "Robot joined, but no Github status token is set (probably on Production)"
        return
        
      robot.logger.debug "Attempting to set deployment with hash #{development}"
      github = new GitHubAPI(version: '3.0.0')
      github.authenticate
        type: 'oauth'
        token: process.env.GITHUB_STATUS_TOKEN
    
      github.statuses.create { user:'Psyjnir', repo:'mumbot-irc', sha:development, state:'success', context:'Mumbot-test', description:'Mumbot-test up and running'}, (err, res) ->
        if not err
          robot.logger.debug "Successfull deployment"
          robot.brain.set 'deployed', true
          robot.messageRoom process.env.HUBOT_IRC_ROOMS, "Deploy complete! Github notified."
        else
          errorMsg = JSON.stringify(err)
          robot.logger.debug "Deploy failed with error: #{errorMsg}"
          robot.messageRoom process.env.HUBOT_IRC_ROOMS, "Deploy uncertain. Response: " + errorMsg
          
      if process.env.TEST_TIMEOUT
        # Shut down after specified time
        robot.logger.info "NOTICE: App will shutdown after #{process.env.TEST_TIMEOUT} ms"
        setTimeout (->
          robot.logger.info "NOTICE: Test timeout reached, shutting down with exit code 0"
          process.exit(0)
        ), process.env.TEST_TIMEOUT
        return
      
    else
      robot.messageRoom process.env.HUBOT_IRC_ROOMS, "You cannot handle my deployment, my deployment is too strong for you!"
  
  robot.hear /(^git hash$)/i, (msg) ->
    if development
      msg.send "My current git hash is #{development}, see https://github.com/Psyjnir/mumbot-irc/commit/#{development}"
    else
      msg.send "No git hash currently set"