const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// define person schema with validations
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
        validate: {
            validator: val => val.toString().length >= 8,
            message: val => 'Number must be 8 digits or longer'
        }
    }
})

personSchema.plugin(uniqueValidator) // this guy makes sure to check unique data entries!

// this function below formats the data object whenever .json function is called
// upon the data object
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // remove _id and _v properties
        // add id property for easier access
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)