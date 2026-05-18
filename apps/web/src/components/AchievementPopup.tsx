'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Achievement {
  title: string
  description: string
  xpReward: number
}

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [achievement])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            border: '1.5px solid #F59E0B',
            borderRadius: '20px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
            cursor: 'pointer',
            minWidth: '300px',
            maxWidth: '400px',
          }}
          onClick={onClose}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '36px', flexShrink: 0 }}
          >
            🏆
          </motion.div>
          <div>
            <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>
              Achievement Unlocked!
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginBottom: '2px' }}>
              {achievement.title}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              {achievement.description} · +{achievement.xpReward} XP
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '20px', flexShrink: 0 }}
          >
            ✨
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}