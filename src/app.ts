import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import 'express-async-errors'

import { AppError } from './error.js'
import routes from './routes.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello, world!',
  })
})

// Main API routes
app.use(routes)

// Not Found route handler
app.use((req, res) => {
  res.status(400).json({ message: 'Not Found' })
})

// Global error handler
// @ts-ignore
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  console.log(err)
  res.status(500).json({ message: 'Internal Server Error' })
})

export default app
