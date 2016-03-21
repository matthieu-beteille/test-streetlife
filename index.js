'use strict'

const stations = require('./tfl_stations.json')
const connections = require('./tfl_connections.json')
const app = require('./app.js')
const iterationsNumber = 20000

if (process.argv.length < 3) {
  console.error('You need to provide the number of owners/cats as an argument')
} else {
  const total = process.argv[2]

  if (total > 0) {
    app.run(connections, stations, process.argv[2], iterationsNumber)
  } else {
    console.error('Please provide a strictly positive integer')
  }
}
