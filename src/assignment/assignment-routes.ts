import { Router } from 'express'

import {
  acceptAssignment,
  rejectAssignment,
  viewAssignments,
} from './assignment-controller.js'

import { authenticate, restrict } from '../auth/auth-middleware.js'

const router = Router()

router.get('/', authenticate, restrict('admin'), viewAssignments)
router.post('/:id/accept', authenticate, restrict('admin'), acceptAssignment)
router.post('/:id/reject', authenticate, restrict('admin'), rejectAssignment)

export default router
