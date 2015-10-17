# Description:
#   Connect to, and query a partner Hubot instance running on a Mumble server
#
# Dependencies:
#    None
#
# Configuration:
#   HUBOT_MUMBLE_PARTNER_URL
#
# Commands:
#   hubot will you <question> - Ask mumbot a question
#   hubot can you <question> - Ask mumbot a question
#   mumble me - List users on mumble
#   who's online? - List users on mumble
#   anyone online - List users on mumble
#
# Author:
#   cbpowell
#   rsogomonian
create_quiet_username = (username) ->
  usernameHead = username.slice(0, 1)
  usernameTail = username.slice(1, username.length)
  usernameHead + "\u200B" + usernameTail

module.exports = (robot) ->
  #robot.respond /(?:ping|notify) me when (.*) gets (?:online|on) (.*)/i, (msg) ->
    
  # Endpoint for user channel change notifications
  robot.router.get '/user/:name/joined/:channel', (req, res) ->
    userName = create_quiet_username(req.params.name)
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
  
  # Ping mumble partner to get userlist
  robot.hear /(mumble me$)|(who'?s online\?)|(anyone ((online)|(on mumble))\??)/i, (msg) ->
    msg.http("#{process.env.HUBOT_MUMBLE_PARTNER_URL}/mumble/userList")
      .get() (err, res, body) ->
        if err
          msg.send "Can't connect right now :( #{err}"
          return
        
        payload = JSON.parse(body)
        if payload.channel?
          console.log "Got a specific channel, did not request!"
          return
          
        if payload.users.length isnt 0
          users = payload.users
          message = "Users Currenty Online: "
          for key, user of users
            unless user.name is robot.name
              username = create_quiet_username(user.name)
              message = message + "#{username} (#{user.room}), "
          message = message.substring(0, message.length - 2)
        else
          message = "There are currently no users on the mumble server."
        
        msg.send message
    
  robot.hear /(?:mumble me (.+))|(?:(?:anyone|who'?s) (?:in|on) (.+)\?)/i, (msg) ->
    channel = msg.match[1] or msg.match[2]
    uriChannel = encodeURIComponent channel
    if not channel?
      msg.send "Sorry, that is not a valid channel! :("
      return
    
    msg.http("#{process.env.HUBOT_MUMBLE_PARTNER_URL}/mumble/userList/#{uriChannel}")
      .get() (err, res, body) ->
        if err
          msg.send "Sorry, #{msg.envelope.user.name}, I ran into a problem :( (#{err})"
          return
        
        payload = JSON.parse(body)
        if not payload.channel?
          console.log "Error: specific channel not returned!"
          msg.send "Sorry, #{msg.envelope.user.name}, I ran into a problem :( (Did didn't get info about #{channel})"
          return
        
        if payload.users.length isnt 0
          users = payload.users
          message = "Online in #{users[0].room}: "
          for key, user of users
            unless user.name is robot.name
              username = create_quiet_username(user.name)
              message = message + "#{username}, "
          message = message.substring(0, message.length - 2)
        else
          message = "No one in #{channel}!"
        
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