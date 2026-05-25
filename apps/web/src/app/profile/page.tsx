'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import api from '@/lib/api'
import { apiCache } from '@/lib/cache'
import DeveloperCard from './developer'

interface UserProfile {
  id: string
  email: string
  username: string
  role: string
  xp: number
  level: number
  hearts: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
}

// GANTI dengan ini
function getLevelProgress(xp: number, level: number) {
  const currentLevelXp = Math.floor(100 * Math.pow(level, 2))
  const nextLevelXp = Math.floor(100 * Math.pow(level + 1, 2))
  const xpInLevel = xp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp
  const progress = (xpInLevel / xpNeeded) * 100
  return { progress: Math.min(Math.max(progress, 0), 100), xpInLevel, xpNeeded }
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '26px' }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: 800,
        color,
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        color: 'var(--text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </span>
    </motion.div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user: authUser, logout, isHydrated } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isHydrated) return
    if (!authUser) { router.push('/login'); return }
    fetchProfile()
  }, [authUser, isHydrated])

  const fetchProfile = async () => {
    const cached = apiCache.get('profile')
    if (cached) { setProfile(cached); setIsLoading(false); return }
    try {
      const res = await api.get('/api/v1/user/me')
      setProfile(res.data.user)
      apiCache.set('profile', res.data.user)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '60px' }}
        >
          👤
        </motion.div>
      </div>
    )
  }

  if (!profile) return null

  const { progress, xpInLevel, xpNeeded } = getLevelProgress(profile.xp, profile.level)
  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <Navbar
        variant="app"
        stats={{
          streak: profile.currentStreak,
          xp: profile.xp,
          hearts: profile.hearts,
        }}
        onLogout={handleLogout}
      />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(59,130,246,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', right: '40px', bottom: '-30px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
            }}>
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.5px',
                marginBottom: '2px',
              }}>
                {profile.username}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                {profile.email}
              </p>
            </div>

            {/* Level badge */}
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '14px',
              padding: '10px 14px',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {profile.level}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginTop: '2px' }}>
                LEVEL
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div style={{ marginTop: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {xpInLevel} / {xpNeeded} XP
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                Level {profile.level + 1} →
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'white', borderRadius: '99px' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <StatCard label="Total XP" value={profile.xp.toLocaleString()} icon="⚡" color="var(--yellow, #F59E0B)" />
          <StatCard label="Current Streak" value={`${profile.currentStreak}d`} icon="🔥" color="#EF4444" />
          <StatCard label="Longest Streak" value={`${profile.longestStreak}d`} icon="🏆" color="#8B5CF6" />
          <StatCard label="Hearts" value={profile.hearts} icon="❤️" color="#EC4899" />
        </div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '16px',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '14px',
          }}>
            Account
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Username', value: profile.username },
              { label: 'Email', value: profile.email },
              { label: 'Role', value: profile.role.charAt(0).toUpperCase() + profile.role.slice(1).toLowerCase() },
              {
                label: 'Last Active',
                value: profile.lastActiveDate
                  ? new Date(profile.lastActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Today'
              },
            ].map((item) => (
              <div key={item.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '14px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Developer Card Trigger */}
        <DeveloperCard />

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            border: '1.5px solid #EF444460',
            borderRadius: '16px',
            color: '#EF4444',
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '-0.3px',
          }}
        >
          Logout
        </motion.button>

      </div>

      <BottomNav />
    </main>
  )
}
