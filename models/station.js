'use strict'

const helpers = require('../helpers')

const actions = {
  CLOSE: 'CLOSE'
}

function init (station, connections, stations) {
  const stationModel = {
    id: station[0],
    name: station[1],
    isClosed: false
  }
  return Object.assign({}, stationModel, {
    adjacentStations: helpers.getAdjacentStations(stationModel, connections, stations)
  })
}

// update function
// take an action and a model, sends back a new model
function update (action, model) {
  switch (action.type) {
    case actions.CLOSE:
      return Object.assign({}, model, {isClosed: true})
  }
}

module.exports = {
  actions: actions,
  init: init,
  update: update
}
