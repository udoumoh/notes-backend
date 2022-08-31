const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Note = require('./models/notes')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(cors())
app.use(express.static('build'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
]
 
const generateId = function(){
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    Note.findById(id).then(note => response.json(note))
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    
    response.status(204).end();
})

app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.content) response.status(400).json({error: 'no content'})

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => response.json(savedNote))
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({error:'unknown Endpoint'});
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
})
