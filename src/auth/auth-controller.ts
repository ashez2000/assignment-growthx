import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AppError } from '../error.js'
import { User } from '../user/user-model.js'
import { loginSchema, registerSChema } from './auth-schema.js'

const jwtSecret = process.env.JWT_SECRET || 'secret'

/**
 * Register new user/admin
 * @path POST /register
 */
export async function register(req: Request, res: Response) {
  const { name, email, password, role } = registerSChema.parse(req.body)

  // Check if email already exisit
  const user = await User.findOne({ email })
  if (user) {
    throw new AppError('Email already exisit', 400)
  }

  // Create new User and sign JWT token
  const hash = await bcrypt.hash(password, 10)
  const newUser = await User.create({ name, email, password: hash, role })
  const token = jwt.sign({ id: newUser.id, role }, jwtSecret)

  // Set cookie and send basic user info as response
  res
    .status(201)
    .cookie('token', token)
    .json({ id: newUser.id, name, email, role })
}

/**
 * Login user/admin
 * @path POST /login
 */
export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)

  // Find user by email
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError('Invalid Credentials', 401)
  }

  // Match passwords
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new AppError('Invalid Credentials', 401)
  }

  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret)

  // Set cookie and send basic user info as response
  res
    .status(200)
    .cookie('token', token)
    .json({ id: user.id, name: user.name, email: user.email })
}

/**
 * Logout user/admin
 * @path POST /logout
 */
export async function logout(req: Request, res: Response) {
  res.status(200).clearCookie('token').json({})
}
