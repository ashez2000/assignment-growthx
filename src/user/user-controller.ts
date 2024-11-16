import { Request, Response } from 'express'
import { User } from './user-model.js'

/**
 * Fetch all admins
 * @path GET /admins
 * @access user
 */
export async function getAdmins(req: Request, res: Response) {
  const admins = await User.find({
    role: 'admin',
  }).select('-password')

  res.status(200).json(admins)
}
