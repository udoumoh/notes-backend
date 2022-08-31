const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jurnixx:${password}@cluster0.0dfbhks.mongodb.net/noteApp?retryWrites=true&w=majority`;

const noteScehma = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteScehma)

mongoose
    .connect(url)
    // .then((result) => {
    //     console.log('connected to MongoDB');

    //     const note = new Note({
    //         content: 'HTML is Easy',
    //         date: new Date(),
    //         important: true,
    //     })

    //     return note.save()
    // })
    Note.find({}).then(result => {
        result.forEach((note) => {
        console.log(note);
        })
        mongoose.connection.close();
    })
    // .then(() => {
    //     console.log('note saved!');
    //     return mongoose.connection.close()
    // })
    .catch((error) => console.log(error))