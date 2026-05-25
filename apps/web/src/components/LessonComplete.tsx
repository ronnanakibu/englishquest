"use client"; // Wajib jika menggunakan Next.js App Router

import { useEffect, useState } from "react";
import { triggerConfetti } from "@/lib/confetti";
import api from "@/lib/api";

interface ResultScreenProps {
  score: number;
  maxScore: number;
  lessonId: string; // Menambahkan properti baru untuk mendeteksi ID kelas saat ini
}

export default function ResultScreen({ score, maxScore, lessonId }: ResultScreenProps) {
  const [questMessage, setQuestMessage] = useState<string | null>(null);
  const [bonusXp, setBonusXp] = useState<number | null>(null);

  useEffect(() => {
    // 1. Trigger konfeti jika skornya memuaskan (100%)
    if (score === maxScore) {
      triggerConfetti();
    }

    // 2. Logika Otomatisasi Validasi & Klaim Daily Quest
    const handleDailyQuestCheck = async () => {
      try {
        // PERBAIKAN: Menggunakan rute lengkap dengan prefix /api/v1
        const { data: todayQuest } = await api.get("/api/v1/quests/today");

        // Cek apakah kelas ini adalah misi hari ini dan statusnya belum diselesaikan
        if (todayQuest && todayQuest.lessonId === lessonId && !todayQuest.isCompleted) {
          console.log("Misi harian terdeteksi cocok! Melakukan proses klaim...");

          // Tembak endpoint POST /claim di backend dengan prefix /api/v1
          const { data: claimResponse } = await api.post("/api/v1/quests/claim", {
            challengeId: todayQuest.id
          });

          if (claimResponse.success) {
            setBonusXp(claimResponse.xpBonus);
            setQuestMessage("🎉 Daily Quest Completed! Bonus XP added successfully.");
            triggerConfetti(); // Berikan selebrasi konfeti tambahan karena berhasil menyelesaikan misi harian
          }
        }
      } catch (error: any) {
        console.error("Gagal memproses validasi klaim misi harian:", error?.response?.data || error.message);
      }
    };

    handleDailyQuestCheck();
  }, [score, maxScore, lessonId]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-3xl font-bold text-green-500 mb-4">
        {score === maxScore ? "Perfect!" : "Good Job!"}
      </h2>
      <p className="text-xl dark:text-gray-200 mb-6">
        You scored {score} out of {maxScore}
      </p>

      {/* Tampilan Visual Tambahan jika Misi Harian Berhasil Di-Klaim */}
      {questMessage && (
        <div className="animate-bounce bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 rounded-xl p-4 mb-6 max-w-md">
          <p className="text-amber-800 dark:text-amber-200 font-bold text-sm">
            {questMessage}
          </p>
          {bonusXp && (
            <span className="inline-block mt-1 text-xs bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full">
              +{bonusXp} BONUS XP
            </span>
          )}
        </div>
      )}

      {/* Tambahkan tombol Continue / Next Lesson di sini */}
    </div>
  );
}