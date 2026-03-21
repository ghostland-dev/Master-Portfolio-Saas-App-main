"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type HeroWaveCanvasProps = {
  className?: string
  /** `fill` = waves + soft gradient (no photo). `overlay` = waves only, for mix-blend on top of an image. */
  variant?: "fill" | "overlay"
}

/** Animated layered waves using theme --primary (HSL triplet from globals.css). */
export function HeroWaveCanvas({ className, variant = "fill" }: HeroWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let t = 0
    let cancelled = false

    const readPrimary = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()
      return raw || "158 64% 52%"
    }

    const resize = () => {
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      if (width < 1 || height < 1) return
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawFrame = () => {
      if (cancelled) return
      t += 0.018
      const primary = readPrimary()
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)

      if (variant === "fill") {
        const base = ctx.createLinearGradient(0, 0, 0, height)
        base.addColorStop(0, `hsl(${primary} / 0.12)`)
        base.addColorStop(0.45, `hsl(${primary} / 0.06)`)
        base.addColorStop(1, `hsl(${primary} / 0.18)`)
        ctx.fillStyle = base
        ctx.fillRect(0, 0, width, height)
      }

      const layers =
        variant === "overlay"
          ? [
              { alpha: 0.22, amp: 10, freq: 0.014, speed: 1, yBias: 0.58 },
              { alpha: 0.16, amp: 14, freq: 0.011, speed: 0.85, yBias: 0.62 },
              { alpha: 0.1, amp: 8, freq: 0.019, speed: 1.15, yBias: 0.66 },
            ]
          : [
              { alpha: 0.38, amp: 12, freq: 0.014, speed: 1, yBias: 0.56 },
              { alpha: 0.28, amp: 16, freq: 0.011, speed: 0.85, yBias: 0.6 },
              { alpha: 0.18, amp: 10, freq: 0.019, speed: 1.15, yBias: 0.65 },
            ]

      for (let i = 0; i < layers.length; i++) {
        const L = layers[i]!
        const baseY = height * L.yBias
        ctx.beginPath()
        ctx.moveTo(0, height)
        for (let x = 0; x <= width + 4; x += 2) {
          const wave1 = Math.sin(x * L.freq + t * L.speed) * L.amp
          const wave2 = Math.sin(x * L.freq * 0.55 + t * L.speed * 1.4 + i) * (L.amp * 0.45)
          const wave3 = Math.cos(x * L.freq * 0.28 - t * 0.6 + i * 1.7) * (L.amp * 0.25)
          ctx.lineTo(x, baseY + wave1 + wave2 + wave3)
        }
        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fillStyle = `hsl(${primary} / ${L.alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(drawFrame)
    }

    resize()
    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)
    raf = requestAnimationFrame(drawFrame)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-none",
        variant === "overlay"
          ? "z-10 mix-blend-overlay opacity-[0.92] dark:opacity-[0.88]"
          : "z-0",
        className,
      )}
      aria-hidden
    />
  )
}
