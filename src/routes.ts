import { Router } from 'express'

import { authenticate, restrict } from './auth/auth-middleware.js'

import { register, login, logout } from './auth/auth-controller.js'
import { uploadAssignment } from './assignment/assignment-controller.js'
import { getAdmins } from './user/user-controller.js'
import assignmentRoutes from './assignment/assignment-routes.js'

const router = Router()

// Auth routes for users and admins
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// User routes
router.get('/admins', authenticate, restrict('user'), getAdmins)
router.post('/upload', authenticate, restrict('user'), uploadAssignment)

// Admin routes
router.use('/assignments', assignmentRoutes)

export default router
