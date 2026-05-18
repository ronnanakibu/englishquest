'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface XPFloatProps {
  amount: number
  show: boolean
  onComplete?: () => void
}

export default function XPFloat({ amount, show, onComplete }: XPFloatProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -80, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
            pointerEvents: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 900,
            color: '#EAB308',
            textShadow: '0 2px 8px rgba(234,179,8,0.5)',
            letterSpacing: '-1px',
          }}
        >
          +{amount} XP ⚡
        </motion.div>
      )}
    </AnimatePresence>
  )
}