import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AppError } from '../error.js'
import { User } from '../user/user-model.js'

const jwtSecret = process.env.JWT_SECRET || 'secret'

/**
 * Register new user/admin
 * @path POST /register
 */
export async function register(req: Request, res: Response) {
  // TODO: Validation
  const { name, email, password, role } = req.body
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash })
  const token = jwt.sign({ id: user.id }, jwtSecret)

  res.status(201).cookie('token', token).json({ id: user.id, name, email })
}

/**
 * Login user/admin
 * @path POST /login
 */

export async function login(req: Request, res: Response) {
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
}

/**
 * Logout user/admin
 * @path POST /logout
 */
export async function logout(req: Request, res: Response) {
  res.status(201).clearCookie('token').json({})
}
