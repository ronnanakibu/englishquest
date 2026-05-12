import { FastifyPluginAsync } from 'fastify'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { registerSchema, loginSchema } from './auth.schema'
import { AppError } from '../../shared/errors/AppError'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const authRepo = new AuthRepository(fastify.prisma)
  const authService = new AuthService(authRepo)

  fastify.post('/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Validation error',
        issues: parsed.error.flatten().fieldErrors
      })
    }

    try {
      const user = await authService.register(parsed.data)
      return reply.status(201).send({ message: 'Registrasi berhasil', user })
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message })
      }
      throw err
    }
  })

  fastify.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Validation error' })
    }

    try {
      const user = await authService.login(parsed.data)

      const accessToken = fastify.jwt.sign(
        { id: user.id, role: user.role },
        { expiresIn: '15m' }
      )
      const refreshToken = fastify.jwt.sign(
        { id: user.id },
        { expiresIn: '7d' }
      )

      await authRepo.updateRefreshToken(user.id, refreshToken)

      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })

      return reply.send({ accessToken, user })
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message })
      }
      throw err
    }
  })

  fastify.post('/logout', async (request, reply) => {
    const token = request.cookies?.refreshToken
    if (token) {
      try {
        const payload = fastify.jwt.verify<{ id: string }>(token)
        await authRepo.updateRefreshToken(payload.id, null)
      } catch {}
    }
    reply.clearCookie('refreshToken')
    return reply.send({ message: 'Logout berhasil' })
  })
}

export default authRoutes