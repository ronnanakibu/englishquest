import { PrismaClient } from '@prisma/client'

export class ProgressRepository {
  constructor(private prisma: PrismaClient) {}

  async findOrCreate(userId: string, lessonId: string) {
  // Coba find dulu
  const existing = await this.prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } }
  })

  if (existing) {
    return this.prisma.userProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: {
        status: existing.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
        attempts: { increment: 1 }
      }
    })
  }

  // Kalau create gagal karena duplicate, fallback ke findUnique
  try {
    return await this.prisma.userProgress.create({
      data: { userId, lessonId, status: 'IN_PROGRESS', attempts: 1 }
    })
  } catch (err: any) {
    if (err.code === 'P2002') {
      // Already exists — just return it
      return this.prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } }
      })
    }
    throw err
  }
}

  async findByUserAndLesson(userId: string, lessonId: string) {
    return this.prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    })
  }

  async saveAnswer(data: {
    progressId: string
    questionId: string
    userAnswer: string
    isCorrect: boolean
    timeSpent: number
  }) {
    return this.prisma.userAnswer.create({ data })
  }

async complete(progressId: string, score: number, xpEarned: number) {
  return this.prisma.userProgress.update({
    where: { id: progressId },
    data: {
      status: 'COMPLETED',
      score,
      xpEarned,
      completedAt: new Date()
    }
  })
}

async updateBestScore(progressId: string, score: number) {
  return this.prisma.userProgress.update({
    where: { id: progressId },
    data: { bestScore: score, score }
  })
}
}