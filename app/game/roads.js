'use strict'

const player = require('../player')
const socket = require('../socket')
const api = require('./api')

const placeRoad = (event) => {
  const side = closestSide(event)
  if ($(`#${side.id}`).is('owner')) return
  const x = side.x
  const y = side.y
  player.roads.push(side.id)
  rotateRoad(side.id, event.target.id)
  $(`#${side.id}`).data('owner', player.email)
  $(`#${event.target.id}`).css({ top: y, left: x }).off()
  socket.updateLog(`${player.email} built a road.`)
  socket.updateRoads($('#roads').html())
  api.updateGame()
}

const rotateRoad = (sideId, roadId) => {
  const side = $(`#${sideId}`)
  const road = $(`#${roadId}`)
  if (side.hasClass('t-l')) road.addClass('t-l')
  if (side.hasClass('t-r')) road.addClass('t-r')
  if (side.hasClass('b-r')) road.addClass('b-r')
  if (side.hasClass('b-l')) road.addClass('b-l')
}

const closestSide = (event) => {
  const rect = $(event.target)[0].getBoundingClientRect()
  const sideLocations = []
  const sides = []
  const selectors = ['.r']

  selectors.forEach(selector => {
    $(selector).each(function () {
      const rect = this.getBoundingClientRect()
      const x = rect.left
      const y = rect.top
      const id = this.id
      sideLocations.push({ id, x, y })
      sides.push(this)
    })
  })

  let closest = sideLocations[0]
  sideLocations.forEach(location => {
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
  placeRoad
}
