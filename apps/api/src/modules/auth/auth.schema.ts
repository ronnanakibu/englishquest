import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  username: z.string().min(3, 'Username minimal 3 karakter').max(20),
  password: z.string().min(8, 'Password minimal 8 karakter')
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>