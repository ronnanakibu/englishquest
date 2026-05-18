'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import { t } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

interface Lesson {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  xpReward: number
  questionCount: number
  order: number
  unlockLevel: number
  isLocked: boolean
  lockReason: string | null
  progress: { status: string; score: number } | null
}

interface Unit {
  title: string
  difficulty: string
  color: string
  bgColor: string
  lessons: Lesson[]
}

const UNITS: Omit<Unit, 'lessons'>[] = [
  { title: 'Getting Started', difficulty: 'BEGINNER', color: '#22C55E', bgColor: '#DCFCE7' },
  { title: 'Grammar Basics', difficulty: 'BEGINNER', color: '#22C55E', bgColor: '#DCFCE7' },
  { title: 'Everyday Life', difficulty: 'BEGINNER', color: '#22C55E', bgColor: '#DCFCE7' },
  { title: 'Intermediate Grammar', difficulty: 'INTERMEDIATE', color: '#F59E0B', bgColor: '#FEF3C7' },
  { title: 'Communication', difficulty: 'INTERMEDIATE', color: '#F59E0B', bgColor: '#FEF3C7' },
  { title: 'Reading', difficulty: 'INTERMEDIATE', color: '#F59E0B', bgColor: '#FEF3C7' },
  { title: 'Advanced Grammar', difficulty: 'ADVANCED', color: '#EF4444', bgColor: '#FEE2E2' },
]

function groupLessonsIntoUnits(lessons: Lesson[]): Unit[] {
  const units: Unit[] = []
  const chunkSize = 3

  for (let i = 0; i < UNITS.length; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    const unitLessons = lessons.filter(l => l.order > start && l.order <= end)
    if (unitLessons.length > 0) {
      units.push({ ...UNITS[i], lessons: unitLessons })
    }
  }

  // Remaining lessons go to last unit
  const covered = UNITS.length * chunkSize
  const remaining = lessons.filter(l => l.order > covered)
  if (remaining.length > 0) {
    units.push({
      title: 'Advanced Topics',
      difficulty: 'ADVANCED',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      lessons: remaining
    })
  }

  return units
}

export default function LearnPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { lang } = useLangStore()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetchLessons()
  }, [user])

  const fetchLessons = async () => {
    try {
      const res = await api.get('/api/v1/lessons')
      setLessons(res.data.lessons)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isLocked) {
      setLockedTooltip(lesson.lockReason)
      setTimeout(() => setLockedTooltip(null), 2500)
      return
    }
    router.push(`/learn/${lesson.id}`)
  }

  const getCategoryEmoji = (cat: string) => (
    { VOCABULARY: '📚', GRAMMAR: '✏️', LISTENING: '🎧', READING: '📖', SPEAKING: '🎤' }[cat] || '📚'
  )

  const xpForNextLevel = (level: number) => Math.floor(100 * Math.pow(level + 1, 2))
  const xpProgress = user
    ? Math.min((user.xp / xpForNextLevel(user.level)) * 100, 100)
    : 0

  const completedCount = lessons.filter(l => l.progress?.status === 'COMPLETED').length
  const units = groupLessonsIntoUnits(lessons)

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: '60px' }}>
          🌍
        </motion.div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar
        variant="app"
        stats={{ streak: user?.currentStreak || 0, xp: user?.xp || 0, hearts: user?.hearts || 0 }}
        onLogout={async () => { await logout(); router.push('/') }}
      />

      {/* Lock tooltip */}
      {lockedTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1E293B',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          🔒 {lockedTooltip}
        </motion.div>
      )}

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Welcome + XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(34,197,94,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', right: '50px', bottom: '-25px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: '2px' }}>
                {t(lang, 'greeting')}, {user?.username}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                Level {user?.level} · {completedCount}/{lessons.length} lessons done
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '10px 14px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>{user?.level}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px' }}>LEVEL</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{user?.xp} XP</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                Next: {xpForNextLevel(user?.level || 1)} XP
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '7px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'white', borderRadius: '99px' }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Unit Path */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {units.map((unit, unitIndex) => {
            const unitCompleted = unit.lessons.filter(l => l.progress?.status === 'COMPLETED').length
            const unitTotal = unit.lessons.length
            const isUnitComplete = unitCompleted === unitTotal

            return (
              <motion.div
                key={unitIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: unitIndex * 0.05 }}
              >
                {/* Unit Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: unit.bgColor,
                  border: `2px solid ${unit.color}30`,
                  borderRadius: '16px',
                  padding: '14px 18px',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: unit.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}>
                      {isUnitComplete ? '✅' : unitIndex + 1 <= 3 ? '🌱' : unitIndex + 1 <= 6 ? '⚡' : '🔥'}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.2px' }}>
                        Unit {unitIndex + 1}: {unit.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {unit.difficulty} · {unitCompleted}/{unitTotal} completed
                      </p>
                    </div>
                  </div>

                  {/* Unit progress bar */}
                  <div style={{ width: '80px' }}>
                    <div style={{ background: `${unit.color}30`, borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(unitCompleted / unitTotal) * 100}%`,
                        height: '100%',
                        background: unit.color,
                        borderRadius: '99px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Lessons in unit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                  {unit.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = lesson.progress?.status === 'COMPLETED'
                    const isInProgress = lesson.progress?.status === 'IN_PROGRESS'

                    return (
                      <motion.div
                        key={lesson.id}
                        whileHover={!lesson.isLocked ? { x: 4 } : {}}
                        whileTap={!lesson.isLocked ? { scale: 0.99 } : {}}
                        onClick={() => handleLessonClick(lesson)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 18px',
                          background: lesson.isLocked ? 'var(--bg-subtle)' : 'var(--bg-card)',
                          border: `1.5px solid ${isCompleted ? unit.color + '60' : lesson.isLocked ? 'var(--border)' : 'var(--border)'}`,
                          borderRadius: '16px',
                          cursor: lesson.isLocked ? 'not-allowed' : 'pointer',
                          opacity: lesson.isLocked ? 0.6 : 1,
                          boxShadow: lesson.isLocked ? 'none' : 'var(--shadow-sm)',
                          transition: 'all 0.15s',
                          position: 'relative',
                        }}
                      >
                        {/* Lesson icon */}
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: lesson.isLocked ? 'var(--bg-subtle)' : isCompleted ? unit.bgColor : 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0,
                          border: isCompleted ? `1.5px solid ${unit.color}40` : '1.5px solid transparent',
                        }}>
                          {lesson.isLocked ? '🔒' : getCategoryEmoji(lesson.category)}
                        </div>

                        {/* Lesson info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <h4 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: lesson.isLocked ? 'var(--text-muted)' : 'var(--text)',
                              letterSpacing: '-0.2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {lesson.title}
                            </h4>
                            {isInProgress && (
                              <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: '6px', fontWeight: 700, flexShrink: 0 }}>
                                IN PROGRESS
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                              📝 {lesson.questionCount} soal
                            </span>
                            {isCompleted && lesson.progress?.score !== undefined && (
                              <span style={{ fontSize: '12px', color: unit.color, fontWeight: 700 }}>
                                {lesson.progress.score}%
                              </span>
                            )}
                            {lesson.isLocked && lesson.lockReason && (
                              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                                {lesson.lockReason}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right side */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          {isCompleted ? (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: unit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                              ✓
                            </div>
                          ) : (
                            <span style={{
                              fontSize: '12px',
                              fontWeight: 800,
                              color: lesson.isLocked ? 'var(--text-subtle)' : unit.color,
                              background: lesson.isLocked ? 'var(--bg-subtle)' : unit.bgColor,
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontFamily: 'var(--font-display)',
                            }}>
                              +{lesson.xpReward} XP
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}