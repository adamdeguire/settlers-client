'use strict'

const socket = require('../../socket')
const player = require('../../player')

let i = 0

const rollDice = (roll1 = 0, roll2 = 0) => {
  if (i === 10) {
    const rollValue = roll1 + roll2
    i = 0
    socket.updateLog(`${player.email} rolled ${rollValue}.`)
    socket.rollDice(roll1, roll2)
    animateRoll(rollValue)
    return rollValue
  }

  roll1 = roll()
  roll2 = roll()

  setTimeout(() => {
    $('#die1').load(`app/game/dice/die${roll1}.txt`)
    $('#die2').load(`app/game/dice/die${roll2}.txt`)
    i++
    rollDice(roll1, roll2)
  }, 100)

  function roll () {
    return Math.floor(Math.random() * 6) + 1
  }
}

const animateRoll = (rollValue) => {
  $('.land').each(function () {
    const marker = $(this).find(`.marker${rollValue}`)
    marker.css('background-size', '75%')
    setTimeout(() => marker.css('background-size', '50%'), 800)
  })
}

module.exports = {
  rollDice,
  animateRoll
}
