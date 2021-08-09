// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

import 'jquery-ui/ui/widgets/draggable'
const gameEvents = require('./game/events')
const authEvents = require('./auth/events')
const nav = require('./nav/ui')
const socket = require('./socket')
const rollDice = require('./game/dice/roll').rollDice

// use require without a reference to ensure a file is bundled
// require('./example')

$(() => {
  $('#signUp').on('submit', authEvents.onSignUp)
  $('#signIn').on('submit', authEvents.onSignIn)
  $('#signOut').on('click', authEvents.onSignOut)
  $('#changePassword').on('submit', authEvents.onChangePassword)

  // Navigation Event Listeners
  $('#signUpInstead').on('click', nav.onSignUpInstead)
  $('#signInInstead').on('click', nav.onSignInInstead)
  $('#showPassword').on('click', nav.onShowPassword)
  $('#cancelSignOut, #showSignOut').on('click', nav.onAreYouSure)
  $('#changeTheme').on('click', nav.changeTheme)
  $('#navTitle').on('click', nav.onMainMenu)
  $('footer').on('click', nav.toggleFooter)
  $('#account').on('click', nav.onAccount)
  $('#neat').on('click', nav.onAccount)

  $('#joinLobby').on('click', gameEvents.onJoinLobby)
  $('#buildSettlement').on('click', gameEvents.onBuildSettlement)
  $('#buildRoad').on('click', gameEvents.onBuildRoad)
  $('.color').on('click', gameEvents.onSelectColor)

  $('#chatInput').on('submit', socket.sendMessage)

  $('.hideOnStart').hide()
  $('#rollDice').on('click', rollDice)
})
