const server = require('../src/server.js')
const WebSocket = require('ws')

QUnit.test( "Ensure we can connect to the websocket", function( assert ) {
  const socket = new WebSocket('ws://localhost:8081')
  assert.ok(socket.url == 'ws://localhost:8081', "Passed!" );
});


QUnit.test( "When receiving a message, ensure the message history is updated", function( assert ) {
  var msg = {
      utf8Data:
      {text: 'test',
      author_id: 'JG'}
  };
    console.log(JSON.stringify(msg))
  server.receiveMessage()
  assert.ok(server.history.length == 1, "Passed!" );
});
