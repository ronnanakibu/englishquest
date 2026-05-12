import { PrismaClient } from '@prisma/client'

export class ProgressRepository {
  constructor(private prisma: PrismaClient) {}

  async findOrCreate(userId: string, lessonId: string) {
    return this.prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, status: 'IN_PROGRESS', attempts: 1 },
      update: { status: 'IN_PROGRESS', attempts: { increment: 1 } }
    })
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