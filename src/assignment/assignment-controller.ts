import { Request, Response } from 'express'

import { AppError } from '../error.js'
import { Assignment } from './assignment-model.js'

/**
 * Upload an assignment
 * @path POST /upload
 * @access user
 */
export async function uploadAssignment(req: Request, res: Response) {
  const userId = res.locals.user.id

  // TODO: validate
  const { task, admin } = req.body
  const assignment = await Assignment.create({ task, admin, user: userId })

  res.status(200).json(assignment)
}

/**
 * View assignments tagged to the admin
 * @path GET /assignments
 * @access admin
 */
export async function viewAssignments(req: Request, res: Response) {
  const adminId = res.locals.user.id
  const assignments = await Assignment.find({
    admin: adminId,
  })
  res.status(200).json(assignments)
}

/**
 * Accept an assignment
 * @path POST /assignments/:id/accept
 * @access admin
 */
export async function acceptAssignment(req: Request, res: Response) {
  const assignmentId = req.params.id
  const adminId = res.locals.user.id

  const assignment = await Assignment.findById(assignmentId)
  if (!assignment) {
    throw new AppError('Assignment Not Found', 404)
  }

  if (assignment.admin.id != adminId) {
    throw new AppError(
      'Only admin assoicated with the assignment can accept the assignment',
      403
    )
  }

  // TODO: Confirm the requirements for rejected assignments
  // Cannot accept rejected assignments
  if (assignment.status == 'rejected') {
    throw new AppError('Assignment already rejected', 400)
  }

  const update = await Assignment.findByIdAndUpdate(assignmentId, {
    status: 'accepted',
  })

  res.status(200).json(update)
}

/**
 * Reject an assignment
 * @path POST /assignments/:id/reject
 * @access admin
 */
export async function rejectAssignment(req: Request, res: Response) {
  const assignmentId = req.params.id
  const adminId = res.locals.user.id

  const assignment = await Assignment.findById(assignmentId)
  if (!assignment) {
    throw new AppError('Assignment Not Found', 404)
  }

  if (assignment.admin.id != adminId) {
    throw new AppError(
      'Only admin assoicated with the assignment can reject the assignment',
      403
    )
  }

  // TODO: Confirm the requirements for accepted assignments
  // Cannot reject accepted assignments
  if (assignment.status == 'accepted') {
    throw new AppError('Assignment already rejected', 400)
  }

  const update = await Assignment.findByIdAndUpdate(assignmentId, {
    status: 'rejected',
  })

  res.status(200).json(update)
}
