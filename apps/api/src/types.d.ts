import { PrismaClient } from '@prisma/client';
import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    jwt: JWT;
  }
  
  interface FastifyRequest {
    user: any; // Ganti 'any' dengan interface User yang lu punya kalau mau lebih ketat
  }
}
