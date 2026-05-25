"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

interface QuestData {
    id: string
    type: string
    targetCount: number
    currentCount: number
    xpBonus: number
    isCompleted: boolean
}

export default function DailyQuestCard() {
    const [quest, setQuest] = useState<QuestData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isClaiming, setIsClaiming] = useState(false)

    const fetchTodayQuest = async () => {
        try {
            const { data } = await api.get("/api/v1/quests/today")
            setQuest(data)
        } catch (error) {
            console.error("Gagal mengambil data misi harian:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTodayQuest()
    }, [])

    const handleClaimReward = async () => {
        if (!quest || isClaiming) return
        setIsClaiming(true)
        try {
            const { data } = await api.post("/api/v1/quests/claim", {
                challengeId: quest.id
            })
            if (data.success) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
                setQuest({ ...quest, isCompleted: true })
            }
        } catch (error) {
            console.error("Gagal mengklaim hadiah:", error)
        } finally {
            setIsClaiming(false)
        }
    }

    // Helper untuk generate deskripsi dinamis berdasarkan tipe misi dari backend
    const getQuestDescription = (type: string, target: number) => {
        switch (type) {
            case 'COMPLETE_LESSONS':
                return `Complete any ${target} lessons today to earn bonus rewards.`
            case 'EARN_XP':
                return `Earn at least ${target} XP from your learning activities today.`
            case 'PERFECT_SCORE':
                return `Finish ${target} lesson with a perfect score (100% correct answers).`
            case 'ANSWER_QUESTIONS':
                return `Answer ${target} quiz questions correctly throughout today.`
            case 'VOCAB_REVIEW':
                return `Review or practice at least ${target} vocabulary words today.`
            default:
                return `Complete today's special training routine to stay ahead.`
        }
    }

    if (loading) {
        return (
            <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', opacity: 0.6 }} className="animate-pulse">
                Loading today's special quest...
            </div>
        )
    }

    if (!quest) return null

    const progressPercent = Math.min((quest.currentCount / quest.targetCount) * 100, 100)
    const isTargetReached = quest.currentCount >= quest.targetCount

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: quest.isCompleted
                    ? 'var(--bg-card)'
                    : 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.03) 100%)',
                border: quest.isCompleted ? '1px solid var(--border)' : '1.5px solid #a855f7',
                borderRadius: '20px',
                padding: '18px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)'
            }}
        >
            {/* FIXED: 'justifyContext' diganti menjadi 'justifyContent' sesuai standar CSS TypeScript */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <span style={{ fontSize: '26px' }}>{quest.isCompleted ? '💎' : '⚔️'}</span>
                    <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--text)', margin: '0 0 2px 0' }}>
                            {quest.isCompleted ? 'Daily Quest Claimed!' : 'Daily Training Quest'}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
                            {quest.isCompleted
                                ? 'Great job keeping up with your daily routine!'
                                : getQuestDescription(quest.type, quest.targetCount)}
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                        background: quest.isCompleted ? 'var(--border)' : '#a855f7',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                    }}>
                        +{quest.xpBonus} XP
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <div style={{ flex: 1, background: 'var(--bg-subtle)', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                        borderRadius: '99px',
                        transition: 'width 0.4s ease-out'
                    }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: isTargetReached ? '#22c55e' : 'var(--text-subtle)', minWidth: '45px', textAlign: 'right' }}>
                    {quest.currentCount}/{quest.targetCount} {quest.type === 'EARN_XP' ? 'XP' : ''}
                </span>
            </div>

            {/* Tombol Klaim */}
            {isTargetReached && !quest.isCompleted && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClaimReward}
                    disabled={isClaiming}
                    style={{
                        marginTop: '14px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '13px',
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                    }}
                >
                    {isClaiming ? "Claiming..." : "🎁 Claim Daily Reward!"}
                </motion.button>
            )}
        </motion.div>
    )
}