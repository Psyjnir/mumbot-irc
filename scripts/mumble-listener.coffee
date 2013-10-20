# Description:
#   Connect to and query a Mumble server
#
# Dependencies:
#    None
#
# Configuration:
#   HUBOT_MUMBLE_SERVER
#	HUBOT_MUMBLE_PORT
#   HUBOT_MUMBLE_USERNAME
#   HUBOT_MUMBLE_PASSWORD
#
# Commands:
#   hubot <keyword> tweet - Returns a link to a tweet about <keyword>
#
# Author:
#   atmos, technicalpickles

module.exports = (robot) ->
  robot.router.get '/user/:name/joined/:channel', (req, res) ->
    userName = req.params.name
    mumbleChannel = req.params.channel
    
    console.log "User: #{userName} to Channel: #{mumbleChannel}"
    
    allRooms = getAllRooms robot
    
    if mumbleChannel?
      message = "#{userName} moved into #{mumbleChannel}"
    else
      message = "#{userName} hopped on Mumble!"
    i = 0
    while i < allRooms.length
      robot.messageRoom allRooms[i], message
      i++
    
    res.end "JOIN NOTED"
    
  robot.hear /mumble me/i, (msg) ->
    msg.http("#{process.env.HUBOT_MUMBLE_PARTNER_URL}/mumble/userList")
      .get() (err, res, body) ->
        activeUsers = JSON.parse(body)
        if activeUsers.length isnt 0
          message = "Online: "
          console.log activeUsers
          for key, value of activeUsers
            unless value is robot.name
              message = message + "#{key} (#{value}), "
          message = message.substring(0, message.length - 2)
        else
          message = "No one on Mumble!"
        
        msg.send message
        

# Ugly hack to get all hubot’s rooms,
# pending an official and cross-adapters API
getAllRooms = (robot) ->
  
  # With the IRC adapter, rooms are located
  # in robot.adapter.bot.opt.channels
  adapter = robot.adapter
  return adapter.bot.opt.channels  if adapter and adapter.bot and adapter.bot.opt and adapter.bot.opt.channels
  
  # Search in env vars
  for i of process.env
    return process.env[i].split(",")  if /^HUBOT_.+_ROOMS/i.exec(i) isnt null