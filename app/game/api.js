'use strict'

// const ui = require('./ui')
// const nav = require('../nav/ui')
const store = require('../store')
const config = require('../config')

// Request new game creation
const createGame = () => {
  console.log(store._id)
  return $.ajax({
    url: `${config.apiUrl}/game`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${store.token}`
    },
    data: {
      game: {
        owner: store._id
      }
    }
  })
    .then(res => { store.gameId = res.game._id })
    .catch(err => console.log(err))
}

const updateGame = () => {
  return $.ajax({
    url: `${config.apiUrl}/change-password`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${store.token}`
    },
    data: {
      game: {
        _id: store.gameId,
        owner: store._id,
        board: $('#board').html(),
        settlements: $('#settlements').html(),
        roads: $('#roads').html()
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
