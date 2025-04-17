"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface ImageComparisonProps {
  originalImage: string
  sketchImage: string
}

export function ImageComparison({ originalImage, sketchImage }: ImageComparisonProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSliderChange = (value: number[]) => {
    setPosition(value[0])
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const newPosition = (x / rect.width) * 100

    setPosition(newPosition)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [])

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-2 font-medium text-center">Compare Original & Sketch</h3>

        <div
          ref={containerRef}
          className="relative h-[300px] overflow-hidden rounded-md cursor-col-resize"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute inset-0 w-full h-full">
            <img
              src={sketchImage || "/placeholder.svg"}
              alt="Sketch"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ width: `${position}%` }}>
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Original"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${100 / (position / 100)}%` }}
            />
          </div>

          <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Slider
            value={[position]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSliderChange}
            aria-label="Image comparison slider"
          />
        </div>
      </CardContent>
    </Card>
  )
}
