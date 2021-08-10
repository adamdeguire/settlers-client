'use strict'
const player = require('../player')
const nav = require('../nav/ui')

// On API Response Status 201, Created
// Show confirmation to user and clear form fields
const onSignUpSuccess = (response) => {
  nav.transitionText('#message', `New user ${response.user.email} created. Sign in with your new account to play!`)
  $('#signUp').trigger('reset')
}

// On API Response Status 400+
const onSignUpFailure = () => {
  nav.transitionText('#message', 'Something went wrong, please try again.')
  $('#signUp').trigger('reset')
}

// On API Response Status 200, OK
// Transition to Main Menu and clear form fields
const onSignInSuccess = (response) => {
  nav.onMainMenu()
  nav.transitionText('#message', `Welcome back, ${response.user.email}!`)
  $('#signIn').trigger('reset')
  player._id = response.user._id
  player.token = response.user.token
  player.email = response.user.email
}

// On API Response Status 400+
const onSignInFailure = (response) => {
  nav.transitionText('#message', 'No account found. Sign up instead?')
  $('#signIn').trigger('reset')
}

// On API Response Status 204, No Content
// Transition to login view and display confirmation to user
const onSignOutSuccess = () => {
  nav.transitionHTML('#showTable', '')
  nav.transitionText('#message', 'Come back soon!')
  $('.hideOnStart').hide(400)
  setTimeout(() => $('.showOnStart').show(600), 400)
  nav.transitionText('#authHeader', 'New here?')
  $('body').on('click', () => {
    nav.transitionText('#message', ' ')
    $('body').off()
  })
  console.log('test')
}

// On API Response Status 204, No Content
// Display confirmation to user and reset form fields
const onChangePasswordSuccess = (response) => {
  nav.transitionText('#message', 'Password Changed!')
  $('#changePassword').trigger('reset')
  $('#changePassword').hide(400)
  setTimeout(() => $('#neat').show(600), 400)
}

// On API Response Status 400+
const onChangePasswordFailure = (response) => {
  $('#changePassword').trigger('reset')
  switch (response.status) {
    case 400:
      nav.onFailure()
      break
    case 422:
      nav.transitionText('#message', 'Invalid password, please try again.')
      break
  }
}

module.exports = {
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onSignOutSuccess,
  onChangePasswordSuccess,
  onChangePasswordFailure
}
