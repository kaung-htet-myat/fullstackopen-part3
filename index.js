const http = require('http')
const configs = require('./utils/config') // Config functions
const loggers = require('./utils/logger') // Loggers
const app = require('./app')

// initialize config variables
const port = configs.PORT

// initialize server
const server = http.createServer(app)

// listen requests
const PORT = port || 3001
server.listen(PORT, () => {
    loggers.info(`Server running on port ${PORT}`)
})
