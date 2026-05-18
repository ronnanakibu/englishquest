import { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../shared/middleware/auth.middleware'

const HEART_RESTORE_INTERVAL_MS = 15 * 60 * 1000 // 15 menit
const MAX_HEARTS = 5

const STREAK_MILESTONES: Record<number, { xp: number; hearts: number }> = {
  3:  { xp: 30,  hearts: 1 },
  7:  { xp: 75,  hearts: 1 },
  14: { xp: 150, hearts: 2 },
  30: { xp: 300, hearts: 2 },
  60: { xp: 600, hearts: 3 },
  100:{ xp: 1000,hearts: 3 },
}

const checkinRoutes: FastifyPluginAsync = async (fastify) => {

  // GET /api/v1/checkin — ambil status check-in + streak data
  fastify.get('/', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const { id: userId } = request.user as { id: string }

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        hearts: true,
        maxHearts: true,
        lastHeartRefill: true,
        currentStreak: true,
        longestStreak: true,
        lastCheckIn: true,
      }
    })
    if (!user) return reply.status(404).send({ error: 'User tidak ditemukan' })

    // Hitung heart restore
    const now = new Date()
    const heartRestore = computeHeartRestore(user.hearts, user.maxHearts, user.lastHeartRefill, now)

    // Cek apakah sudah check-in hari ini
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const hasCheckedInToday = user.lastCheckIn
      ? new Date(user.lastCheckIn) >= todayStart
      : false

    // Ambil streak log 30 hari terakhir buat graph
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const streakLogs = await fastify.prisma.streakLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      select: { date: true, maintained: true },
      orderBy: { date: 'asc' }
    })

    return reply.send({
      streak: {
        current: user.currentStreak,
        longest: user.longestStreak,
      },
      checkin: {
        hasCheckedInToday,
        reward: getCheckinReward(user.currentStreak + (hasCheckedInToday ? 0 : 1)),
      },
      hearts: {
        current: user.hearts,
        max: user.maxHearts,
        nextRestoreAt: heartRestore.nextRestoreAt,
        minutesUntilRestore: heartRestore.minutesUntilRestore,
        isFull: user.hearts >= user.maxHearts,
      },
      streakGraph: streakLogs.map(l => ({
        date: l.date.toISOString().split('T')[0],
        active: l.maintained,
      }))
    })
  })

  // POST /api/v1/checkin — daily check-in
  fastify.post('/', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const { id: userId } = request.user as { id: string }

    const user = await fastify.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return reply.status(404).send({ error: 'User tidak ditemukan' })

    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)

    // Guard: sudah check-in hari ini
    if (user.lastCheckIn && new Date(user.lastCheckIn) >= todayStart) {
      return reply.status(400).send({ error: 'Sudah check-in hari ini' })
    }

    // Update streak
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null
    if (lastActive) lastActive.setHours(0, 0, 0, 0)
    const yesterday = new Date(todayStart)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = lastActive?.getTime() === yesterday.getTime()
    const newStreak = isYesterday ? user.currentStreak + 1 : 1
    const newLongest = Math.max(user.longestStreak, newStreak)

    // Cek streak milestone reward
    const milestone = STREAK_MILESTONES[newStreak]
    const xpReward = (milestone?.xp ?? 0) + 10 // base 10 XP tiap check-in
    const heartsReward = milestone?.hearts ?? 0
    const newHearts = Math.min(user.hearts + heartsReward, user.maxHearts)

    // Update user
    await fastify.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: todayStart,
        lastCheckIn: now,
        xp: { increment: xpReward },
        hearts: newHearts,
      }
    })

    // Log XP
    await fastify.prisma.xPLog.create({
      data: {
        userId,
        amount: xpReward,
        source: 'DAILY_CHECKIN',
        metadata: { streak: newStreak, milestone: !!milestone }
      }
    })

    // Log streak
    await fastify.prisma.streakLog.upsert({
      where: { userId_date: { userId, date: todayStart } },
      create: { userId, date: todayStart, maintained: true },
      update: { maintained: true }
    })

    return reply.send({
      success: true,
      newStreak,
      xpEarned: xpReward,
      heartsEarned: heartsReward,
      isMilestone: !!milestone,
      milestoneReward: milestone ?? null,
    })
  })

  // POST /api/v1/checkin/restore-hearts — manual trigger (opsional, mostly handled client-side)
  fastify.post('/restore-hearts', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const { id: userId } = request.user as { id: string }

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: { hearts: true, maxHearts: true, lastHeartRefill: true }
    })
    if (!user) return reply.status(404).send({ error: 'User tidak ditemukan' })

    if (user.hearts >= user.maxHearts) {
      return reply.send({ hearts: user.hearts, restored: 0 })
    }

    const now = new Date()
    const { heartsToRestore, newLastRefill } = computeHeartRestore(
      user.hearts, user.maxHearts, user.lastHeartRefill, now
    )

    if (heartsToRestore === 0) {
      return reply.send({ hearts: user.hearts, restored: 0 })
    }

    const newHearts = Math.min(user.hearts + heartsToRestore, user.maxHearts)
    await fastify.prisma.user.update({
      where: { id: userId },
      data: { hearts: newHearts, lastHeartRefill: newLastRefill }
    })

    return reply.send({ hearts: newHearts, restored: heartsToRestore })
  })
}

// ─── Helpers ───────────────────────────────────────────────

function computeHeartRestore(
  hearts: number,
  maxHearts: number,
  lastRefill: Date,
  now: Date
) {
  if (hearts >= maxHearts) {
    return { heartsToRestore: 0, nextRestoreAt: null, minutesUntilRestore: 0, newLastRefill: lastRefill }
  }

  const elapsed = now.getTime() - new Date(lastRefill).getTime()
  const heartsToRestore = Math.min(
    Math.floor(elapsed / HEART_RESTORE_INTERVAL_MS),
    maxHearts - hearts
  )

  const nextRestoreAt = new Date(
    new Date(lastRefill).getTime() +
    (Math.floor(elapsed / HEART_RESTORE_INTERVAL_MS) + 1) * HEART_RESTORE_INTERVAL_MS
  )

  const minutesUntilRestore = Math.ceil(
    (nextRestoreAt.getTime() - now.getTime()) / 60000
  )

  const newLastRefill = heartsToRestore > 0
    ? new Date(new Date(lastRefill).getTime() + heartsToRestore * HEART_RESTORE_INTERVAL_MS)
    : lastRefill

  return { heartsToRestore, nextRestoreAt, minutesUntilRestore, newLastRefill }
}

function getCheckinReward(streakDay: number) {
  const milestone = STREAK_MILESTONES[streakDay]
  return {
    xp: (milestone?.xp ?? 0) + 10,
    hearts: milestone?.hearts ?? 0,
    isMilestone: !!milestone,
  }
}

export default checkinRoutes