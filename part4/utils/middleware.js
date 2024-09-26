const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

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

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username/password` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null  // Assign null if no token is provided
  }

  next() // Always call next to proceed to the next middleware or route handler
}

const userExtractor = async (request, response, next) => {
  const token = request.token

  // If there's no token, return unauthorized
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  //try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    // If the token is invalid, return unauthorized
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    // Find the user from the decoded token
    const user = await User.findById(decodedToken.id).populate('blogs')

    // If the user doesn't exist, return unauthorized
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }

    // Attach the user to the request object
    request.user = user
  // } catch (error) {
  //   return response.status(401).json({ error: 'invalid token' })
  // }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}