'use strict'

// Slowly transition text of html element with fade out/in
// ex: transitionText('#message', 'hello')
const transitionText = (selector, text) => {
  $(selector).animate({ opacity: 0 }, 400, function () {
    $(this).text(text)
  }).animate({ opacity: 1 }, 600)
}

// Slowly transition inner html of html element with fade out/in
// ex: transitionHTML('#message', '<b>hello</b>')
const transitionHTML = (selector, html) => {
  $(selector).animate({ opacity: 0 }, 400, function () {
    $(this).html(html)
  }).animate({ opacity: 1 }, 600)
}

// Quickly transition inner html of html element with fade out/in
// ex: transitionFast('#message', '<b>hello</b>')
const transitionFast = (selector, html) => {
  $(selector).animate({ opacity: 0 }, 100, function () {
    $(this).html(html)
  }).animate({ opacity: 1 }, 100)
}

// Transition from Sign In to Sign Up view
const onSignUpInstead = (event) => {
  event.preventDefault()
  transitionText('#message', ' ')
  $('#signUpEmail').val($('#signInEmail').val())
  $('#signUpPass').val($('#signInPass').val())
  $('#signUpInstead, #authButtons, #signIn').hide(400)
  setTimeout(() => {
    $('#authButtons, #signUp').show(600)
    $('#signInInstead').show()
    transitionText('#authHeader', 'Come here often?')
  }, 400)
}

// Transition from Sign Up to Sign In view
const onSignInInstead = (event) => {
  event.preventDefault()
  transitionText('#message', ' ')
  $('#signInEmail').val($('#signUpEmail').val())
  $('#signInPass').val($('#signUpPass').val())
  $('#signInInstead, #authButtons, #signUp').hide(400)
  setTimeout(() => {
    $('#authButtons, #signIn').show(600)
    $('#signUpInstead').show()
    transitionText('#authHeader', 'New here?')
  }, 400)
}

// Transition to Main Menu view
const onMainMenu = () => {
  transitionText('#message', 'Main Menu')
  $('.hideOnSignIn, .showOnNewGame, .showOnAccount').hide(400)
  $('footer, #showSignOut').show()
  setTimeout(() => $('.showOnSignIn').show(600), 400)
}

// Transition to Account view
const onAccount = () => {
  transitionText('#message', 'Your Account')
  transitionHTML('#showTable', '')
  $('#topNav').removeClass('showOnSignIn')
  $('.signOutConfirm').removeClass('hideOnSignIn')
  $('.hideOnSignIn, .showOnNewGame, .showOnSignIn').hide(400)
  $('#topNav').addClass('showOnSignIn')
  $('.signOutConfirm').addClass('hideOnSignIn')
  setTimeout(() => $('.showOnAccount').show(600), 400)
}

// Toggle 'Sign Out' confirmation prompt
const onAreYouSure = () => {
  if ($('#areYouSure').css('display') === 'none') {
    $('footer')
    $('#showSignOut').hide(400)
    setTimeout(() => {
      $('#areYouSure').show(200)
      $('.areYouSure').show(400)
    }, 400)
  }
  if ($('#showSignOut').css('display') === 'none') {
    $('#areYouSure').hide(200)
    $('.areYouSure').hide(400)
    setTimeout(() => $('#showSignOut').show(400), 400)
  }
}

// Transition to Change Password view
const onShowPassword = (event) => {
  event.preventDefault()
  $('#changePassword, .showOnAccount').toggle(800)
  if ($('#message').text() === 'Your Account') {
    transitionText('#message', 'Change Password')
  } else {
    transitionText('#message', 'Your Account')
  }
}

// Pop 'Sign Out' button up and down on mobile screens
const toggleFooter = (event) => {
  if ($(event.target).attr('id') || $(window).height() >= 750) return
  if ($('#showSignOut').css('display') === 'none') onAreYouSure()
  if ($('footer').hasClass('hidePopUp')) {
    $('footer').removeClass('hidePopUp')
    $('#showSignOut').on('click', onAreYouSure)
  } else {
    $('#showSignOut').off()
    $('footer').addClass('hidePopUp')
  }
}

// Display error message and refresh button on generic error
const onFailure = () => {
  transitionFast('#message', 'Something went wrong, <button style="margin-top: 15px" class="menuBtn btn btn-light" onClick="window.location.reload();">Refresh Page</button>')
}

// Toggle light/dark mode
let theme = true
const changeTheme = () => {
  theme = !theme

  // Set/unset Dark mode css styling
  transitionText('#changeTheme', theme ? 'Dark Mode' : 'Light Mode')
  $('#gameMenu').css('background-color', theme ? '' : '#292b2c')
  // $('.gameNav').css('background-color', theme ? '' : '#292b2c')
  $('#topNav').css('background-color', theme ? '' : '#292b2c')
  $('.border').css('background-color', theme ? '' : '#292b2c')
  $('.btn').css('background-color', theme ? '' : '#292b2c')
  $('input').css('background-color', theme ? '' : 'black')
  $('body').css('background-color', theme ? '' : 'black')
  $('.space').css('filter', theme ? '' : 'invert(100%)')
  $('*').css('color', theme ? '' : 'whitesmoke')
}

module.exports = {
  onSignUpInstead,
  onSignInInstead,
  onMainMenu,
  onAccount,
  onAreYouSure,
  onShowPassword,
  transitionText,
  transitionHTML,
  transitionFast,
  toggleFooter,
  onFailure,
  changeTheme
}
