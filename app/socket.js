'use strict'
const io = require('socket.io-client')
const apiUrl = require('./config').apiUrl
const socket = io(apiUrl)
const player = require('./player')
const game = require('./game')
const resources = require('./game/resources')
const board = require('./game/board')

let connected = player.connected
let joined = player.joined

// User Entered Site
const connect = () => {
  if (connected) return
  socket.emit('new-user')
  socket.on('connection')
  connected = true
}

// SOCKET BROADCAST HANDLERS
// Player Added To Lobby
socket.on('update-players', (players) => {
  game.players = players
  game.players = [...new Set(game.players.sort())]
})

// Other Player Selected Color
socket.on('hide-color', color => {
  $(`#${color}`).hide('slow')
})

// Message Received
socket.on('message', (data) => displayMessage(data))

// Other Player Started Game
socket.on('start-game', (gameBoard, res) => {
  game._id = res.game._id
  game.owner = res.game.owner
  $('.hideOnStartGame').hide('slow')
  $('.showOnStartGame').show('slow')
  $('#settlements').show()
  $('.settlement').draggable()
  $('.board').html(gameBoard)
})

// Other Player Rolled Dice
socket.on('dice-roll', (roll1, roll2) => {
  const rollValue = roll1 + roll2
  $('#die1').load(`public/images/die${roll1}.txt`)
  $('#die2').load(`public/images/die${roll2}.txt`)
  $('.land').each(function () {
    const marker = $(this).find(`.marker${rollValue}`)
    marker.css('background-size', '75%')
    setTimeout(() => marker.css('background-size', '50%'), 800)
  })
  const message = resources.getResources(rollValue)
  setTimeout(() => displayMessage({ message }), 800)
})

// Other Player Built Settlement
socket.on('settlement', (settlements) => {
  $('#settlements').html(settlements)
})

// Other Player Built Road
socket.on('road', (roads) => {
  $('#roads').html(roads)
})

// Host Quit Game
socket.on('host-quit', () => {
  displayMessage({ message: 'The host has ended the game. Returning to menu.' })
  setTimeout(() => {
    board.clearBoard()
    $('.showOnStartGame, .showOnJoinLobby, #startGame').hide(400)
    setTimeout(() => $('.showOnSignIn, #joinLobby').show(600), 400)
    $('#gameLog').html('')
    $('.color').show()
  }, 5000)
  game._id = undefined
  game.owner = undefined
  game.players = []
})

// Next Turn
socket.on('next-turn', (nextPlayer) => {
  const user = player.email
  if (player._id === nextPlayer) {
    setTimeout(() => {
      updateLog(`${user}'s turn.`)
      $('#rollDice').show(400)
    }, 1200)
  }
})

// SOCKET EMIT HANDLERS
// Player Joined Lobby
const greetUser = () => {
  const user = player.email
  if (joined) return
  joined = true
  let emitData = { message: `${user} joined the game!` }
  socket.emit('message', emitData)
  setTimeout(() => {
    emitData = { message: `${4 - game.players.length} spots remaining.` }
    socket.emit('message', emitData)
  }, 1000)

  let data = { message: `Welcome, ${user}!` }
  displayMessage(data)
  setTimeout(() => {
    data = { message: `${4 - game.players.length} spots remaining.` }
    displayMessage(data)
  }, 1000)
}

// Player Sent Message (display)
const displayMessage = (data) => {
  let display
  if (!data.message) return
  if (!data.user) {
    display = `<p>${data.message}</p>`
  } else {
    display = `<p>${data.user}: ${data.message}</p>`
  }
  $(display).hide().prependTo('#gameLog').show('slow')
}

// Player Sent Message (emit)
const sendMessage = (event) => {
  const user = player.email
  event.preventDefault()
  if (!connected) {
    displayMessage({ message: 'Join the game to enable chat.' })
    return
  }

  const message = $('#chat').val()
  $('#chat').val('')
  displayMessage({ message, user })
  socket.emit('message', { message, user })
}

// Player Joined/Left
const updatePlayers = (res) => {
  game.players = res.lobby.players
  socket.emit('update-players', res.lobby.players)
}

// Player Started Game
const startGame = (res) => {
  const user = player.email
  const gameBoard = $('.board').html()
  updateLog(`${user} started the game.`)
  socket.emit('start-game', gameBoard, res)
}

// Player Made Move
const updateLog = (message) => {
  socket.emit('message', { message })
  displayMessage({ message })
}

// Player Built Settlement
const updateSettlements = (settlements) => {
  socket.emit('settlement', settlements)
  // if (player._id === game.owner) api.updateGame()
}

// Player Built Road
const updateRoads = (roads) => {
  socket.emit('road', roads)
  // if (player._id === game.owner) api.updateGame()
}

// Player Selected Color
const hideColor = (color) => {
  socket.emit('hide-color', color)
  $('#selectColor').hide('slow')
}

// Player Rolled Dice
const rollDice = (roll1, roll2) => {
  socket.emit('dice-roll', roll1, roll2)
  const message = resources.getResources(roll1 + roll2)
  setTimeout(() => displayMessage({ message }), 800)
}

// Host Quit Game
const hostQuit = () => {
  socket.emit('host-quit')
  $('#gameLog').html('')
  $('.color').show()
}

// Non-Host Quit Game
const playerQuit = () => {
  const user = player.email
  socket.emit('message', { message: `${user} quit the game.` })
}

// Player Ended Turn
const nextTurn = (nextPlayer) => {
  // $('#rollDice, #build').hide(400)
  const user = player.email
  setTimeout(() => {
    updateLog(`${user} ended their turn.`)
    socket.emit('next-turn', nextPlayer)
  }, 400)
}

module.exports = {
  connect,
  startGame,
  hideColor,
  rollDice,
  updatePlayers,
  updateLog,
  sendMessage,
  displayMessage,
  greetUser,
  updateSettlements,
  updateRoads,
  hostQuit,
  playerQuit,
  nextTurn
}
