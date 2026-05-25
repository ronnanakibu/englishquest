'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown' // IMPOR PARSER MARKDOWN

// ─── EDIT DATA DIRI LO DI SINI ───
const DEVELOPER = {
    name: 'Rony Imanuel Sihombing',
    nickname: 'Ronn',
    nim: '2505112097',
    prodi: 'Teknik Komputer (Computer Engineering)',
    jurusan: 'Teknik Komputer dan Informatika (Computer Engineering and Informatika)',
    kampus: 'Politeknik Negeri Medan (Medan State Polytechnic)',
    semester: '2',
    tahunMasuk: '2025',
    email: 'ronysihombing07@gmail.com',
    instagram: '@ronnlbtrn_',
    github: 'https://github.com/ronnanakibu',
    role: 'Student that dreaming to be a Fullstack Developer & UI Designer',
    bio: 'Mahasiswa Teknik Komputer Polmed yang passionate di bidang software engineering, UI/UX design, dan multimedia. EnglishQuest dibangun sebagai final project semester 2 dengan fokus pada gamifikasi (DuoLingo like) pembelajaran bahasa Inggris.',
    techStack: ['Next.js 15', 'Fastify', 'Prisma', 'MySQL', 'Framer Motion', 'TypeScript', 'Railway', 'Gemini AI'],
    avatar: '/rony.jpg', // ← taruh foto di apps/web/public/rony.jpg
}
// ─────────────────────────────────

interface Release {
    tag_name: string
    name: string
    published_at: string
    body: string
}

export default function DeveloperCard() {
    const [open, setOpen] = useState(false)
    const [releases, setReleases] = useState<Release[]>([])
    const [loadingChangelog, setLoadingChangelog] = useState(false)
    const [changelogFetched, setChangelogFetched] = useState(false)

    const fetchChangelog = async () => {
        if (changelogFetched) return
        setLoadingChangelog(true)
        try {
            const res = await fetch(
                'https://api.github.com/repos/ronnanakibu/englishquest/releases',
                { headers: { Accept: 'application/vnd.github.v3+json' } }
            )
            const data = await res.json()
            setReleases(Array.isArray(data) ? data : [])
            setChangelogFetched(true)
        } catch {
            setReleases([])
        } finally {
            setLoadingChangelog(false)
        }
    }

    const handleOpen = () => {
        setOpen(true)
        fetchChangelog()
    }

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                onClick={handleOpen}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '12px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                    }}>
                        👨‍💻
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '14px',
                            color: 'var(--text)',
                        }}>
                            The Developer
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {DEVELOPER.name}
                        </div>
                    </div>
                </div>
                <span style={{ color: 'var(--text-subtle)', fontSize: '18px' }}>→</span>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            padding: '0',
                        }}
                        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                width: '100%',
                                maxWidth: '640px',
                                maxHeight: '90vh',
                                background: 'var(--bg)',
                                borderRadius: '24px 24px 0 0',
                                overflow: 'auto',
                                paddingBottom: '32px',
                                scrollBehavior: 'smooth' // FIX: Membuat efek geser scroll lancar saat versi di-klik
                            }}
                        >
                            {/* Handle */}
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                                <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
                            </div>

                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                margin: '16px 16px 0',
                                borderRadius: '20px',
                                padding: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                    }}>
                                        <img
                                            src={DEVELOPER.avatar}
                                            alt={DEVELOPER.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none'
                                                    ; (e.target as HTMLImageElement).parentElement!.innerHTML = '👨‍💻'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white' }}>
                                            {DEVELOPER.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                                            {DEVELOPER.role}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                                            {DEVELOPER.kampus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '16px 16px 0' }}>

                                {/* Bio */}
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    border: '1px solid var(--border)',
                                }}>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                        {DEVELOPER.bio}
                                    </p>
                                </div>

                                {/* Academic Info */}
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--text)', marginBottom: '12px' }}>
                                        🎓 Informasi Akademik
                                    </div>
                                    {[
                                        { label: 'NIM', value: DEVELOPER.nim },
                                        { label: 'Program Studi', value: DEVELOPER.prodi },
                                        { label: 'Jurusan', value: DEVELOPER.jurusan },
                                        { label: 'Semester', value: DEVELOPER.semester },
                                        { label: 'Tahun Masuk', value: DEVELOPER.tahunMasuk },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>{label}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 700 }}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tech Stack */}
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--text)', marginBottom: '12px' }}>
                                        🛠️ Tech Stack
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {DEVELOPER.techStack.map(tech => (
                                            <span key={tech} style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: '#6366F1',
                                                background: '#EEF2FF',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontFamily: 'var(--font-display)',
                                            }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--text)', marginBottom: '12px' }}>
                                        📬 Kontak
                                    </div>
                                    {[
                                        { icon: '📧', label: 'Email', value: DEVELOPER.email, url: `mailto:${DEVELOPER.email}` },
                                        { icon: '📸', label: 'Instagram', value: DEVELOPER.instagram, url: `https://instagram.com/${DEVELOPER.instagram.replace('@', '')}` },
                                        { icon: '🐙', label: 'GitHub', value: `${DEVELOPER.github}`, url: `${DEVELOPER.github}` },
                                        { icon: '🔗', label: 'Link To This Project Repo', value: 'https://github.com/ronnanakibu/englishquest', url: 'https://github.com/ronnanakibu/englishquest' }
                                    ].map(({ icon, label, value, url }) => (
                                        <a
                                            key={label}
                                            href={url}
                                            target={label === 'Email' ? '_self' : '_blank'}
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            <span style={{ fontSize: '14px' }}>{icon}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600, width: '70px' }}>{label}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 700 }}>{value}</span>
                                        </a>
                                    ))}
                                </div>

                                {/* Changelog */}
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--text)', marginBottom: '12px' }}>
                                        📋 Changelog
                                    </div>

                                    {loadingChangelog && (
                                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            Loading changelog...
                                        </div>
                                    )}

                                    {!loadingChangelog && releases.length === 0 && changelogFetched && (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📭</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                Belum ada release di GitHub.
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                                                Buat release di GitHub untuk menampilkan changelog otomatis.
                                            </div>
                                        </div>
                                    )}

                                    {releases.map((release, i) => (
                                        <div
                                            key={i}
                                            id={`release-${release.tag_name}`} // PERBAIKAN: Memberi ID jangkar unik pada setiap blok versi rilis
                                            style={{
                                                borderLeft: '2px solid #6366F1',
                                                paddingLeft: '12px',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>

                                                {/* PERBAIKAN: Menambahkan elemen Anchor link & animasi hover pada tag versi */}
                                                <a href={`#release-${release.tag_name}`} style={{ textDecoration: 'none' }}>
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            fontSize: '11px',
                                                            fontWeight: 800,
                                                            color: '#6366F1',
                                                            background: '#EEF2FF',
                                                            padding: '2px 8px',
                                                            borderRadius: '6px',
                                                            display: 'inline-block',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {release.tag_name}
                                                    </motion.span>
                                                </a>

                                                <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                                                    {new Date(release.published_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                                                {release.name || release.tag_name}
                                            </div>

                                            {release.body && (
                                                // PERBAIKAN: Mengganti render teks mentah biasa dengan parser <ReactMarkdown> komplit
                                                <div className="prose dark:prose-invert max-w-none text-xs text-muted leading-relaxed">
                                                    <ReactMarkdown>{release.body}</ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}