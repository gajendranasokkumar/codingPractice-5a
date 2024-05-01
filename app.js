const express = require('express')
const app = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'moviesData.db')
let db = null

app.use(express.json())

const inititalizeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('server is Running !!')
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

inititalizeDBandServer()

app.get('/movies/', async (request, response) => {
  let q1 = 'SELECT * FROM movie'
  let allTeamList = await db.all(q1)
  response.send(allTeamList)
})

app.post('/movies/', async (request, response) => {
  let newMovie = request.body
  const {director_id, movie_name, lead_actor} = newMovie
  let q2 = `INSERT INTO movie (director_id,movie_name,lead_actor) 
    VALUES(${director_id},'${movie_name}','${lead_actor}');`

  let dbResponse = await db.run(q2)
  let insertedId = dbResponse.lastID

  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  let q3 = `SELECT * FROM movie WHERE movie_id = ${movieId}`
  const oneMovie = await db.get(q3)
  response.send(oneMovie)
})

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  let newMovie = request.body
  const {director_id, movie_name, lead_actor} = newMovie
  let q4 = `UPDATE movie SET 
  director_id = ${director_id},
  movie_name = '${movie_name}',
  lead_actor = '${lead_actor}'
  WHERE movie_id = ${movieId};`
  await db.run(q4)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  let q5 = `DELETE FROM movie WHERE movie_id = ${movieId};`
  await db.run(q5)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  let q6 = 'SELECT * FROM director'
  let allDirector = await db.all(q6)
  response.send(allDirector)
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  let q7 = `SELECT movie_name FROM movie WHERE director_id = ${directorId}`
  const allMovie = await db.get(q7)
  response.send(allMovie)
})

module.exports = app
