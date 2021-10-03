const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const port = process.env.PORT

morgan.token('body', (req) => {
    if (req.method == "POST") {
        if (req.body) {
            return JSON.stringify(req.body)
        } else {
            return "Body is empty!"
        }
    }
})

app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const id = Math.floor(Math.random() * 100 + 1)
    return id
}

app.get("/", (request, response) => {
    response.send('<h1>Hello, welcome to phonebook</h1>')
})

app.get("/api/persons", (request, response) => {
    // response.json(persons)
    Person.find({}).then(result => {
        if (result) {
            response.json(result)
        } else {
            console.log("No person found in the database");
        }
    })
})

app.get("/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    Person.findById(id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            response.statusMessage = "person requested cannot be found!"
            response.status(404).end()
        })
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons/", (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Your data is not complete. Send again with complete data!'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(result => {
        console.log(`Saved ${result.name} number ${result.number} to phonebook`)
        response.json(result)
    })
})

const PORT = port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
