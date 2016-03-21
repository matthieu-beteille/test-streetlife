'use strict'

const _ = require('underscore')
const helpers = require('./helpers')
const CatAndOwner = require('./models/catAndOwner.js')
const Station = require('./models/station.js')

// app actions (only one for now)
const actions = {
  MOVE: 'MOVE'
}

// app init function
function initApp (connections, stations, total) {
  // we create a map to store the stations, to be able to find a given
  // station really easily by doing stations[id]
  // we keep the exact same idea as the one in the json to be safe
  const initialStations = stations.reduce((stationsMap, station) => {
    let stationModel = Station.init(station, connections, stations)
    stationsMap[stationModel.id] = stationModel
    return stationsMap
  }, {})

  return {
    stations: initialStations,
    catsAndOwners: _.range(total).map(() => CatAndOwner.init(initialStations, total))
  }
}

// our app update function
function update (action, model) {
  switch (action.type) {
    case actions.MOVE:
      const catAndOwner = model.catsAndOwners[action.params.index]
      let newStations = model.stations
      let newCatAndOwner

      if (catAndOwner.isCatFound) {
        return model
      } else {
        newCatAndOwner = CatAndOwner.update(
          {
            type: CatAndOwner.actions.TRAVEL_OWNER,
            params: { stations: action.params.stations }
          },
          catAndOwner
        )
        newCatAndOwner = !newCatAndOwner.isCatFound
          ? CatAndOwner.update(
            {
              type: CatAndOwner.actions.TRAVEL_CAT,
              params: { stations: action.params.stations }
            },
            newCatAndOwner
          )
          : newCatAndOwner

        if (newCatAndOwner.cat.station.id === newCatAndOwner.owner.station.id) {
          const newStation = Station.update({ type: Station.actions.CLOSE }, newCatAndOwner.owner.station)
          console.log(`Owner ${action.params.index} found cat ${action.params.index} - ${newCatAndOwner.cat.station.name} is now closed.`)
          newStations = _.mapObject(model.stations, station => station.id === newStation.id ? newStation : station)
        }
      }

      return Object.assign({}, model, {
        stations: newStations,
        catsAndOwners: helpers.updateIn(model.catsAndOwners, action.params.index, newCatAndOwner)
      })

  }
}

// function to launch the app
function run (connections, stations, total, iterationsNumber) {
  var appModel = initApp(connections, stations, total)
  var iterations = 0
  var isFinished = false

  while (!isFinished) {
    _.range(total).forEach((value, idx) => {
      appModel = update({
        type: actions.MOVE,
        params: {
          index: idx,
          stations: appModel.stations
        } }, appModel)
    })

    iterations = iterations + 1
    process.stdout.write('Number of moves ' + iterations + '\r')

    isFinished = appModel.catsAndOwners.every(model => {
      return model.isCatFound
    }) || iterations >= iterationsNumber

    if (isFinished) {
      const foundModels = appModel.catsAndOwners
        .filter(model => model.isCatFound)
      const averageCounts = foundModels
        .reduce((sum, currentModel) => sum + currentModel.count, 0) / foundModels.length
      console.log(`Total number of cats ${appModel.catsAndOwners.length}`)
      console.log(`Average number of movements required to find a cat: ${averageCounts ? Math.floor(averageCounts) : 0}`)
      console.log(`Number of cats found: ${foundModels.length}`)
    }
  }
}

module.exports = {
  run: run,
  initApp: initApp
}
