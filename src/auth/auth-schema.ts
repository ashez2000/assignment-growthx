import { z } from 'zod'

export const registerSChema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
})

export type RegisterInput = z.infer<typeof registerSChema>

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
