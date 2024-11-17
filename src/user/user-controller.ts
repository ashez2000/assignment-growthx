import { Request, Response } from 'express'

import { extractPagination } from '../util/paginate.js'
import { User } from './user-model.js'

/**
 * Fetch all admins
 * @path GET /admins
 * @access user
 */
export async function getAdmins(req: Request, res: Response) {
  const { page, limit } = extractPagination(req)

  const admins = await User.find({
    role: 'admin',
  })
    .select('-password')
    .skip((page - 1) * limit)
    .limit(limit)

  res.status(200).json(admins)
}
