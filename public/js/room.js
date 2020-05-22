$(function() {
  ws = adonis.Ws().connect()

  ws.on('open', () => {
    subscribeToRoom()
  })

  ws.on('error', () => {
    alert('nada')
  })

  function subscribeToRoom() {
    let roomName = prompt('sala')

    const room = ws.subscribe('room:' + roomName)

    room.on('error', (err) => {
      console.log(err)
    })

    room.on('message', (message) => {
      console.log(message)
    })

    setInterval(() => {
      room.emit('message', roomName)
    }, 1000);
  }
})

