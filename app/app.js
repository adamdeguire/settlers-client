// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

const board = require('./game/board')
const authEvents = require('./auth/events')
const nav = require('./nav/ui')
const socket = require('./socket')
const road = require('./game/road')

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

  $('#newGame').on('click', () => {
    // $('#newGame').hide('slow')
    socket.connect()
    socket.greetUser()

    board.initialize()
    $('.intersect').on('click', (event) => {
      board.placeSettlement(event)
      road.closestIntersection(event)
    })
  })

  $('#chatInput').on('submit', socket.sendMessage)

  $('.hideOnStart').hide()
})
