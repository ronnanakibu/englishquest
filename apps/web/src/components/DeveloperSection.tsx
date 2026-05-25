'use client'

import { motion } from 'framer-motion'

const DEVELOPER = {
    name: 'Rony Imanuel Sihombing',
    nickname: 'Ronn',
    nim: '2505112097',
    prodi: 'Teknik Komputer (Computer Engineering)',
    jurusan: 'Teknik Komputer dan Informatika (Computer Engineering and Informatics)',
    kampus: 'Politeknik Negeri Medan (Medan State Polytechnic)',
    semester: '2',
    tahunMasuk: '2025',
    email: 'ronysihombing07@gmail.com',
    instagram: '@ronnlbtrn_',
    github: 'https://github.com/ronnanakibu',
    role: 'Student that dreaming to be a Fullstack Developer & UI Designer',
    bio: 'Mahasiswa Teknik Komputer Polmed yang passionate di bidang software engineering, UI/UX design, dan multimedia. EnglishQuest dibangun sebagai final project semester 2 dengan fokus pada gamifikasi (DuoLingo like) pembelajaran bahasa Inggris.',
    techStack: ['Next.js 15', 'Fastify', 'Prisma', 'MySQL', 'Framer Motion', 'TypeScript', 'Railway', 'Gemini AI'],
    avatar: '/rony.jpg', // apps/web/public/rony.jpg
}

export default function DeveloperSection() {
    return (
        <section id="developer-section"
            style={{
                width: '100%',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                padding: '80px 24px',
                marginTop: '60px',
                position: 'relative',
                zIndex: 1
            }}>

            {/* ─── 📱 INJEKSI MEDIA QUERY NATIVE (ANTI HYDRATION BUG) ─── */}
            <style>{`
                .eq-creator-grid {
                    display: grid;
                    grid-template-columns: 1fr; /* Default HP: 1 Kolom Tumpuk */
                    gap: 40px;
                    align-items: start;
                }
                .eq-academic-subgrid {
                    display: grid;
                    grid-template-columns: 1fr; /* Default HP: Detail akademik tumpuk biar ga sempit */
                    gap: 16px;
                }
                
                /* Tampilan Desktop / Tablet Lebar */
                @media (min-width: 768px) {
                    .eq-creator-grid {
                        grid-template-columns: 1fr 1.5fr; /* Laptop kembali ke rasio ideal Ronn */
                    }
                    .eq-academic-subgrid {
                        grid-template-columns: 1fr 1fr; /* Detail akademik jadi 2 kolom sejajar */
                        gap: 12px 24px;
                    }
                }
            `}</style>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Judul Section Utama */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#6366F1',
                        background: '#EEF2FF',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        Meet The Creator
                    </span>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '28px',
                        color: 'var(--text)',
                        marginTop: '12px',
                        letterSpacing: '-0.5px'
                    }}>
                        Behind the Project ⚔️
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '500px', margin: '4px auto 0' }}>
                        Mengenal lebih dekat pengembang di balik pembuatan aplikasi gamifikasi EnglishQuest.
                    </p>
                </div>

                {/* Grid Layout Utama dengan Class Hook Responsif */}
                <div className="eq-creator-grid">

                    {/* KOLOM KIRI: Profil Utama & Kontak */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'var(--bg)',
                            border: '1.5px solid var(--border)',
                            borderRadius: '24px',
                            padding: '32px 24px',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        {/* Foto Profil dengan Bingkai Gradient */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
                            padding: '3px',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                            overflow: 'hidden'
                        }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-card)' }}>
                                <img
                                    src={DEVELOPER.avatar}
                                    alt={DEVELOPER.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size: 48px; line-height: 114px;">👨‍💻</span>'
                                    }}
                                />
                            </div>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--text)', margin: '0 0 4px 0' }}>
                            {DEVELOPER.name}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6366F1', fontWeight: 700, margin: '0 0 16px 0' }}>
                            {DEVELOPER.role}
                        </p>

                        <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />

                        {/* Social Media Link Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                            {[
                                { icon: '📧', label: 'Email', value: DEVELOPER.email, url: `mailto:${DEVELOPER.email}` },
                                { icon: '📸', label: 'Instagram', value: DEVELOPER.instagram, url: `https://instagram.com/${DEVELOPER.instagram.replace('@', '')}` },
                                { icon: '🐙', label: 'GitHub Profile', value: 'ronnanakibu', url: DEVELOPER.github },
                            ].map(({ icon, label, value, url }) => (
                                <a
                                    key={label}
                                    href={url}
                                    target={label === 'Email' ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', cursor: 'pointer' }}
                                >
                                    <span style={{ fontSize: '18px' }}>{icon}</span>
                                    <div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-subtle)', fontWeight: 700, letterSpacing: '0.3px' }}>{label.toUpperCase()}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text)', ...((label === 'GitHub Profile' || label === 'Email') && { wordBreak: 'break-all' }), fontWeight: 600 }}>{value}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* KOLOM KANAN: Bio, Akademik, Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        {/* Blok Cerita Singkat / Bio */}
                        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--text)', marginBottom: '8px' }}>
                                📝 Tentang Pengembangan Project
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                {DEVELOPER.bio}
                            </p>
                        </div>

                        {/* Blok Detail Informasi Kuliah */}
                        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--text)', marginBottom: '14px' }}>
                                🎓 Identitas Akademik Polmed
                            </div>

                            {/* Menggunakan Class Hook Subgrid Responsif */}
                            <div className="eq-academic-subgrid">
                                {[
                                    { label: 'NIM', value: DEVELOPER.nim },
                                    { label: 'Semester / Angkatan', value: `${DEVELOPER.semester} / ${DEVELOPER.tahunMasuk}` },
                                    { label: 'Program Studi', value: DEVELOPER.prodi },
                                    { label: 'Institusi Kampus', value: DEVELOPER.kampus },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 700 }}>{label}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 700, marginTop: '2px', lineHeight: 1.4 }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Blok Tech Stack */}
                        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--text)', marginBottom: '12px' }}>
                                🛠️ Arsitektur & Teknologi Sistem
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {DEVELOPER.techStack.map(tech => (
                                    <span key={tech} style={{
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        color: '#6366F1',
                                        background: '#EEF2FF',
                                        border: '1px solid rgba(99, 102, 241, 0.15)',
                                        padding: '5px 12px',
                                        borderRadius: '10px',
                                        fontFamily: 'var(--font-display)',
                                    }}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    )
}