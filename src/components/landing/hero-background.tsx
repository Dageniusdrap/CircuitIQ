"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
    id: number
    initialX: number
    initialY: number
    initialOpacity: number
    initialScale: number
    targetY: number
    duration: number
    delay: number
    size: number
}

export function HeroBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [mounted, setMounted] = useState(false)
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            })
        }

        const newParticles = [...Array(20)].map((_, i) => ({
            id: i,
            initialX: Math.random() * 100,
            initialY: Math.random() * 100,
            initialOpacity: Math.random() * 0.5 + 0.2,
            initialScale: Math.random() * 0.5 + 0.5,
            targetY: Math.random() * -100,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            size: Math.random() * 4
        }))
        setParticles(newParticles)

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
            {/* Animated Background Image - Ken Burns Effect */}
            <motion.div
                className="absolute inset-0 z-0 opacity-55"
                initial={{ scale: 1 }}
                animate={{
                    scale: 1.1,
                    x: mousePosition.x * -20, // Subtle parallax
                    y: mousePosition.y * -20
                }}
                transition={{
                    scale: { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    x: { type: "spring", stiffness: 50, damping: 20 },
                    y: { type: "spring", stiffness: 50, damping: 20 }
                }}
                style={{
                    backgroundImage: 'url("/images/hero-bg.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Digital Grid Overlay */}
            <div
                className="absolute inset-0 z-10 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                    maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)"
                }}
            />

            {/* Animated Particles/Sparks */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {mounted && particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute bg-blue-500 rounded-full"
                        initial={{
                            x: p.initialX + "%",
                            y: p.initialY + "%",
                            opacity: p.initialOpacity,
                            scale: p.initialScale,
                        }}
                        animate={{
                            y: [null, p.targetY + "%"],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay,
                        }}
                        style={{
                            width: p.size + "px",
                            height: p.size + "px",
                        }}
                    />
                ))}
            </div>

            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 z-30 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
        </div>
    )
}
