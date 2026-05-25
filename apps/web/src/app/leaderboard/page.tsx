'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import api from '@/lib/api'
import { apiCache } from '@/lib/cache'

interface LeaderboardEntry {
  id: string
  username: string
  xp: number
  level: number
  currentStreak: number
  rank: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  currentUserRank: number | null
}

const RANK_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B40' },
  2: { bg: '#F1F5F9', text: '#64748B', border: '#94A3B840' },
  3: { bg: '#FEF2EE', text: '#C2410C', border: '#FB923C40' },
}

const RANK_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function LeaderboardPage() {
  const router = useRouter()
  const { user, logout, isHydrated } = useAuthStore()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isHydrated) return
    if (!user) { router.push('/login'); return }
    fetchLeaderboard()
  }, [user, isHydrated])

  const fetchLeaderboard = async () => {
    const cached = apiCache.get('leaderboard')
    if (cached) { setData(cached); setIsLoading(false); return }
    try {
      const res = await api.get('/api/v1/leaderboard')
      setData(res.data)
      apiCache.set('leaderboard', res.data)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '60px' }}
        >
          🏅
        </motion.div>
      </div>
    )
  }

  const entries = data?.leaderboard ?? []
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)
  const myRank = data?.currentUserRank

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
            background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(139,92,246,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                Leaderboard 🏅
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
                Top {entries.length} players by XP
              </p>
            </div>
            {myRank && (
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>
                  #{myRank}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>YOUR RANK</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {top3.map((entry, i) => {
              const colors = RANK_COLORS[entry.rank]
              const isMe = entry.id === user?.id
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    flex: 1,
                    background: isMe ? 'var(--bg-card)' : colors.bg,
                    border: `2px solid ${isMe ? '#8B5CF6' : colors.border}`,
                    borderRadius: '20px',
                    padding: '16px 12px',
                    textAlign: 'center',
                    boxShadow: isMe ? '0 4px 16px rgba(139,92,246,0.2)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{RANK_EMOJI[entry.rank]}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: isMe ? '#8B5CF6' : colors.text,
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.username}{isMe ? ' 👈' : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    Lv.{entry.level}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: isMe ? '#8B5CF6' : colors.text,
                    fontFamily: 'var(--font-display)',
                  }}>
                    {entry.xp.toLocaleString()} XP
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Rest of leaderboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rest.map((entry, i) => {
            const isMe = entry.id === user?.id
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 + i * 0.03 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  background: isMe ? 'var(--bg-card)' : 'var(--bg-subtle)',
                  border: `1.5px solid ${isMe ? '#8B5CF6' : 'var(--border)'}`,
                  borderRadius: '14px',
                  boxShadow: isMe ? '0 2px 12px rgba(139,92,246,0.15)' : 'none',
                }}
              >
                {/* Rank */}
                <div style={{
                  width: '32px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: isMe ? '#8B5CF6' : 'var(--text-subtle)',
                  flexShrink: 0,
                }}>
                  #{entry.rank}
                </div>

                {/* Avatar */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isMe ? '#EDE9FE' : 'var(--bg-card)',
                  border: `1.5px solid ${isMe ? '#8B5CF6' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: isMe ? '#7C3AED' : 'var(--text-subtle)',
                  flexShrink: 0,
                }}>
                  {entry.username.slice(0, 2).toUpperCase()}
                </div>

                {/* Name + level */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: isMe ? '#8B5CF6' : 'var(--text)',
                  }}>
                    {entry.username}{isMe ? ' 👈' : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                    Lv.{entry.level} · 🔥 {entry.currentStreak}d
                  </div>
                </div>

                {/* XP */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: isMe ? '#8B5CF6' : 'var(--text)',
                  flexShrink: 0,
                }}>
                  {entry.xp.toLocaleString()} XP
                </div>
              </motion.div>
            )
          })}
        </div>

        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏜️</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>No players yet</p>
          </div>
        )}

      </div>

      <BottomNav />
    </main>
  )
}