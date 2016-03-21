'use strict'

const _ = require('underscore')

// simple function returning a random number between a and b (impure)
function getRandomNumber (a, b) {
  return Math.floor((Math.random() * (b - a + 1)) + a)
}

// simple function returning two different random numbers both between a and b (impure)
function getTwoDifferentRandomNumbers (a, b) {
  const numbers = [
    getRandomNumber(a, b),
    getRandomNumber(a, b)
  ]

  if (numbers[0] === numbers[1]) {
    return getTwoDifferentRandomNumbers(a, b)
  } else {
    return numbers
  }
}

// updates the value of array at index to newValue, and returns a new array (no mutation)
function updateIn (array, index, newValue) {
  if (index < 0 || index > array.length - 1) {
    throw new Error('array[index] doesn\'t exist')
  }

  return Array.prototype.concat(
    array.slice(0, index < 0 ? 0 : index),
    [ newValue ],
    array.slice(index + 1, array.length)
  )
}

// returns an array containing the ids of every adjacent stations for a given station
function getAdjacentStations (currentStation, connections, stations) {
  const adjacentIds = _.flatten(
    connections.filter(connection => connection.some(stationId => stationId === currentStation.id))
  )

  return adjacentIds.filter(stationId => stationId !== currentStation.id)
}

module.exports = {
  getRandomNumber: getRandomNumber,
  getTwoDifferentRandomNumbers: getTwoDifferentRandomNumbers,
  getAdjacentStations: getAdjacentStations,
  updateIn: updateIn
}
