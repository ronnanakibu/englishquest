import { PrismaClient } from '@prisma/client'

export class LessonRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string, userLevel: number) {
    const lessons = await this.prisma.lesson.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { questions: true } },
        progress: {
          where: { userId },
          select: { status: true, score: true, xpEarned: true }
        }
      }
    })

    // Build completed set untuk lock logic
    const completedOrders = new Set<number>()
    for (const lesson of lessons) {
      if (lesson.progress[0]?.status === 'COMPLETED') {
        completedOrders.add(lesson.order)
      }
    }

    return lessons.map(lesson => {
      const progress = lesson.progress[0] || null
      const isFirstLesson = lesson.order === 1
      const prevCompleted = completedOrders.has(lesson.order - 1)
      const levelOk = userLevel >= lesson.unlockLevel

      // Lock logic:
      // - Lesson 1 selalu unlock
      // - Lesson lain: level cukup AND lesson sebelumnya completed
      const isLocked = !isFirstLesson && !(levelOk && prevCompleted)

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        difficulty: lesson.difficulty,
        order: lesson.order,
        xpReward: lesson.xpReward,
        unlockLevel: lesson.unlockLevel,
        questionCount: lesson._count.questions,
        progress,
        isLocked,
        lockReason: isLocked
          ? !levelOk
            ? `Reach level ${lesson.unlockLevel} to unlock`
            : 'Complete previous lesson first'
          : null
      }
    })
  }

  async findById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } }
    })
  }

  async findByIdPublished(id: string) {
    return this.prisma.lesson.findFirst({
      where: { id, isPublished: true },
      include: { questions: { orderBy: { order: 'asc' } } }
    })
  }
}