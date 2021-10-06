const personRouter = require('express').Router()
const Person = require('../models/person')
const loggers = require('../utils/logger')

personRouter.get('/', (request, response, next) => {
    // response.json(persons)
    Person.find({})
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                loggers.info('No person found in the database')
            }
        })
        .catch(error => {
            next(error)
        })
})

personRouter.get('/:id', (request, response, next) => {
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

personRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

personRouter.post('/', (request, response, next) => {
    const body = request.body

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
            loggers.info(`Saved ${result.name} number ${result.number} to phonebook`)
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

personRouter.put('/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

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

module.exports = personRouter