// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

import 'jquery-ui/ui/widgets/draggable'
const lobbyEvents = require('./lobby/events')
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
  $('#account').on('click', nav.onAccount)
  $('#neat').on('click', nav.onMainMenu)

  $('#joinLobby').on('click', lobbyEvents.onJoinLobby)
  $('#buildSettlement').on('click', gameEvents.onBuildSettlement)
  $('#buildRoad').on('click', gameEvents.onBuildRoad)
  $('.color').on('click', gameEvents.onSelectColor)
  $('#endTurn').on('click', gameEvents.onEndTurn)
  $('#quitGame').on('click', gameEvents.onQuitGame)
  $('#chatInput').on('submit', socket.sendMessage)

  // Observe game piece updates
  const settlements = document.querySelector('#settlements')
  const roads = document.querySelector('#roads')

  const settlementObserver = new MutationObserver(gameEvents.onNewGamePiece)
  const roadObserver = new MutationObserver(gameEvents.onNewGamePiece)

  settlementObserver.observe(settlements, { subtree: true, childList: true })
  roadObserver.observe(roads, { subtree: true, childList: true })

  $('.hideOnStart').hide()
  $('#rollDice').on('click', rollDice)
})
