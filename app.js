const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const Person = require('./models/person') // Person model
const configs = require('./utils/config') // Config functions
const loggers = require('./utils/logger') // Loggers
const middlewares = require('./utils/middlewares') // Middleware functions
const personRouter = require('./controllers/persons') // Person route handlers

const app = express()

const url = configs.MONGO_URL

app.use(express.static('build'))
app.use(cors()) // only needed for frontend development server
app.use(express.json())

morgan.token('body', (req) => {
    if (req.method == 'POST') {
        if (req.body) {
            return JSON.stringify(req.body)
        } else {
            return 'Body is empty!'
        }
    }
})
app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))

mongoose.connect(url)
    .then(response => {
        loggers.info('Connected to database')
    })
    .catch(error => {
        loggers.info('Cannot connect to database', url)
    })

app.get('/', (request, response) => {
    response.send('<h1>Hello, welcome to phonebook</h1>')
})

app.get('/info', (request, response) => {
    Person.find({})
        .then(results => {
            response.send(`
                    <p>Phonebook has info for ${results.length} people</p>
                    <p>${new Date()}</p>
                `)
        })
})
app.use('/api/persons', personRouter)

// post-routing middlewares
app.use(middlewares.unknownEndPoint)
app.use(middlewares.errorHandler)

module.exports = app