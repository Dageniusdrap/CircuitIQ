"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function HeroBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
            {/* Animated Background Image - Ken Burns Effect */}
            <motion.div
                className="absolute inset-0 z-0 opacity-40"
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
                {mounted && [...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-blue-500 rounded-full"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.5 + 0.2,
                            scale: Math.random() * 0.5 + 0.5,
                        }}
                        animate={{
                            y: [null, Math.random() * -100 + "%"],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                        style={{
                            width: Math.random() * 4 + "px",
                            height: Math.random() * 4 + "px",
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
