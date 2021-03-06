'use strict'

// const ui = require('./ui')
// const nav = require('../nav/ui')
const player = require('../player')
const config = require('../config')
const ui = require('./ui')
const game = require('../game')

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
        owner: player._id,
        players: game.players,
        board: $('#board').html()
      }
    }
  })
    .then(ui.onStartGameSuccess)
    .catch(ui.onFailure)
}

const updateGame = () => {
  return $.ajax({
    url: `${config.apiUrl}/games/${game._id}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${player.token}`
    },
    data: {
      game: {
        owner: game.owner,
        players: game.players,
        settlements: $('#settlements').html(),
        roads: $('#roads').html()
      }
    }
  })
    .then(ui.onUpdateGameSuccess)
    .catch(ui.onFailure)
}

const deleteGame = () => {
  return $.ajax({
    url: `${config.apiUrl}/games/${game._id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${player.token}`
    }
  })
    .then(ui.onDeleteGameSuccess)
    .catch(ui.onFailure)
}

module.exports = {
  createGame,
  updateGame,
  deleteGame
}
