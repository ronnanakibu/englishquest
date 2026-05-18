// lib/confetti.ts
import confetti from "canvas-confetti";

export const triggerConfetti = () => {
  // Durasi konfeti (dalam milidetik)
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    // Tembakan dari kiri
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#22c55e", "#eab308", "#3b82f6"], // Menggunakan warna dari Tailwind (hijau, kuning, biru)
    });
    // Tembakan dari kanan
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#22c55e", "#eab308", "#3b82f6"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};