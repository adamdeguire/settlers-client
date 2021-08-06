
const closestIntersection = (event) => {
  const rect = $(event.target)[0].getBoundingClientRect()
  const intersectLocations = []
  const selectors = ['.intersect', '.settlement']

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
    const yOffset = Math.abs(location.x - rect.top)
    return xOffset + yOffset
  }
  return closest
}

module.exports = {
  closestIntersection
}
