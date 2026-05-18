'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LevelUpScreenProps {
  newLevel: number
  show: boolean
  onClose: () => void
}

export default function LevelUpScreen({ newLevel, show, onClose }: LevelUpScreenProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: '80px', marginBottom: '20px' }}
            >
              🎖️
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#F59E0B',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Level Up!
              </div>
              <div style={{
                fontSize: '80px',
                fontWeight: 900,
                color: 'white',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-4px',
                lineHeight: 1,
                marginBottom: '12px',
              }}>
                {newLevel}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#94A3B8',
                fontWeight: 600,
              }}>
                You reached level {newLevel}! 🚀
              </div>
              <div style={{
                marginTop: '20px',
                fontSize: '13px',
                color: '#64748B',
              }}>
                Tap anywhere to continue
              </div>
            </motion.div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: '50vw', 
                y: '50vh',
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: 0,
                scale: Math.random() * 2 + 0.5
              }}
              transition={{ 
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              style={{
                position: 'fixed',
                fontSize: ['⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 4)],
                pointerEvents: 'none',
              }}
            >
              {['⭐', '✨', '💫', '🌟'][i % 4]}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}