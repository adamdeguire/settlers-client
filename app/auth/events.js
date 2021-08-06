'use strict'
const getFormFields = require('../../lib/get-form-fields')
const api = require('./api.js')

// Pull data from Sign Up form and send to API
const onSignUp = (event) => {
  event.preventDefault()
  const data = getData(event)
  api.signUp(data)
}

// Pull data from Sign In form and send to API
const onSignIn = (event) => {
  event.preventDefault()
  const data = getData(event)
  api.signIn(data)
}

// Delete current authentication token
const onSignOut = (event) => {
  event.preventDefault()
  api.signOut()
}

// Pull data from Change Password form and send to API
const onChangePassword = (event) => {
  event.preventDefault()
  const data = getData(event)
  api.changePassword(data)
}

// HELPER:
// Extract and format data from form input
const getData = (event) => {
  const form = event.target
  const data = getFormFields(form)
  return data
}

module.exports = {
  onSignUp,
  onSignIn,
  onSignOut,
  onChangePassword
}
