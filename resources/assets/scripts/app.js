// import alertify from 'alertifyjs'
import RoomController from './controllers/room_controller'

const roomController = new RoomController()

var app = new Vue({
  el: '#app',
  data: {
    messages: [],
    inputMessage: "",
    streams: [],
    microphoneActive: true,
    cameraActive: true,
  },

  created: function () {
    alertify.set('notifier','position', 'top-left');
    roomController.connect()
    roomController.on('data', this.addMessage)

    roomController.on('stream', (id, stream) => {
      console.log({ stream, id });
      let vid = document.createElement('video');
      vid.setAttribute('autoplay', true);
      vid.setAttribute('id', id);
      vid.setAttribute('controls', false);
      vid.setAttribute('class', 'd-flex');
      vid.volume = 1;
      document.querySelector('.video-tiles-box').appendChild(vid);
      setTimeout(() => {
        vid.srcObject = stream;
      }, 100);
    })

    roomController.on('removeStream', socketId => {
      document.getElementById(socketId).remove()
      alertify.message(`Usuário ${socketId} saiu da sala.`)
    })

    roomController.on('onConnection', socketId => {
      alertify.success(`Usuário ${socketId} entrou da sala.`)
    })

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      roomController.addStream(stream)
      globalStream = stream
    }).catch(() => { })

    setInterval(() => {
      // roomController.broadcast('lore asdlfk jasdlfasjdlfjas df')
    }, 5000)
  },

  methods: {
    addMessage: function (username, text) {
      this.messages.push({
        username,
        text
      })
    },

    submitMessage: function () {
      if (this.inputMessage.trim() == '') {
        return
      }

      roomController.broadcast(this.inputMessage)
      this.addMessage('Self', this.inputMessage)
      this.inputMessage = ''
    },

    toggleMicrophone: function () {
      this.microphoneActive = !this.microphoneActive
      roomController.toggleActiveAudioStream()
    },

    toggleCamera: function () {
      roomController.toggleActiveVideoStream()
      this.cameraActive = !this.cameraActive
    },

    leaveRoom: function () {
      window.location = '/'
    },

    screenShare: function () {
      navigator
        .mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(stream => {
          roomController.addStream(stream)
        })
    }
  }
})