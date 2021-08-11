'use strict'

const socket = require('../socket')
const api = require('./api')

const onJoinLobby = () => {
  api.getLobby()
  $('#joinLobby').hide('slow')
  $('.showOnJoinLobby').show('slow')
  socket.connect()
  socket.greetUser()
}

const onStartGame = () => {
  api.deleteLobbies()
}

module.exports = {
  onJoinLobby,
  onStartGame
}
