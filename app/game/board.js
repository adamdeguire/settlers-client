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

const initializePieces = () => {
  $('.settlement').draggable()
  $('body').on('mouseup', '.settlement', placeSettlement)
}

const initialize = () => {
  initializeTiles()
  initializeIntersect()
  initializePieces()
}

const placeSettlement = (event) => {
  const intersect = closestIntersection(event)
  if (!intersect) return
  store.settlementCount++
  console.log(store.settlementCount)
  const x = intersect.x + 10
  const y = intersect.y
  $(`#${event.target.id}`).css({ top: y, left: x }).off()
  $('#settlements').append(`<div id="settlement${store.settlementCount + 1}" class="settlement"></div>`)
  $(`#settlement${store.settlementCount + 1}`).draggable()
  socket.updateLog(`${store.email} built a settlement.`)
  socket.updateSettlements($('#settlements').html())
}

const closestIntersection = (event) => {
  const rect = $(event.target)[0].getBoundingClientRect()
  const intersectLocations = []
  const selectors = ['.intersect']

  selectors.forEach(selector => {
    $(selector).each(function () {
      const rect = this.getBoundingClientRect()
      const x = rect.left
      const y = rect.top
      intersectLocations.push({ x, y })
    })
  })
  let closest = intersectLocations[0]

  intersectLocations.forEach(location => {
    if (getOffset(location) < getOffset(closest)) {
      closest = location
    }
  })

  function getOffset (location) {
    const xOffset = Math.abs(location.x - rect.left)
    const yOffset = Math.abs(location.y - rect.top)
    return xOffset + yOffset
  }
  return closest
}

module.exports = {
  initialize,
  initializeIntersect,
  placeSettlement,
  closestIntersection
}
