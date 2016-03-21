# FIND MY CAT

## Code style
I didn't want to loose time setting up linting and code style, so I used the popular ready-to-go popular [standard](https://github.com/feross/standard). It's used by many famous JS projects. No configuration = no loss of time.

## Architecture
The architecture is quite simple, inspired by the [elm-architecture](https://github.com/evancz/elm-architecture-tutorial).
The app has a single model. The model of the app is composed of two sub-models:
- one called 'catAndOwner'
- one called 'stations'

Each model has an ```init()``` function, an ```update()``` function, and some actions.
The ```init()``` function initializes the model.
The ```actions`` describe the different operations that can be performed to update our model.
This makes our code very clear about how our model can be transformed. And we can add new features really easily.
The ```update()``` function is the function that will actually perform these actions and give back a the updated model.

The app itself follows this architecture as well.

## Models

### stations
- map of stations
- a station respect the following format (easy to find in the init method)
```
{
  id: string,
  name: string,
  isClosed: boolean,
  adjacentStations: [ string ]
}
```
#### NOTE:
I store the adjacent stations of each station in the model during the initialisation phase in order to speed up the application later on. 
I decided to store the stations in a map, indexed by their ids, so that it's really easy and cheap to retrieve a given station later on (instead of iterating through an array of 300 stations to find one).

### catsAndOwners
- array of catAndOwner
- the model catAndOwner represents the relationship between an owner and his cat, it has the following format (easy to find in the init method)
```
{
  owner: {
    previousStation: station,
    station: station
  },
  cat: {
    station: station
  },
  isCatFound: boolean,
  count: integer
}
  ```

## Launch the app

First you need to install the dependencies:

```npm install```

Then you can run the app, you'll need to provide the number of cats/owners you want to create using the CLI

```node index.js 20```

OR

```npm start 20```

## Tests

I only wrote a few tests, I need to write more. Since I have used as many pure functions as possible, writing those tests should be quite easy.

To run the tests:

```npm run test```

## FUTURE AND IDEAS

### User interactions
In this app there's currently no interaction with the user, the actions are run by a script until it finishes.
Using this architecture, it would be really easy to add some, just by adding a way to dispatch ```actions```,
and redirect those actions to the appropriate ```update()``` function.
We could used[RxJS](https://github.com/Reactive-Extensions/RxJS) to do so, we would get something even closer to the elm architecture.

### Immutable data structure
To write this program I used native javascript data structures, but I have been really careful to avoid any kind of mutations. I could have used [immutable-js](https://facebook.github.io/immutable-js/) or [mori](https://github.com/swannodette/mori) to use proper immutable data structure.
These libraries work quite well with react.

### Memoization
Since I am using many pure functions, I could cache the results of my functions calls,
so that if they are called again with the exact same parameters we could return the cached result.
