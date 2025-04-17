"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface ProgressIndicatorProps {
  isProcessing: boolean
  onComplete?: () => void
}

export function ProgressIndicator({ isProcessing, onComplete }: ProgressIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Simulate progress that slows down as it approaches 100%
        const increment = Math.max(1, 10 * (1 - prev / 100))
        const newProgress = Math.min(99, prev + increment)

        if (newProgress >= 99) {
          clearInterval(interval)
          // Wait a moment before calling onComplete to show 100%
          setTimeout(() => {
            setProgress(100)
            if (onComplete) onComplete()
          }, 500)
        }

        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isProcessing, onComplete])

  if (!isProcessing && progress === 0) return null

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2" aria-label={`Processing: ${Math.round(progress)}%`} />
      <p className="text-xs text-center text-muted-foreground">
        {progress < 100 ? `Processing: ${Math.round(progress)}%` : "Complete!"}
      </p>
    </div>
  )
}
