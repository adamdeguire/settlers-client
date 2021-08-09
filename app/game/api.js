'use strict'

// const ui = require('./ui')
// const nav = require('../nav/ui')
const player = require('../player')
const config = require('../config')
const ui = require('./ui')

// Request new game creation
const createGame = () => {
  return $.ajax({
    url: `${config.apiUrl}/games`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${player.token}`
    },
    data: {
      game: {
        owner: player._id
      }
    }
  })
    .then(ui.onStartGameSuccess)
    .catch(err => console.log(err))
}

const updateGame = (key, value) => {
  return $.ajax({
    url: `${config.apiUrl}/change-password`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${player.token}`
    },
    data: {
      game: {
        _id: player.gameId,
        key,
        value
      }
    }
  })
    .then()
    .catch()
}

module.exports = {
  createGame,
  updateGame
}
