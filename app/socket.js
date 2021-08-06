'use strict'

const io = require('socket.io-client')
const socket = io('http://localhost:4741')
const store = require('./store')
let connected = store.connected
let joined = store.joined
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
  const user = store.email

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
  if (!data.message) return
  if (!data.user) data.user = 'Server'
  $(`<p>${data.user}: ${data.message}</p>`).hide().prependTo('#gameLog').show('slow')
}

const sendMessage = (event) => {
  if (!connected) {
    displayMessage({ message: 'Join the game to enable chat.', user: 'Server' })
    return
  }
  event.preventDefault()
  const user = store.email
  const message = $('#chat').val()
  $('#chat').val('')
  displayMessage({ message, user })
  socket.emit('message', { message, user })
}

// Receive
socket.on('board', (targetId) => {
  $(`#${targetId}`).trigger('click')
})

// Send
const sendBoard = (targetId) => {
  socket.emit('board', targetId)
}

const update = (message) => {
  socket.emit('message', { message })
  displayMessage({ message })
}

module.exports = {
  connect,
  update,
  sendMessage,
  greetUser,
  sendBoard
}
