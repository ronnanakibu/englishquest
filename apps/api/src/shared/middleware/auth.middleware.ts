import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}

export async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    const payload = request.user as { id: string; role: string }
    if (payload.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Forbidden' })
    }
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}