'use strict'

const board = require('./board')
const settlements = require('./settlements')
const roads = require('./roads')
const socket = require('../socket')
const player = require('../player')
const api = require('./api')
const game = require('../game')

const onJoinLobby = () => {
  $('#joinLobby').hide('slow')
  $('.showOnJoinLobby').show('slow')
  socket.connect()
  socket.greetUser()
}

const onSelectColor = (event) => {
  player.color = event.target.id
  socket.updateLog(`${player.email} selected ${player.color}.`)
  socket.hideColor(player.color)
  $('#startGame').show('slow')
  $('#startGame').on('click', onStartGame)
}

const onStartGame = () => {
  $('.hideOnStartGame').hide('slow')
  $('.showOnStartGame').show('slow')
  board.initialize()
  api.createGame()
}

const onQuitGame = () => {
  game.players.splice(game.players.indexOf(player._id), 1)
  console.log(player._id, game.owner)
  if (player._id === game.owner) api.deleteGame()
  else api.updateGame('players', game.players)
  game._id = undefined
  game.owner = undefined
  game.players = []
}

const onBuildSettlement = () => {
  const id = `${player.color}settlement${player.settlements.length}`
  const settlementHTML = `<div id="${id}" class="settlement"></div>`
  $('#settlements').append(settlementHTML)
  $('body').off('mouseup', '.settlement')
  $(`#${id}`).css('background-color', player.color).draggable()
  $('body').on('mouseup', '.settlement', settlements.placeSettlement)
}

const onBuildRoad = () => {
  const id = `${player.color}road${player.roads.length}`
  const roadHTML = `<div id="${id}" class="road r1"></div>`
  $('#roads').append(roadHTML)
  $('body').off('mouseup', '.road')
  $(`#${id}`).css('background-color', player.color).draggable()
  $('body').on('mouseup', '.road', roads.placeRoad)
}

module.exports = {
  onJoinLobby,
  onSelectColor,
  onStartGame,
  onQuitGame,
  onBuildSettlement,
  onBuildRoad
}
