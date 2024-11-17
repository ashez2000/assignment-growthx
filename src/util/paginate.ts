import { Request } from 'express'

/** Extract pagination details from request object */
export function extractPagination(req: Request) {
  const page = parseInt((req.query.page as string) || '1')
  const limit = parseInt((req.query.limit as string) || '10')
  return { page, limit }
}
