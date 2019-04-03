'use strict'

const webSocketServer = require('websocket').server
const http = require('http')

const history = []
const clients = []

/**
 * Stores received message in chat history
 * and broadcasts history to all connected clients.
 * @return history
 */
function receiveMessage(msg) {
  console.log(new Date() + ' Received message ' + msg.utf8Data)
  msg = JSON.parse(msg.utf8Data)
  msg.time = new Date().toLocaleTimeString()
  history.push(msg)
  broadcastHistory()
  return history
}

/**
 * Broadcasts chat history to all connected clients
 * and ensure history's size remains reasonable
 */
function broadcastHistory() {
  const data = {
    type: 'history',
    data: history
  }
  for (let i = 0; i < clients.length; i++) {
    clients[i].sendUTF(JSON.stringify(data))
  }
  history = history.slice(-50)
}

/**
 * Creates a connection for valid requests
 * and registers chat functions with the connection.
 * When a new connection is made, broadcast existing
 * chat history to all clients.
 */
function connectionHandler(request) {
  const connection = request.accept(null, request.origin)
  const index = clients.push(connection) - 1
  console.log(new Date() + ' Peer ' + connection.remoteAddress + ' connected.')
  connection.on('message', receiveMessage)
  connection.on('close', function() {
    console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.')
    clients.splice(index, 1)
  })
  if (history.length > 0) {
    broadcastHistory()
  }
  return clients
}

const server = http.createServer(function(request, response) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
})
server.listen(8081, function() {
  console.log(new Date() + ' Server is listening on port ' + 8081)
})
const socketServer = new webSocketServer({
  httpServer: server
})
socketServer.on('request', connectionHandler)

module.exports = {
  httpServer: server,
  socketServer: socketServer,
  clients: clients,
  history: history,
  receiveMessage: receiveMessage,
  broadcastHistory: broadcastHistory,
  connectionHandler: connectionHandler
}
