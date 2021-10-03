const mongoose = require('mongoose')

const url = process.env.URL 

mongoose.connect(url)
    .then(response => {
        console.log('Connected to database');
    })
    .catch(error => {
        console.log('Cannot connect to database', url);
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)