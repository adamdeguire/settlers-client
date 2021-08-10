'use strict'
const io = require('socket.io-client')
const apiUrl = require('./config').apiUrl
const socket = io(apiUrl)
const player = require('./player')
const game = require('./game')
const resources = require('./game/resources')

let connected = player.connected
let joined = player.joined

const connect = () => {
  if (connected) return
  socket.emit('new-user')
  socket.on('connection')
  connected = true
}

// SOCKET BROADCAST HANDLERS
// Player Added To Lobby
socket.on('add-player', (playerId) => {
  game.players.push(playerId)
  game.players = [...new Set(game.players.sort())]
  console.log(game.players)
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
  $('#startGame').hide('slow')
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

// SOCKET EMIT HANDLERS
// Player Joined Lobby
const greetUser = () => {
  if (joined) return
  joined = true
  const user = player.email
  game.players.push(player._id)
  socket.emit('add-player', player._id)

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
  event.preventDefault()
  if (!connected) {
    displayMessage({ message: 'Join the game to enable chat.' })
    return
  }
  const user = player.email
  const message = $('#chat').val()
  $('#chat').val('')
  displayMessage({ message, user })
  socket.emit('message', { message, user })
}

// Player Started Game
const startGame = (res) => {
  console.log('test1')
  const gameBoard = $('.board').html()
  updateLog(`${player.email} started the game.`)
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
}

// Player Built Road
const updateRoads = (roads) => {
  socket.emit('road', roads)
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

module.exports = {
  connect,
  startGame,
  hideColor,
  rollDice,
  updateLog,
  sendMessage,
  displayMessage,
  greetUser,
  updateSettlements,
  updateRoads
}
