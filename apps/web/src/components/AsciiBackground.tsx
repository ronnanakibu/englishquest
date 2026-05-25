"use client"

import { useEffect, useRef } from "react"

export default function AsciiBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)

        // Karakter khas anak Computer Engineering & Coding
        const chars = ["0", "1", "{", "}", "[", "]", ";", "<", ">", "/", "+", "-", "X", "Y", "C", "E"]
        const particles: Array<{
            x: number
            y: number
            char: string
            fontSize: number
            speedX: number
            speedY: number
            opacity: number
            targetOpacity: number
        }> = []

        // Kerapatan partikel adaptif berbasis resolusi layar monitor
        const particleCount = Math.floor((width * height) / 14000)
        for (let i = 0; i < particleCount; i++) {
            const defaultOpacity = Math.random() * 0.12 + 0.03
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                char: chars[Math.floor(Math.random() * chars.length)],
                fontSize: Math.floor(Math.random() * 8) + 11, // Ukuran font acak antara 11px - 19px
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: defaultOpacity,
                targetOpacity: defaultOpacity
            })
        }

        // Koordinat kursor radar mouse
        const mouse = { x: -1000, y: -1000, radius: 130 }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        const handleMouseLeave = () => {
            mouse.x = -1000
            mouse.y = -1000
        }

        const handleResize = () => {
            if (!canvas) return
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseleave", handleMouseLeave)
        window.addEventListener("resize", handleResize)

        // Loop Animasi Canvas Utama
        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            particles.forEach((p) => {
                // Gerakan alami melayang
                p.x += p.speedX
                p.y += p.speedY

                // Kondisi jika menabrak dinding layar, muncul kembali dari sisi berlawanan
                if (p.x < -20) p.x = width + 20
                if (p.x > width + 20) p.x = -20
                if (p.y < -20) p.y = height + 20
                if (p.y > height + 20) p.y = -20

                // Rumus Matematika Jarak Fisika Antigravity (Pendorongan Kursor)
                const dx = mouse.x - p.x
                const dy = mouse.y - p.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < mouse.radius) {
                    // Efek Antigravitasi: Dorong partikel menjauh dari koordinat kursor mouse
                    const force = (mouse.radius - distance) / mouse.radius
                    const angle = Math.atan2(dy, dx)

                    p.x -= Math.cos(angle) * force * 3
                    p.y -= Math.sin(angle) * force * 3

                    // Nyalakan warna gradasi indigo cerah saat berinteraksi dekat mouse
                    p.opacity = Math.min(p.opacity + 0.04, 0.45)
                    ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
                } else {
                    // Kembalikan ke opasitas redup semula secara perlahan saat mouse menjauh
                    if (p.opacity > p.targetOpacity) {
                        p.opacity -= 0.005
                    }
                    ctx.fillStyle = `rgba(156, 163, 175, ${p.opacity})`
                }

                ctx.font = `bold ${p.fontSize}px monospace`
                ctx.fillText(p.char, p.x, p.y)
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        // Bersihkan event listener saat komponen unmount
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseleave", handleMouseLeave)
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none", // Supaya tidak menghalangi klik button/link di atasnya
                zIndex: 0,
                opacity: 0.85
            }}
        />
    )
}