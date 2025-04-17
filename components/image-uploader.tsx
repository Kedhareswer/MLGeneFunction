"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card
      className={`border-2 transition-colors ${isDragging ? "border-dashed border-primary" : "border-dashed border-muted-foreground/25"}`}
    >
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center space-y-4 py-12"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="region"
          aria-label="Image upload area"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleButtonClick()
            }
          }}
        >
          <div className="rounded-full bg-muted p-6 animate-fade-in">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-medium">Upload an image</h3>
            <p className="text-sm text-muted-foreground">Drag and drop an image, or click to browse</p>
          </div>
          <Button
            onClick={handleButtonClick}
            className="relative animate-slide-in group"
            style={{ animationDelay: "0.2s" }}
            aria-label="Select an image to upload"
          >
            <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Select Image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
              aria-hidden="true"
            />
          </Button>
          <p className="text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Supported formats: JPEG, PNG, GIF, WebP
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
