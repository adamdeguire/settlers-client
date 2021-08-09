'use strict'

const shuffle = require('knuth-shuffle').knuthShuffle

const initializeTiles = () => {
  let tiles = []
  let markers = []

  for (let i = 0; i < 4; i++) tiles.push('sheep', 'wood', 'wheat')
  for (let i = 0; i < 3; i++) tiles.push('brick', 'ore')
  tiles.push('desert')

  for (let i = 0; i < 2; i++) markers.push(3, 4, 5, 6, 8, 9, 10, 11)
  markers.push(2, 12)

  tiles = shuffle(tiles)
  markers = shuffle(markers)

  $('.land').each(function (i) {
    $(this).attr('class', 'land')
    $(this).addClass(tiles[i])
    $(this).attr('resource', tiles[i])
    $(this).children('.marker').attr('class', 'marker')
    if ($(this).hasClass('desert')) markers.splice(i, 0, 7)
    $(this).children('.marker').addClass(`marker${markers[i]}`)
  })
}

const initializePieces = () => {
  $('.settlement').draggable()
}

const initialize = () => {
  initializeTiles()
  initializePieces()
}

module.exports = {
  initialize
}
