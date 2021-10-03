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

app.get("/", (request, response) => {
    response.send('<h1>Hello, welcome to phonebook</h1>')
})

app.get("/api/persons", (request, response, next) => {
    // response.json(persons)
    Person.find({})
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                console.log("No person found in the database");
            }
        })
        .catch(error => {
            next(error)
        })
})

app.get("/info", (request, response) => {
    Person.find({})
        .then(results => {
            response.send(`
                <p>Phonebook has info for ${results.length} people</p>
                <p>${new Date()}</p>
            `)
        })
})

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            // console.log(error);
            next(error)
        })
})

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post("/api/persons/", (request, response, next) => {
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

    person.save()
        .then(result => {
            console.log(`Saved ${result.name} number ${result.number} to phonebook`)
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    const body = request.body

    console.log(id);

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    if (error.name === "TypeError") {
        response.statusMessage = "person requested cannot be found!"
        return response.status(404).end()
    }
    else if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }
    next(error)
}

app.use(errorHandler)

const PORT = port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
