import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error']
  })

  await prisma.$connect()
  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
})

export default fp(async (server: FastifyInstance, opts) => {
  const prisma = new PrismaClient()
  
  await prisma.$connect()
  
  server.decorate('prisma', prisma)
  
  server.addHook('onClose', async (server: FastifyInstance) => {
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin
