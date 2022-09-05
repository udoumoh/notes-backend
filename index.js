const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const Note = require('./models/notes')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown Endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(cors())

app.post('/api/notes', (request, response, next) => {
  const body = request.body
  if (!body.content) response.status(400).json({ error: 'no content' })

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => response.json(savedNote))
    .catch(err => next(err))
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Note.findById(id).then(note => response.json(note))
    .then(note => {
      if(note){
        response.json(note)
      }else{
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndRemove(id)
    .then(() => response.status(204).end())
    .catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  const id = request.params.id

  Note.findByIdAndUpdate(id, { content, important },{ new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(err => next(err))
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`)
})
