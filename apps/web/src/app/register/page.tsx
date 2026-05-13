'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import { t } from '@/lib/i18n'
import Navbar from '@/components/Navbar'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuthStore()
  const { lang } = useLangStore()
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(form.email, form.username, form.password)
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.error || t(lang, 'registerFailed'))
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar variant="landing" />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '24px',
      }}>
        <motion.div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.5px',
            }}>
              {t(lang, 'createAccount')}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              {t(lang, 'registerSubtitle')}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'var(--red-light)',
                border: '1px solid var(--red)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                color: 'var(--red)',
                fontWeight: 600,
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: t(lang, 'email'), key: 'email', type: 'email', placeholder: 'email@example.com' },
              { label: t(lang, 'username'), key: 'username', type: 'text', placeholder: lang === 'id' ? 'username kamu' : 'your username' },
              { label: t(lang, 'password'), key: 'password', type: 'password', placeholder: lang === 'id' ? 'minimal 8 karakter' : 'min 8 characters' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-display)',
                }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: isLoading ? 'var(--bg-subtle)' : 'var(--green)',
                color: isLoading ? 'var(--text-muted)' : 'white',
                fontWeight: 800,
                fontSize: '15px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)',
                marginTop: '4px',
                boxShadow: isLoading ? 'none' : 'var(--shadow-green)',
                letterSpacing: '-0.2px',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '⏳ Loading...' : t(lang, 'registerBtn')}
            </motion.button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginTop: '24px',
          }}>
            {t(lang, 'hasAccount')}{' '}
            <Link href="/login" style={{
              color: 'var(--green)',
              fontWeight: 800,
              textDecoration: 'none',
            }}>
              {t(lang, 'loginLink')}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}