const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const Person = require('./models/person')
const configs = require('./utils/config')
const loggers = require('./utils/logger')
const middlewares = require('./utils/middlewares')
const personRouter = require('./controllers/persons')
const app = express()

const port = configs.PORT
const url = configs.MONGO_URL

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// configure morgan logger
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

// connect to mongodb
mongoose.connect(url)
    .then(response => {
        loggers.info('Connected to database')
    })
    .catch(error => {
        loggers.info('Cannot connect to database', url)
    })

// routing
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

// post process middlewares
app.use(middlewares.unknownEndPoint)
app.use(middlewares.errorHandler)

// listen requests
const PORT = port || 3001
app.listen(PORT, () => {
    loggers.info(`Server running on port ${PORT}`)
})
