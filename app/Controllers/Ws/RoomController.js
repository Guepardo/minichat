'use strict'

class RoomController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
    this.subscriptions = this.socket.channel.subscriptions
    this.socket.emit('socketId', this.socket.id)

    this.initializePeers()
  }

  getSockets() {
    return Array.from(this.subscriptions.get(this.socket.topic))
  }

  initializePeers() {
    this.getSockets().map(otherSocket => {
      if (otherSocket.id != this.socket.id) {
        this.socket.emit('initialize', otherSocket.id)
      }
    })
  }

  onSignalPeer({ signal, socketId }) {
    console.log(socketId, signal)
    this.getSockets().map(otherSocket => {
      if (otherSocket.id === socketId) {
        otherSocket.emit('signalPeer', {
          socketIdFrom: this.socket.id,
          signal,
          socketId
        })
      }
    })
  }

  onClose() {
    console.log('onClose')
    this.getSockets().map(socket => socket.emit('onClose', this.socket.id))
  }
}

module.exports = RoomController
