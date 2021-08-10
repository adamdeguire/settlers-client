'use strict'
const io = require('socket.io-client')
const apiUrl = require('./config').apiUrl
const socket = io(apiUrl)
const player = require('./player')
const resources = require('./game/resources')

let connected = player.connected
let joined = player.joined
let connectedCount = 0

const connect = () => {
  if (connected) return
  socket.emit('new-user')
  socket.on('connection')
  connected = true
}

socket.on('new-user', () => { connectedCount++ })
socket.on('message', (data) => displayMessage(data))

const greetUser = () => {
  if (joined) return
  joined = true
  const user = player.email

  let emitData = { message: `${user} joined the game!` }
  socket.emit('message', emitData)
  emitData = { message: `${3 - connectedCount} spots remaining.` }
  setTimeout(() => { socket.emit('message', emitData) }, 1000)

  let data = { message: `Welcome, ${user}!` }
  displayMessage(data)
  data = { message: `${3 - connectedCount} spots remaining.` }
  setTimeout(() => { displayMessage(data) }, 1000)
}

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

// Receive
socket.on('click', (targetId) => {
  $(`#${targetId}`).trigger('click')
})

// Send
const sendClick = (targetId) => {
  socket.emit('click', targetId)
}

socket.on('start-game', (gameBoard) => {
  $('#startGame').hide('slow')
  $('.showOnStartGame').show('slow')
  $('#settlements').show()
  $('.settlement').draggable()
  $('.board').html(gameBoard)
})

const startGame = (res) => {
  const gameBoard = $('.board').html()
  updateLog(`${player.email} started the game.`)
  socket.emit('start-game', gameBoard)
}

const updateLog = (message) => {
  socket.emit('message', { message })
  displayMessage({ message })
}

socket.on('settlement', (settlements) => {
  $('#settlements').html(settlements)
})

const updateSettlements = (settlements) => {
  socket.emit('settlement', settlements)
}

socket.on('road', (roads) => {
  $('#roads').html(roads)
})

const updateRoads = (roads) => {
  socket.emit('road', roads)
}

const hideColor = (color) => {
  socket.emit('hide-color', color)
  $('#selectColor').hide('slow')
}

const rollDice = (roll1, roll2) => {
  socket.emit('dice-roll', roll1, roll2)
  const message = resources.getResources(roll1 + roll2)
  setTimeout(() => displayMessage({ message }), 800)
}

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

socket.on('hide-color', color => {
  $(`#${color}`).hide('slow')
})

module.exports = {
  connect,
  startGame,
  hideColor,
  rollDice,
  updateLog,
  sendMessage,
  displayMessage,
  greetUser,
  sendClick,
  updateSettlements,
  updateRoads
}
