import { PrismaClient } from '@prisma/client'

export class LessonRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string, userLevel: number) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        isPublished: true,
        unlockLevel: { lte: userLevel }
      },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { questions: true } },
        progress: {
          where: { userId },
          select: { status: true, score: true, xpEarned: true }
        }
      }
    })

    return lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      difficulty: lesson.difficulty,
      order: lesson.order,
      xpReward: lesson.xpReward,
      questionCount: lesson._count.questions,
      progress: lesson.progress[0] || null
    }))
  }

  async findById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })
  }

  async findByIdPublished(id: string) {
    return this.prisma.lesson.findFirst({
      where: { id, isPublished: true },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })
  }
}