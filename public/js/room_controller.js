class RoomController {
  constructor() {
    this.room = null
    this.myRoomId = null
    this.peers = {}
    this._event = []
    this.stream = null
  }

  addStream(stream) {
    this.stream = stream
  }

  connect() {
    const websocket = adonis.Ws().connect()

    websocket.on('open', () => { })
    websocket.on('error', () => { })
    websocket.on('onClose', () => {
      this.debug('deletePeer', "Deleting peer")
    })

    let roomName = window.location.pathname.replace('/', '')
    this.room = websocket.subscribe('room:' + roomName)

    this.room.on('connect', data => {
      this.debug('Room Connected')
    })

    this.room.on('error', (err) => {
      this.debug('error', err)
    })

    this.room.on('signalPeer', ({ socketId, signal, socketIdFrom }) => {
      this.debug('signalPeer', "Adding new peer " + socketId)
      console.log(socketIdFrom)

      if (!this.peers.hasOwnProperty(socketIdFrom)) {
        this.peers[socketIdFrom] = this.createPeer(socketIdFrom, false)
      }
      this.peers[socketIdFrom].signal(signal)
    })

    this.room.on('onClose', (socketId) => {
      this.removePeer(socketId)
      this.fire('removeStream', socketId)
    })

    this.room.on('socketId', socketId => {
      this.debug('socketId', socketId)
      this.socketId = socketId
    })

    this.room.on('initialize', socketId => {
      this.debug('initialize socketId', socketId)
      this.peers[socketId] = this.createPeer(socketId, true)
    })
  }

  removePeer(socketId) {
    delete this.peers[socketId]
  }

  createPeer(socketId, initiator) {
    let peer = new SimplePeer({
      trickle: true,
      initiator: initiator
    })

    peer.on('signal', signal => {
      this.debug('signalPeer', signal)
      this.room.emit('signalPeer', {
        signal,
        socketId
      })
    })

    peer.on('error', err => this.debug('peer error', err))

    peer.on('close', err => {
      this.removePeer(socketId)
      this.fire('removeStream', socketId)
    })

    peer.on('connect', () => {
      this.debug('peer connected', socketId)
      peer.addStream(this.stream)
    })

    peer.on('data', data => {
      this.fire('data', socketId, String.fromCharCode.apply(null, data))
    })

    peer.on('stream', stream => {
      this.fire('stream', socketId, stream)
    })

    return peer
  }

  broadcast(message) {
    for (let socketId in this.peers) {
      if (this.peers.hasOwnProperty(socketId) && this.peers[socketId] != null) {
        this.peers[socketId].send(message)
      }
    }
  }

  // TODO: Estudar se isso é viável.
  broadcastStream(stream) {
    for (let socketId in this.peers) {
      if (this.peers.hasOwnProperty(socketId) && this.peers[socketId] != null) {
        this.peers[socketId].addStream(stream)
      }
    }
  }

  debug(type, notice) {
    console.log(type, notice)
  }

  on(event, fun) {
    if (!this._event.hasOwnProperty(event)) {
      this._event[event] = []
    }
    this._event[event].push(fun)
  }

  fire(event, ...parameters) {
    if (this._event.hasOwnProperty(event)) {
      for (let fun of this._event[event]) {
        fun(...parameters)
      }
    }
  }
}

