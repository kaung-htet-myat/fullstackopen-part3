const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'TypeError') {
        response.statusMessage = 'person requested cannot be found!'
        return response.status(404).end()
    } else if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

module.exports = {
    unknownEndPoint,
    errorHandler
}