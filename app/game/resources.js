'use strict'

const player = require('../player')

const getResources = (rollValue) => {
  function getObjectCopy (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  const resourcesBefore = getObjectCopy(player.resources)
  player.settlements.forEach(settlement => {
    let resourceCount = 0
    const neighborTiles = $(`#${settlement}`).data('tiles')
    for (const tileNum of neighborTiles) {
      const tile = $(`#land${tileNum}`)
      if (tile.hasClass('desert')) continue
      if (tile.find(`.marker${rollValue}`).length) resourceCount++
      player.resources[tile.attr('resource')] += resourceCount
      $('#sheep').text(player.resources.sheep)
      $('#wheat').text(player.resources.wheat)
      $('#wood').text(player.resources.wood)
      $('#brick').text(player.resources.brick)
      $('#ore').text(player.resources.ore)
      resourceCount = 0
    }
  })

  let message = []
  for (const resource in player.resources) {
    if (player.resources[resource] !== resourcesBefore[resource]) {
      const quantity = player.resources[resource] - resourcesBefore[resource]
      message.push(`${quantity} ${resource}`)
    }
  }

  switch (message.length) {
    case 0:
      return null
    case 1:
      message = message.toString()
      break
    case 2:
      message = message.join(' and ')
      break
    default:
      message[message.length - 1] = `and ${message[message.length - 1]}`
      message = message.join(', ')
      break
  }

  return `You received ${message}.`
}

module.exports = {
  getResources
}
