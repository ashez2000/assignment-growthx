import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AppError } from '../error.js'
import { User } from '../user/user-model.js'
import { authenticate } from './auth-middleware.js'

const router = Router()
const jwtSecret = process.env.JWT_SECRET || 'secret'

/**
 * Register new User
 * @path POST /auth/register
 */
router.post('/register', async (req, res) => {
  // TODO: Validation
  const { name, email, password } = req.body
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash })
  const token = jwt.sign({ id: user.id }, jwtSecret)

  res.status(201).cookie('token', token).json({ id: user.id, name, email })
})

/**
 * Login User
 * @path POST /auth/login
 */
router.post('/login', async (req, res) => {
  // TODO: Validation
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError('Invalid Credentials', 401)
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new AppError('Invalid Credentials', 401)
  }

  const token = jwt.sign({ id: user.id }, jwtSecret)

  res
    .status(201)
    .cookie('token', token)
    .json({ id: user.id, name: user.name, email: user.email })
})

/**
 * Logout User
 * @path POST /auth/logout
 */
router.post('/login', async (req, res) => {
  res.status(201).clearCookie('token').json({})
})

/**
 * Get User profile
 * @path GET /auth/profile
 */
router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(res.locals.user.id)
  if (!user) {
    throw new AppError('User Not Found', 404)
  }

  res.status(201).json({ id: user.id, name: user.name, email: user.email })
})

export default router
