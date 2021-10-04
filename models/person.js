const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGO_URL

mongoose.connect(url)
    .then(response => {
        console.log('Connected to database');
    })
    .catch(error => {
        console.log('Cannot connect to database', url);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    number: {
        type: Number,
        required: true,
        // min : 10000000
        validate:{
            validator: val => val.toString().length >= 8,
            message: val => "Number must be 8 digits or longer"
        }
    }
})
personSchema.plugin(uniqueValidator)
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)