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
  progress: { status: string; score: number } | null
}

export default function LearnPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { lang } = useLangStore()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getCategoryEmoji = (cat: string) => ({ VOCABULARY: '📚', GRAMMAR: '✏️', LISTENING: '🎧', READING: '📖', SPEAKING: '🎤' }[cat] || '📚')

  const getDifficultyStyle = (d: string) => ({
    BEGINNER: { color: 'var(--green)', bg: 'var(--green-light)' },
    INTERMEDIATE: { color: 'var(--yellow)', bg: 'var(--yellow-light)' },
    ADVANCED: { color: 'var(--red)', bg: 'var(--red-light)' },
  }[d] || { color: 'var(--text-muted)', bg: 'var(--bg-subtle)' })

  const xpForNextLevel = (level: number) => Math.floor(100 * Math.pow(level, 2))
  const xpProgress = user ? Math.min(((user.xp % xpForNextLevel(user.level)) / xpForNextLevel(user.level)) * 100, 100) : 0
  const completedCount = lessons.filter(l => l.progress?.status === 'COMPLETED').length

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '60px' }}
        >
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
        onLogout={handleLogout}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--green) 0%, #16A34A 100%)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-green)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute',
            right: '60px',
            bottom: '-30px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.5px',
                marginBottom: '4px',
              }}>
                {t(lang, 'greeting')}, {user?.username}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
                Level {user?.level} · {completedCount} {t(lang, 'levelInfo')}
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              padding: '12px 16px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>
                {user?.level}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: 700, letterSpacing: '0.5px' }}>
                LEVEL
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                {user?.xp} XP
              </span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                {t(lang, 'nextLevel')}: {xpForNextLevel(user?.level || 1)} XP
              </span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '99px',
              height: '8px',
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'white',
                  borderRadius: '99px',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.3px',
          }}>
            {t(lang, 'lessonsAvailable')}
          </h2>
          <span style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}>
            {completedCount}/{lessons.length} selesai
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '12px',
        }}>
          {lessons.map((lesson, i) => {
            const diffStyle = getDifficultyStyle(lesson.difficulty)
            const isCompleted = lesson.progress?.status === 'COMPLETED'

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                whileHover={{ y: -3, boxShadow: 'var(--shadow-md)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => router.push(`/learn/${lesson.id}`)}
                style={{
                  background: 'var(--bg-card)',
                  border: `1.5px solid ${isCompleted ? 'var(--green-muted)' : 'var(--border)'}`,
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0,
                    }}>
                      {getCategoryEmoji(lesson.category)}
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        marginBottom: '4px',
                        letterSpacing: '-0.2px',
                      }}>
                        {lesson.title}
                      </h3>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: diffStyle.color,
                        background: diffStyle.bg,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                      }}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  {isCompleted && <span style={{ fontSize: '20px' }}>✅</span>}
                  {lesson.progress?.status === 'IN_PROGRESS' && <span style={{ fontSize: '20px' }}>⏳</span>}
                </div>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  marginBottom: '14px',
                }}>
                  {lesson.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    📝 {lesson.questionCount} {t(lang, 'questions')}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--green)',
                    background: 'var(--green-light)',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-display)',
                  }}>
                    +{lesson.xpReward} XP
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}