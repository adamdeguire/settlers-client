'use strict'

const socket = require('../socket')
const player = require('../player')
const api = require('./api')

const placeSettlement = (event) => {
  const intersect = closestIntersection(event)
  if ($(`#${intersect.id}`).is('owner')) return
  const x = intersect.x + 10
  const y = intersect.y
  player.settlements.push(intersect.id)

  $(`#${intersect.id}`).data('owner', player.email)
  $(`#${event.target.id}`).css({ top: y, left: x }).off()

  socket.updateLog(`${player.email} built a settlement.`)
  socket.updateSettlements($('#settlements').html())
  api.updateGame()
}

const closestIntersection = (event) => {
  const rect = $(event.target)[0].getBoundingClientRect()
  const intersectLocations = []
  const intersects = []
  const selectors = ['.i']

  selectors.forEach(selector => {
    $(selector).each(function () {
      const rect = this.getBoundingClientRect()
      const x = rect.left
      const y = rect.top
      const id = this.id
      intersectLocations.push({ id, x, y })
      intersects.push(this)
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
  placeSettlement,
  closestIntersection
}
