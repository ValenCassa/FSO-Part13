const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'SequelizeValidationError' && error.message !== 'Validation error: Validation isEmail on username failed' && error.message !== 'Validation error: Validation min on year failed') {
      return response.status(400).send({ error: 'Not null values' })
    } else if (error.name === 'TypeError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: 'invalid token'
      })
    } else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'token expired'
      }) 
    } else if (error.name === 'SequelizeValidationError' && error.message === 'Validation error: Validation isEmail on username failed') {
      return response.status(401).json({
        error: 'Username should be an email'
      }) 
    } else if (error.name === 'SequelizeValidationError' && error.message === 'Validation error: Validation min on year failed') {
      return response.status(401).json({
        error: 'Year must be greater than 1991 and lower than current year'
      }) 
    }
  
    next(error)
  }

  const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
      } catch{
        res.status(401).json({ error: 'Invalid Token' })
      }
    }  else {
      res.status(401).json({ error: 'Token missing or invalid' })
    }
    next()
  }

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
}