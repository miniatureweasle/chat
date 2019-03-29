'use strict'

var webSocketServer = require('websocket').server
var http = require('http')

var history = []
var clients = []

function receiveMessage(msg) {
  console.log(new Date() + ' Received message ' + msg.utf8Data)
  msg = JSON.parse(msg.utf8Data)
  msg.time = new Date().toLocaleTimeString()
  history.push(msg)
  broadcastHistory()
  return history
}

function broadcastHistory() {
  var data = { type: 'history', data: history }
  for (var i = 0; i < clients.length; i++) {
    clients[i].sendUTF(JSON.stringify(data))
    history = history.slice(-50)
  }
}

function connectionHandler(request) {
  var connection = request.accept(null, request.origin)
  console.log(
    new Date() + ' Peer ' + connection.remoteAddress + ' connected.')
  var index = clients.push(connection) - 1
  connection.on('message', receiveMessage)
  connection.on('close', function (){
      console.log(
    new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
  )
  clients.splice(index, 1)
  }) 
  if (history.length > 0) {
    broadcastHistory()
  }
}

var server = http.createServer(function(request, response) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
})
server.listen(8081, function() {
  console.log(new Date() + ' Server is listening on port ' + 8081)
})
var socketServer = new webSocketServer({ httpServer: server })
socketServer.on('request', connectionHandler)

module.exports = {
  clients: clients,
  history: history,
  receiveMessage: receiveMessage
}
