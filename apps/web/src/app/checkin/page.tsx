'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import api from '@/lib/api'

interface CheckinData {
  streak: { current: number; longest: number }
  checkin: {
    hasCheckedInToday: boolean
    reward: { xp: number; hearts: number; isMilestone: boolean }
  }
  hearts: {
    current: number
    max: number
    nextRestoreAt: string | null
    minutesUntilRestore: number
    isFull: boolean
  }
  streakGraph: { date: string; active: boolean }[]
}

const MILESTONE_LABELS: Record<number, string> = {
  3: '3 Day Streak 🔥',
  7: 'Week Warrior ⚡',
  14: '2 Week Legend 💎',
  30: 'Monthly Master 👑',
  60: '2 Month God 🌟',
  100: 'Century 🏆',
}

function getLast30Days() {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function HeartTimer({ minutesUntilRestore, isFull }: { minutesUntilRestore: number; isFull: boolean }) {
  const [mins, setMins] = useState(minutesUntilRestore)

  useEffect(() => {
    if (isFull) return
    setMins(minutesUntilRestore)
    const interval = setInterval(() => {
      setMins(prev => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(interval)
  }, [minutesUntilRestore, isFull])

  if (isFull) return (
    <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 700 }}>Full ✓</span>
  )
  return (
    <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 700 }}>
      +1 ❤️ in {mins}m
    </span>
  )
}

export default function CheckinPage() {
  const router = useRouter()
  const { user, logout, refreshUser, isHydrated } = useAuthStore()
  const [data, setData] = useState<CheckinData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [justCheckedIn, setJustCheckedIn] = useState(false)
  const [checkinResult, setCheckinResult] = useState<any>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/checkin')
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    if (!user) { router.push('/login'); return }
    fetchData()
  }, [user, isHydrated])

  const handleCheckin = async () => {
    if (!data || data.checkin.hasCheckedInToday || isChecking) return
    setIsChecking(true)
    try {
      const res = await api.post('/api/v1/checkin')
      setCheckinResult(res.data)
      setJustCheckedIn(true)
      await refreshUser()
      await fetchData()
    } catch (err: any) {
      console.error(err)
    } finally {
      setIsChecking(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: '60px' }}>
          🔥
        </motion.div>
      </div>
    )
  }

  if (!data) return null

  const allDays = getLast30Days()
  const activeSet = new Set(data.streakGraph.map(d => d.date))
  const today = new Date().toISOString().split('T')[0]
  const nextStreak = data.streak.current + (data.checkin.hasCheckedInToday ? 0 : 1)
  const nextMilestone = Object.keys(MILESTONE_LABELS)
    .map(Number)
    .find(m => m > data.streak.current)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '80px' }}>
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
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(239,68,68,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                Daily Check-in 🔥
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
                Keep your streak alive every day
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {data.streak.current}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>STREAK</div>
            </div>
          </div>

          {/* Next milestone progress */}
          {nextMilestone && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                  Next: {MILESTONE_LABELS[nextMilestone]}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                  {nextMilestone - data.streak.current}d to go
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '7px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'white', borderRadius: '99px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.streak.current / nextMilestone) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Check-in button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-card)',
            border: `1.5px solid ${data.checkin.hasCheckedInToday ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {justCheckedIn && checkinResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                  {checkinResult.isMilestone ? '🎉' : '✅'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
                  {checkinResult.isMilestone ? MILESTONE_LABELS[checkinResult.newStreak] || 'Milestone!' : 'Checked in!'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B' }}>+{checkinResult.xpEarned} XP</span>
                  {checkinResult.heartsEarned > 0 && (
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>+{checkinResult.heartsEarned} ❤️</span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="checkin">
                <div style={{ fontSize: '13px', color: 'var(--text-subtle)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Today's Reward
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#F59E0B' }}>
                      +{data.checkin.reward.xp} XP
                    </div>
                    {data.checkin.reward.hearts > 0 && (
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: '#EF4444' }}>
                        +{data.checkin.reward.hearts} ❤️
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckin}
                  disabled={data.checkin.hasCheckedInToday || isChecking}
                  whileTap={!data.checkin.hasCheckedInToday ? { scale: 0.97 } : {}}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: data.checkin.hasCheckedInToday ? 'var(--bg-subtle)' : '#EF4444',
                    color: data.checkin.hasCheckedInToday ? 'var(--text-subtle)' : 'white',
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: data.checkin.hasCheckedInToday ? 'default' : 'pointer',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {data.checkin.hasCheckedInToday
                    ? '✓ Checked in today'
                    : isChecking ? 'Checking in...' : '🔥 Check In'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hearts restore */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            padding: '18px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>❤️</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                Hearts
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
                {Array.from({ length: data.hearts.max }).map((_, i) => (
                  <span key={i} style={{ fontSize: '14px', opacity: i < data.hearts.current ? 1 : 0.25 }}>❤️</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#EF4444' }}>
              {data.hearts.current}/{data.hearts.max}
            </div>
            <HeartTimer
              minutesUntilRestore={data.hearts.minutesUntilRestore}
              isFull={data.hearts.isFull}
            />
          </div>
        </motion.div>

        {/* Streak Graph — GitHub style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Last 30 Days
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Longest: {data.streak.longest}d 🏆
            </span>
          </div>

          {/* Grid 6 rows x 5 cols = 30 days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '5px',
          }}>
            {allDays.map((day, i) => {
              const isActive = activeSet.has(day)
              const isToday = day === today
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.015 }}
                  title={day}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '6px',
                    background: isActive
                      ? '#EF4444'
                      : isToday
                      ? 'var(--bg-subtle)'
                      : 'var(--bg-subtle)',
                    border: isToday ? '2px solid #EF4444' : '2px solid transparent',
                    opacity: isActive ? 1 : 0.35,
                    boxShadow: isActive ? '0 2px 6px rgba(239,68,68,0.3)' : 'none',
                  }}
                />
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Less</span>
            {[0.2, 0.4, 0.6, 0.8, 1].map((o, i) => (
              <div key={i} style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#EF4444', opacity: o }} />
            ))}
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>More</span>
          </div>
        </motion.div>

        {/* Milestone rewards info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
            Streak Milestones
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(MILESTONE_LABELS).map(([days, label]) => {
              const d = Number(days)
              const reached = data.streak.current >= d
              const milestone = { 3: { xp: 30, hearts: 1 }, 7: { xp: 75, hearts: 1 }, 14: { xp: 150, hearts: 2 }, 30: { xp: 300, hearts: 2 }, 60: { xp: 600, hearts: 3 }, 100: { xp: 1000, hearts: 3 } }[d]!
              return (
                <div key={days} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: reached ? 'var(--green-light, #f0fdf4)' : 'var(--bg-subtle)',
                  border: `1.5px solid ${reached ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  opacity: reached ? 1 : 0.7,
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{reached ? '✅' : '🔒'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '1px' }}>
                      {d} day streak
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>+{milestone.xp} XP</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>+{milestone.hearts} ❤️</div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>

      <BottomNav />
    </main>
  )
}