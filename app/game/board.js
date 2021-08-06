'use strict'

const store = require('../store')
const socket = require('../socket')
const shuffle = require('knuth-shuffle').knuthShuffle

const xIndex = (index) => {
  if (!index) return null
  return `calc((${index} * (var(--s) + (2 * var(--m)))))`
}

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
    $(this).removeClass().addClass('land')
    $(this).addClass(tiles[i])
    $(this).children('div').removeClass()
    if ($(this).hasClass('desert')) markers.splice(i, 0, 7)
    $(this).children('div').addClass(`marker${markers[i]}`)
  })
}

const initializeIntersect = () => {
  $('body').children('.settlement').remove()
  let count = 0
  for (let i = 1; i <= 6; i++) {
    $(`#row${i}`).children().each(function () {
      const rowId = $(`#row${i}`).attr('id')
      const index =
      [xIndex($(this).children().data('x') + 1),
        xIndex($(this).children().data('x') + 2)]

      for (let j = 0; j < 2; j++) {
        if (index[j]) {
          count++
          $(`#${rowId}`).prepend(`<div class="intersect" id=${rowId}intersect${count}></div>`)
          $(`#${rowId}intersect${count}`).css('left', index[j])
          count++
          $(`#${rowId}`).prepend(`<div class="intersect" id=${rowId}intersect${count}></div>`)
          $(`#${rowId}intersect${count}`).css('left', index[j])
          $(`#${rowId}intersect${count}`).css('top', 'calc((var(--s) / 2) * 1.16)')
        }
      }
    })
  }
}

const initialize = () => {
  initializeTiles()
  initializeIntersect()
}

const placeSettlement = (e) => {
  if ($(e.target).hasClass('clicked')) {
    $(e.target).remove()
  } else {
    if (e.originalEvent) socket.update(`${store.email} built a settlement.`)
    $(e.target).addClass('clicked')
    const div = $('<div class="settlement"></div>')
    const rect = $(e.target)[0].getBoundingClientRect()
    $('body').append(div.offset({ top: rect.top + 10, left: rect.left + 10 }))
    socket.sendBoard(e.target.id)
  }
}

module.exports = {
  initialize,
  placeSettlement
}
