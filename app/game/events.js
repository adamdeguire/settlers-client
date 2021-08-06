'use strict'

const board = require('./board')
const socket = require('../socket')
const api = require('./api')

const onJoinLobby = () => {
  $('#joinLobby').hide('slow')
  $('#startGame').show('slow')
  socket.connect()
  socket.greetUser()
}

const onStartGame = () => {
  $('.hideOnStartGame').hide('slow')
  $('.showOnStartGame').show('slow')
  board.initialize()
  socket.startGame()
  api.createGame()
}

module.exports = {
  onJoinLobby,
  onStartGame
}
