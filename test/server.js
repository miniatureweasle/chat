'use strict'

const server = require('../src/server.js')
const WebSocket = require('ws')

let socket = new WebSocket('ws://localhost:8081')

QUnit.test('Ensure we can connect to the websocket', function(assert) {
  assert.ok(socket.url == 'ws://localhost:8081', 'Passed!')
  server.clients.length = 0
})

QUnit.test('Ensure connecting increments client list.', assert => {
  // shim in a fake request object to accept the connection
  let accept = function(a, b) {
    return {
      on: function(a, b) {
        return true
      },
      remoteAddress: 'http://127.0.0.1',
      origin: 'http://127.0.0.1'
    }
  }
  let request = { accept: accept }
  let clients = server.connectionHandler(request)
  assert.ok(clients.length == 1, 'Passed!')
  server.clients.length = 0
})

QUnit.test('When receiving a message, ensure the message history is updated', function(assert) {
  let msgContent = JSON.stringify({
    text: 'test message',
    authorId: '123456789',
    authorName: 'John Doe'
  })
  server.receiveMessage({ utf8Data: msgContent })
  assert.ok(server.history.length == 1, 'Passed!')
  server.history = []
})

QUnit.test('Ensure chat history does not exceed 50 messages', function(assert) {
  for (let i = 0; i < 60; i++) {
    let msgContent = JSON.stringify({
      text: 'test message',
      authorId: '123456789',
      authorName: 'John Doe'
    })
    var history = server.receiveMessage({ utf8Data: msgContent })
  }
  assert.ok(history.length == 50, 'Passed!')
  server.history = []
})
