import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { ZodError } from 'zod'
import { fromError } from 'zod-validation-error'
import 'express-async-errors'

import { AppError } from './error.js'
import routes from './routes.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Health Check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// Main API routes
app.use(routes)

// Not Found route handler
app.use((req, res) => {
  res.status(400).json({ message: 'Route Not Found' })
})

// Global error handler
// @ts-ignore
app.use((err, req, res, next) => {
  // Handle App errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // Handle validations errors
  if (err instanceof ZodError) {
    err = fromError(err)
    return res.status(400).json({ message: err.toString() })
  }

  // Internal Server Errors
  // TODO: use logging lib
  console.log(err)
  res.status(500).json({ message: 'Internal Server Error' })
})

export default app
