'use strict'
const game = require('../game')
const socket = require('../socket')

const onStartGameSuccess = (res) => {
  console.log(res)
  game._id = res.game._id
  game.owner = res.game.owner
  socket.startGame(res)
}

module.exports = {
  onStartGameSuccess
}
