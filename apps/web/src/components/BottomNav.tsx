'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const leftItems = [
  { path: '/achievements', icon: '🏆', label: 'Awards' },
  { path: '/leaderboard', icon: '🏅', label: 'Ranks' },
]

const rightItems = [
  { path: '/checkin', icon: '🔥', label: 'Streak' },
  { path: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/')

  const NavItem = ({ item }: { item: { path: string; icon: string; label: string } }) => {
    const active = isActive(item.path)
    return (
      <motion.button
        onClick={() => router.push(item.path)}
        whileTap={{ scale: 0.88 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '3px',
          position: 'relative',
        }}
      >
        {active && (
          <motion.div
            layoutId="nav-indicator"
            style={{
              position: 'absolute',
              top: 0,
              left: '25%',
              right: '25%',
              height: '2.5px',
              background: 'var(--green)',
              borderRadius: '0 0 4px 4px',
            }}
          />
        )}
        <span style={{ fontSize: '22px', lineHeight: 1 }}>{item.icon}</span>
        <span style={{
          fontSize: '10px',
          fontWeight: active ? 800 : 600,
          color: active ? 'var(--green)' : 'var(--text-subtle)',
          fontFamily: 'var(--font-display)',
        }}>
          {item.label}
        </span>
      </motion.button>
    )
  }

  const centerActive = isActive('/learn')

  return (
    <>
      <div style={{ height: '64px' }} />

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>

        {/* Floating circle center button */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
        }}>
          <motion.button
            onClick={() => router.push('/learn')}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: centerActive ? '#15803d' : '#22c55e',
              border: '4px solid var(--bg-card)',
              boxShadow: '0 4px 18px rgba(34,197,94,0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: '1px',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: '21px', lineHeight: 1 }}>📚</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              color: 'white',
              fontFamily: 'var(--font-display)',
            }}>
              Learn
            </span>
          </motion.button>
        </div>

        {/* Bar */}
        <div style={{
          background: 'var(--bg-card)',
          borderTop: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'stretch',
          height: '64px',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {leftItems.map(item => <NavItem key={item.path} item={item} />)}
          {/* Empty center slot */}
          <div style={{ flex: 1 }} />
          {rightItems.map(item => <NavItem key={item.path} item={item} />)}
        </div>

      </div>
    </>
  )
}