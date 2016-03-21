'use strict'

const helpers = require('../helpers')

const actions = {
  TRAVEL_CAT: 'TRAVEL_CAT',
  TRAVEL_OWNER: 'TRAVEL_OWNER'
}

function init (stations, total) {
  const keys = Object.keys(stations)
  const randomKeys = helpers.getTwoDifferentRandomNumbers(0, keys.length - 1)
    .map(key => keys[key])

  return {
    owner: {
      previousStation: null,
      station: stations[randomKeys[0]]
    },
    cat: {
      station: stations[randomKeys[1]]
    },
    isCatFound: false,
    count: 0
  }
}

// make the owner travel and returns his new station
function travelOwner (previousStation, currentStation, stations) {
  const nextPossibleStations = currentStation.adjacentStations
    .map(stationId => stations[stationId])
    .filter(station => {
      const isPreviousStation = (previousStation && station.id === previousStation.id)

      return (!isPreviousStation && !station.isClosed)
    })

  return nextPossibleStations.length > 0
    ? nextPossibleStations[helpers.getRandomNumber(0, nextPossibleStations.length - 1)]
    : currentStation
}

// make the cat travel and returns his new station
function travelCat (currentStation, stations) {
  const nextPossibleStations = currentStation.adjacentStations
    .map(stationId => stations[stationId])
    .filter(station => !station.isClosed)

  return nextPossibleStations.length > 0
    ? nextPossibleStations[helpers.getRandomNumber(0, nextPossibleStations.length - 1)]
    : currentStation
}

// update function
// take an action and a model, sends back a new model
function update (action, model) {
  switch (action.type) {
    case actions.TRAVEL_CAT:
      const newCatStation = travelCat(
        model.cat.station,
        action.params.stations
      )

      return Object.assign({}, model, {
        cat: {
          station: newCatStation
        },
        isCatFound: newCatStation === model.owner.station,
        count: model.count + 1
      })

    case actions.TRAVEL_OWNER:
      const newOwnerStation = travelOwner(
        model.owner.previousStation,
        model.owner.station,
        action.params.stations
      )
      return Object.assign({}, model, {
        owner: {
          previousStation: model.owner.station,
          station: newOwnerStation
        },
        isCatFound: newOwnerStation === newCatStation,
        count: model.count + 1
      })

  }
}

module.exports = {
  actions: actions,
  init: init,
  update: update
}
