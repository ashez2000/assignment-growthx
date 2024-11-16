import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../error.js'

const jwtSecret = process.env.JWT_SECRET || 'secret'

/** Authenticate current user */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token
  if (!token) {
    throw new AppError('Unauthoized', 401)
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    res.locals.user = payload
    next()
  } catch (err) {
    console.log(err)
    throw new AppError('Unauthoized', 401)
  }
}

/** Restrict the access to specified roles */
export function restrict(...roles: ('user' | 'admin')[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!roles.includes(res.locals.user.role)) {
      throw new AppError(`Only ${roles.toString()} are allowed`, 403)
    }

    next()
  }
}
