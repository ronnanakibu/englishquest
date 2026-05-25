'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import BottomNav from '@/components/BottomNav'
import { apiCache } from '@/lib/cache'

interface Achievement {
  id: string
  code: string
  title: string
  description: string
  xpReward: number
  isHidden: boolean
  earnedAt?: string
}

export default function AchievementsPage() {
  const router = useRouter()
  const { user, logout, isHydrated } = useAuthStore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [earned, setEarned] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (!isHydrated) return
    if (!user) { router.push('/login'); return }
    fetchAchievements()
  }, [user, isHydrated])

  const fetchAchievements = async () => {
    const cached = apiCache.get('achievements')
    if (cached) {
      setAchievements(cached.all)
      setEarned(cached.earned)
      setIsLoading(false)
      return
    }
    try {
      const res = await api.get('/api/v1/achievements')
      setAchievements(res.data.all)
      setEarned(res.data.earned)
      apiCache.set('achievements', res.data)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const isEarned = (code: string) => earned.some(e => e.code === code)
  const getEarnedDate = (code: string) => earned.find(e => e.code === code)?.earnedAt

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: '60px' }}>
          🏆
        </motion.div>
      </div>
    )
  }

  const earnedCount = earned.length
  const totalVisible = achievements.filter(a => !a.isHidden).length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar
        variant="app"
        stats={{ streak: user?.currentStreak || 0, xp: user?.xp || 0, hearts: user?.hearts || 0 }}
        onLogout={async () => { await logout(); router.push('/') }}
      />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(245,158,11,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                Achievements 🏆
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                {earnedCount} of {totalVisible} unlocked
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>
                {Math.round((earnedCount / Math.max(totalVisible, 1)) * 100)}%
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>DONE</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '7px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'white', borderRadius: '99px' }}
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / Math.max(totalVisible, 1)) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Achievement Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {achievements.map((achievement, i) => {
            const unlocked = isEarned(achievement.code)
            const earnedDate = getEarnedDate(achievement.code)
            const isHidden = achievement.isHidden && !unlocked

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: unlocked ? 'var(--bg-card)' : 'var(--bg-subtle)',
                  border: `1.5px solid ${unlocked ? '#F59E0B40' : 'var(--border)'}`,
                  borderRadius: '16px',
                  opacity: isHidden ? 0.5 : 1,
                  boxShadow: unlocked ? '0 2px 12px rgba(245,158,11,0.1)' : 'none',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: unlocked ? '#FEF3C7' : 'var(--bg-subtle)',
                  border: `2px solid ${unlocked ? '#F59E0B40' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                  filter: unlocked ? 'none' : 'grayscale(1)',
                }}>
                  {isHidden ? '❓' : unlocked ? '🏆' : '🔒'}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: unlocked ? 'var(--text)' : 'var(--text-muted)',
                    marginBottom: '2px',
                  }}>
                    {isHidden ? '???' : achievement.title}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-subtle)',
                    lineHeight: 1.4,
                  }}>
                    {isHidden ? 'Keep playing to discover this achievement' : achievement.description}
                  </p>
                  {unlocked && earnedDate && (
                    <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700, marginTop: '2px' }}>
                      Unlocked {new Date(earnedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* XP Badge */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: unlocked ? '#F59E0B' : 'var(--text-subtle)',
                    background: unlocked ? '#FEF3C7' : 'var(--bg-subtle)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-display)',
                  }}>
                    +{achievement.xpReward} XP
                  </span>
                  {unlocked && <span style={{ fontSize: '16px' }}>✅</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </main>
  )
}