'use strict'

// const ui = require('./ui')
// const nav = require('../nav/ui')
const player = require('../player')
const config = require('../config')
const socket = require('../socket')

const getLobby = () => {
  return $.ajax({
    url: `${config.apiUrl}/lobby`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${player.token}`
    }
  })
    .then(res => {
      res.lobby.length ? addPlayer(res) : createLobby()
    })
}

// Request new lobby creation
const createLobby = () => {
  return $.ajax({
    url: `${config.apiUrl}/lobby`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${player.token}`
    },
    data: {
      players: [player._id]
    }
  })
    .then(res => socket.updatePlayers(res))
}

const addPlayer = (res) => {
  return $.ajax({
    url: `${config.apiUrl}/add-player/${res.lobby[0]._id}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${player.token}`
    },
    data: {
      player: player._id
    }
  })
    .then(res => socket.updatePlayers(res))
}

const removePlayer = (res) => {
  return $.ajax({
    url: `${config.apiUrl}/remove-player/${res.lobby[0]._id}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${player.token}`
    },
    data: {
      player: player._id
    }
  })
}

const deleteLobbies = () => {
  return $.ajax({
    url: `${config.apiUrl}/lobby`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${player.token}`
    }
  })
}

module.exports = {
  getLobby,
  createLobby,
  addPlayer,
  removePlayer,
  deleteLobbies
}
