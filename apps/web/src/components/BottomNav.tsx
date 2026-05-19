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
          paddingTop: '10px',
          paddingBottom: '6px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '3px',
          position: 'relative',
          WebkitTapHighlightColor: 'transparent',
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
          letterSpacing: '0.2px',
        }}>
          {item.label}
        </span>
      </motion.button>
    )
  }

  const centerActive = isActive('/learn')

  return (
    <>
      {/* Spacer — reserve space for fixed bottom nav + safe area */}
      <div style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))' }} />

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,          // tinggi banget biar tidak tertutup apapun
        isolation: 'isolate',  // fix stacking context
      }}>
        {/* Floating center button */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
        }}>
          <motion.button
            onClick={() => router.push('/learn')}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: centerActive
                ? 'linear-gradient(135deg, #15803d, #166534)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: '3px solid var(--bg-card)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: '1px',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: '21px', lineHeight: 1 }}>📚</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              color: 'white',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.3px',
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
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}>
          {leftItems.map(item => <NavItem key={item.path} item={item} />)}
          <div style={{ flex: 1 }} />
          {rightItems.map(item => <NavItem key={item.path} item={item} />)}
        </div>
      </div>
    </>
  )
}