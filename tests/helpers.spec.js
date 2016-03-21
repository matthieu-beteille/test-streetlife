const assert = require('assert')
const _ = require('underscore')
const helpers = require('../src/helpers')
const App = require('../src/app')
const stations = require('../map/tfl_stations.json')
const connections = require('../map/tfl_connections.json')

describe('helpers', function () {
  describe('getRandomNumber()', function () {
    it('should always return a random number between 0 and 10', function () {
      const randomNumbers = _.range(100000).map(() => helpers.getRandomNumber(0, 10))
      const isValid = randomNumbers.every(n => n >= 0 && n <= 10)
      assert(isValid)
    })
  })

  describe('getTwoDifferentRandomNumbers()', function () {
    it('should always return two different random numbers between 0 and 10', function () {
      const randomNumbers = _.range(100000).map(() => helpers.getTwoDifferentRandomNumbers(0, 10))
      const isValid = randomNumbers.every(numbers => {
        return (numbers[0] >= 0 && numbers[0] <= 10) &&
          (numbers[1] >= 0 && numbers[1] <= 10) &&
          numbers[0] !== numbers[1]
      })
      assert(isValid)
    })
  })

  describe('updateIn()', function () {
    it('should return a new array', function () {
      var array = [0, 1, 2, 3, 4, 5]
      var array2 = helpers.updateIn(array, 1, 2)
      assert(array !== array2)
    })

    it('should create a new array and set a new value at index N', function () {
      var array = [0, 1, 2, 3, 4, 5]
      var array2 = helpers.updateIn(array, 1, 100)

      assert(array2[0] === 0)
      assert(array2[1] === 100)
      assert(array2[2] === 2)
      assert(array2[3] === 3)
      assert(array2[4] === 4)
      assert(array2[5] === 5)
      assert(array2[6] === undefined)
    })

    it('should not mutate the array source', function () {
      var array = [0, 1, 2, 3, 4, 5]
      var array2 = helpers.updateIn(array, 1, 100)

      assert(array[0] === 0)
      assert(array[1] === 1)
      assert(array[2] === 2)
      assert(array[3] === 3)
      assert(array[4] === 4)
      assert(array[5] === 5)
      assert(array[6] === undefined)
    })
  })

  describe('getAdjacentStations()', function () {
    it('should find the adjacent stations of Balham', function () {
      var expectedResult = ['56', '257']
      var currentStation = { id: '12', name: 'Balham', isClosed: false }
      var appModel = App.initApp(connections, stations, 10)
      var adjacentsIds = helpers.getAdjacentStations(currentStation, connections, appModel.stations)
      var isValid = adjacentsIds.every(id => expectedResult.indexOf(id) > -1) &&
       expectedResult.every(id => expectedResult.indexOf(id) > -1)
      assert(isValid)
    })
  })
})
