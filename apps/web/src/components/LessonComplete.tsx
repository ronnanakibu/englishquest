"use client"; // Wajib jika menggunakan Next.js App Router

import { useEffect } from "react";
import { triggerConfetti } from "@/lib/confetti";

interface ResultScreenProps {
  score: number;
  maxScore: number;
}

export default function ResultScreen({ score, maxScore }: ResultScreenProps) {
  useEffect(() => {
    // Hanya trigger konfeti jika skornya memuaskan (misal 100%)
    if (score === maxScore) {
      triggerConfetti();
    }
  }, [score, maxScore]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-3xl font-bold text-green-500 mb-4">
        {score === maxScore ? "Perfect!" : "Good Job!"}
      </h2>
      <p className="text-xl dark:text-gray-200">
        You scored {score} out of {maxScore}
      </p>
      {/* Tambahkan tombol Continue / Next Lesson di sini */}
    </div>
  );
}