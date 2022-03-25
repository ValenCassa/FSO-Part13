const express = require('express')
const app = express()

// Middleware
const middleware = require('./middleware/middleware')
require('express-async-errors')
const logger = require('./utils/logger')
app.use(express.json())

// Routers
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingRouter = require('./controllers/readingList')

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readingList', readingRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app