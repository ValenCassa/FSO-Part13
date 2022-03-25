const app = require('./app')
const http = require('http')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const logger = require ('./utils/logger')

const server = http.createServer(app)

const start = async () => {
    await connectToDatabase()
    server.listen(PORT, () => {
        logger.info(`Server running in port: ${PORT}`)
    })
}

start()

