"use client"

import { useEffect, useRef } from "react"

interface MagicRaysBackgroundProps {
  baseColor?: string
  rayColor?: string
  rayCount?: number
  speed?: number
  className?: string
}

export default function MagicRaysBackground({
  baseColor = "rgba(128, 0, 255, 0.2)",
  rayColor = "rgba(255, 255, 255)",
  rayCount = 12,
  speed = 10,
  className = "",
}: MagicRaysBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Create rays
    const rays: Array<{
      angle: number
      width: number
      speed: number
      opacity: number
    }> = []

    for (let i = 0; i < rayCount; i++) {
      rays.push({
        angle: (Math.PI * 2 * i) / rayCount,
        width: Math.random() * 30 + 20,
        speed: (Math.random() * 0.5 + 0.5) * speed * 0.001,
        opacity: Math.random() * 0.3 + 0.2,
      })
    }

    // Animation loop
    let animationFrameId: number
    let time = 0

    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw base gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, baseColor)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw rays
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.max(canvas.width, canvas.height)

      rays.forEach((ray, i) => {
        const currentAngle = ray.angle + time * ray.speed

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(currentAngle)

        const grd = ctx.createLinearGradient(0, 0, maxRadius, 0)
        // Extraire les composants RGB de la couleur
        const rgbMatch = rayColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch
          grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${ray.opacity})`)
        } else {
          grd.addColorStop(0, rayColor) // Fallback au cas où
        }

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(maxRadius, -ray.width / 2)
        ctx.lineTo(maxRadius, ray.width / 2)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [baseColor, rayColor, rayCount, speed])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />
}
