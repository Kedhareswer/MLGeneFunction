"use client"
import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the AnimatedSketchExporter to enable lazy loading
const AnimatedSketchExporter = dynamic(
  () => import("@/components/AnimatedSketchExporter").then(mod => mod.AnimatedSketchExporter),
  { ssr: false, loading: () => <span>Preparing GIF tool…</span> }
)

interface AnimatedSketchButtonProps {
  image: string | null
  settings: any
}

export const AnimatedSketchButton = ({ image, settings }: AnimatedSketchButtonProps) => {
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([])
  const [showExporter, setShowExporter] = useState(false)
  const [generating, setGenerating] = useState(false)

  const generateFrames = async () => {
    if (!image) return
    setGenerating(true)
    setFrames([])
    const steps = 20
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const width = img.width
      const height = img.height
      const newFrames: HTMLCanvasElement[] = []
      for (let i = 1; i <= steps; i++) {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) continue
        ctx.drawImage(img, 0, 0)
        // Interpolate settings for progressive effect
        const partialSettings = {
          ...settings,
          detail: Math.round((settings.detail || 50) * (i / steps)),
          lineStrength: Math.round((settings.lineStrength || 50) * (i / steps)),
          shading: Math.round((settings.shading || 30) * (i / steps)),
        }
        // @ts-ignore
        if (window.applySketchEffect) {
          // @ts-ignore
          window.applySketchEffect(ctx, width, height, partialSettings)
        }
        newFrames.push(canvas)
      }
      setFrames(newFrames)
      setGenerating(false)
      setShowExporter(true)
    }
    img.src = image
  }

  return (
    <div style={{ marginTop: 24 }}>
      {!showExporter ? (
        <button onClick={generateFrames} disabled={!image || generating}>
          {generating ? "Generating Frames…" : "Create Animated Sketch GIF"}
        </button>
      ) : (
        <AnimatedSketchExporter frames={frames} width={frames[0]?.width || 256} height={frames[0]?.height || 256} />
      )}
    </div>
  )
}
