'use strict'

// TODO: https://adonisjs.com/docs/3.2/controllers#_defining_controller
const Room = use('App/Models/Room')

class RoomController {
  async create({ view }) {
    return view.render('room.create')
  }

  async store({ view, request, response }) {
    const roomData = request.only(['name', 'password'])
    const code = Math.random().toString(36).substring(7)

    const room = await Room.create({
      ...roomData,
      code: code
    })

    return response.route('room.show', { code })
  }

  async show({ view, params }) {
    return view.render('room.show', { code: params.code })
  }
}

module.exports = RoomController
