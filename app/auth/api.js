'use strict'
const ui = require('./ui')
const nav = require('../nav/ui')
const store = require('../store')
const config = require('../config')

// Request new user creation
const signUp = (data) => {
  return $.ajax({
    url: `${config.apiUrl}/sign-up`,
    method: 'POST',
    data: data
  })
    .then(ui.onSignUpSuccess)
    .catch(ui.onSignUpFailure)
}

// Request creation of authentication token for existing user
const signIn = (data) => {
  return $.ajax({
    url: `${config.apiUrl}/sign-in`,
    method: 'POST',
    data: data
  })
    .then(ui.onSignInSuccess)
    .catch(ui.onSignInFailure)
}

// Request deletion of authentication token for existing user
const signOut = () => {
  return $.ajax({
    url: `${config.apiUrl}/sign-out`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${store.token}`
    }
  })
    .then(ui.onSignOutSuccess)
    .catch(nav.onFailure)
}

// Request update to existing user password
const changePassword = (data) => {
  return $.ajax({
    url: `${config.apiUrl}/change-password`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${store.token}`
    },
    data: data
  })
    .then(ui.onChangePasswordSuccess)
    .catch(ui.onChangePasswordFailure)
}

module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword
}
