const mongoose = require('mongoose')

if (process.argv.length < 3) {
    // exit if the password is not provided
    console.log("Please provide the password")
    process.exit(1)
}

const password = process.argv[2] // database password

// connect to the database
const url = `mongodb+srv://kaung-htet-myat:${password}@phonebook.a6zxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url)

// create schema for Person and create Person model
const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})
const Person = mongoose.model('Person', personSchema)

// check type of operation based on argument count
if (process.argv.length === 3) {
    // retrieve all persons from phonebook
    Person.find({}).then(result => {
        if (result) {
            console.log("Phonebook:");
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
        } else {
            console.log("No person found in the phonebook");
        }
        mongoose.connection.close()
    })

} else if (process.argv.length === 5) {
    // add a person provided in argument to the database
    const name = process.argv[3]
    const number = process.argv[4]

    // create a new person object/document
    const person = new Person({
        name: name,
        number: number
    })

    // save the person
    person.save().then(result => {
        console.log(`Saved ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

