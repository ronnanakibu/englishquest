import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

export default fp(async (server: FastifyInstance, opts) => {
  const prisma = new PrismaClient()
  await prisma.$connect()
  server.decorate('prisma', prisma)
  
  server.addHook('onClose', async (server: FastifyInstance) => {
    await server.prisma.$disconnect()
  })
})
