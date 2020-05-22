'use strict'

class RoomController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
    console.log(socket.topic)
  }

  onMessage(message) {
    console.log(message)
    this.socket.broadcastToAll('message', 'channel ' + message)
  }
}

module.exports = RoomController
