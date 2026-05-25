'use client'

import DeveloperSection from '@/components/DeveloperSection'
import AsciiBackground from '@/components/AsciiBackground' // Impor komponen ASCII matrix
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useLangStore } from '@/stores/langStore'
import { t } from '@/lib/i18n'
import { useAuthStore } from '@/stores/authStore'

export default function LandingPage() {
  const { lang } = useLangStore()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>

      {/* 🚀 MATRIKS INTERAKTIF BERJALAN DI LATAR BELAKANG */}
      <AsciiBackground />

      {/* Pembungkus Konten Utama dengan zIndex agar berada di atas lapisan Canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar variant="landing" />

        {/* Hero Section */}
        <section style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              style={{ fontSize: '72px', marginBottom: '24px', display: 'inline-block' }}
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              🎯
            </motion.div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: '16px',
              letterSpacing: '-1.5px',
            }}>
              {t(lang, 'tagline')}<br />
              <span style={{ color: 'var(--green)' }}>{t(lang, 'taglineAccent')}</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'var(--text-muted)',
              marginBottom: '40px',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto 40px',
            }}>
              {t(lang, 'taglineDesc')}
            </p>

            {/* ── 👥 PERBAIKAN: BARIS TOMBOL GANDA BERDAMPINGAN SECARA FLEXIBEL ── */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Link href="/register">
                <motion.button
                  style={{
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 40px',
                    borderRadius: '14px',
                    fontSize: '17px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    boxShadow: 'var(--shadow-green)',
                    letterSpacing: '-0.3px',
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t(lang, 'startFree')}
                </motion.button>
              </Link>

              {/* TOMBOL MEET THE CREATOR DENGAN EMOTION SMOOTH SCROLL */}
              <motion.button
                onClick={() => {
                  const target = document.getElementById('developer-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text)',
                  border: '1.5px solid var(--border)',
                  padding: '16px 36px',
                  borderRadius: '14px',
                  fontSize: '17px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  boxShadow: 'var(--shadow-sm)',
                  letterSpacing: '-0.3px',
                }}
                whileHover={{ scale: 1.04, y: -2, background: 'var(--bg-subtle)' }}
                whileTap={{ scale: 0.97 }}
              >
                👨‍💻 {lang === 'id' ? 'Meet the Creator' : 'Meet the Creator'}
              </motion.button>
            </div>

            <p style={{
              marginTop: '16px',
              fontSize: '13px',
              color: 'var(--text-subtle)',
              fontWeight: 600,
            }}>
              {t(lang, 'freeForever')}
            </p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 24px 60px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {[
              { icon: '🔥', title: t(lang, 'dailyStreak'), desc: t(lang, 'dailyStreakDesc'), accent: 'var(--orange)', bg: 'var(--orange-light)' },
              { icon: '⚡', title: t(lang, 'xpLevel'), desc: t(lang, 'xpLevelDesc'), accent: 'var(--yellow)', bg: 'var(--yellow-light)' },
              { icon: '🏆', title: t(lang, 'achievement'), desc: t(lang, 'achievementDesc'), accent: '#8B5CF6', bg: '#F5F3FF' },
            ].map((f, i) => (
              <motion.div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: f.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '8px',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '0 24px 40px', maxWidth: '700px', margin: '0 auto' }}>
          <motion.div
            style={{
              background: 'var(--green)',
              borderRadius: '24px',
              padding: '48px 40px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-green)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}>
              {t(lang, 'readyToLearn')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: '15px' }}>
              {t(lang, 'joinDesc')}
            </p>
            <Link href="/register">
              <button style={{
                background: 'white',
                color: 'var(--green-dark)',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}>
                {t(lang, 'registerNow')}
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Megah embedded section creator */}
        <DeveloperSection />
      </div>
    </main>
  )
}