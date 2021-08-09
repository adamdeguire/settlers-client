'use strict'
const player = require('../player')
const socket = require('../socket')

const onStartGameSuccess = (res) => {
  player.gameId = res.game._id
  socket.startGame()
}

module.exports = {
  onStartGameSuccess
}
