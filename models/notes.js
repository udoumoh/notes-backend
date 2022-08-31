const mongoose = require('mongoose');

const url = process.env.MONGODB_URL

console.log(`connecting to ${url}`);

mongoose.connect(url)
.then(response => console.log('Connected to mongodb'))
.catch(err => console.log('Error connecting to mongodb', err.message))

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)