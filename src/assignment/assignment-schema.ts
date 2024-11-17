import { z } from 'zod'

export const uploadSchema = z.object({
  task: z.string(),
  admin: z.string(),
})

export type UploadInput = z.infer<typeof uploadSchema>
