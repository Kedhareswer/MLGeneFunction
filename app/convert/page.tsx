"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/image-uploader"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { Download, RefreshCw, Share2 } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"
import { useToast } from "@/hooks/use-toast"
import { ProgressIndicator } from "@/components/progress-indicator"
import { ImageComparison } from "@/components/image-comparison"

export default function ConvertPage() {
  const [image, setImage] = useState<string | null>(null)
  const [sketch, setSketch] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    style: "pencil",
    lineStrength: 50,
    detail: 50,
    shading: 30,
  })
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setSketch(null)
  }

  const handleProcessImage = async () => {
    if (!image) return

    setIsProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Process the image (in a real app, this would call an API)
    const processedSketch = await simulateImageProcessing(image, settings)

    setSketch(processedSketch)
    setIsProcessing(false)
  }

  const handleSettingChange = (key: string, value: number | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    // If we already have a sketch, update it when settings change
    if (sketch && image) {
      setIsProcessing(true)

      // Simulate processing delay
      setTimeout(async () => {
        const processedSketch = await simulateImageProcessing(image, {
          ...settings,
          [key]: value,
        })

        setSketch(processedSketch)
        setIsProcessing(false)
      }, 1000)
    }
  }

  const handleDownload = () => {
    if (!sketch) return

    const link = document.createElement("a")
    link.href = sketch
    link.download = "sketch.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setImage(null)
    setSketch(null)
    setSettings({
      style: "pencil",
      lineStrength: 50,
      detail: 50,
      shading: 30,
    })
  }

  const handleShare = () => {
    if (!sketch) return
    setIsSharing(true)
  }

  const handleCopyLink = async () => {
    if (!sketch) return

    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard.",
        variant: "destructive",
      })
    }
  }

  const toggleComparisonMode = () => {
    setComparisonMode((prev) => !prev)
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Image to Sketch Converter</h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Upload an image and convert it into a beautiful hand-drawn sketch using our deep learning model.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {!image ? (
              <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
              <div className="space-y-6">
                {image && !sketch && (
                  <div className="mb-4 animate-fade-in">
                    <ProgressIndicator isProcessing={isProcessing} />
                  </div>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="p-4">
                      <div className="aspect-square overflow-hidden rounded-md">
                        <img src={image || "/placeholder.svg"} alt="Original" className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-2 text-center font-medium">Original Image</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="aspect-square overflow-hidden rounded-md bg-muted/30">
                        {isProcessing ? (
                          <SkeletonLoader />
                        ) : sketch ? (
                          <img
                            src={sketch || "/placeholder.svg"}
                            alt="Sketch"
                            className="h-full w-full object-cover animate-fade-in"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <p className="text-center text-muted-foreground">
                              Click "Generate Sketch" to process your image
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-center font-medium">{isProcessing ? "Processing..." : "Sketch Output"}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!sketch && !isProcessing && <Button onClick={handleProcessImage}>Generate Sketch</Button>}

                  {sketch && (
                    <>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Sketch
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="outline" onClick={toggleComparisonMode}>
                        {comparisonMode ? "Exit Comparison" : "Compare Images"}
                      </Button>
                    </>
                  )}

                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>

          {comparisonMode && image && sketch && (
            <div className="mt-6 animate-fade-in">
              <ImageComparison originalImage={image} sketchImage={sketch} />
            </div>
          )}

          {isSharing && sketch && (
            <Card className="mt-4 animate-fade-in">
              <CardContent className="p-4">
                <h3 className="mb-4 font-medium">Share Your Sketch</h3>
                <ShareButtons imageUrl={sketch} onCopyLink={handleCopyLink} onClose={() => setIsSharing(false)} />
              </CardContent>
            </Card>
          )}

          <div>
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4 font-medium">Sketch Settings</h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="style">Sketch Style</Label>
                    <Tabs
                      defaultValue="pencil"
                      value={settings.style}
                      onValueChange={(value) => handleSettingChange("style", value)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pencil">Pencil</TabsTrigger>
                        <TabsTrigger value="charcoal">Charcoal</TabsTrigger>
                        <TabsTrigger value="detailed">Detailed</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lineStrength">Line Strength</Label>
                      <span className="text-sm text-muted-foreground">{settings.lineStrength}%</span>
                    </div>
                    <Slider
                      id="lineStrength"
                      min={1}
                      max={100}
                      step={1}
                      value={[settings.lineStrength]}
                      onValueChange={(value) => handleSettingChange("lineStrength", value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="detail">Detail Level</Label>
                      <span className="text-sm text-muted-foreground">{settings.detail}%</span>
                    </div>
                    <Slider
                      id="detail"
                      min={1}
                      max={100}
                      step={1}
                      value={[settings.detail]}
                      onValueChange={(value) => handleSettingChange("detail", value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="shading">Shading Intensity</Label>
                      <span className="text-sm text-muted-foreground">{settings.shading}%</span>
                    </div>
                    <Slider
                      id="shading"
                      min={0}
                      max={100}
                      step={1}
                      value={[settings.shading]}
                      onValueChange={(value) => handleSettingChange("shading", value[0])}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simulate image processing function
async function simulateImageProcessing(
  imageDataUrl: string,
  settings: {
    style: string
    lineStrength: number
    detail: number
    shading: number
  },
) {
  // In a real application, this would call a backend API
  // For demo purposes, we're just applying a simple filter to the image

  return new Promise<string>((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        resolve(imageDataUrl)
        return
      }

      canvas.width = img.width
      canvas.height = img.height

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Apply sketch effect based on settings
      applySketchEffect(ctx, canvas.width, canvas.height, settings)

      resolve(canvas.toDataURL("image/png"))
    }

    img.src = imageDataUrl
  })
}

function applySketchEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: {
    style: string
    lineStrength: number
    detail: number
    shading: number
  },
) {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = brightness
  }

  // Apply edge detection
  const edges = detectEdges(imageData, settings.detail / 100)

  // Clear canvas and set background
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, width, height)

  // Apply different sketch styles
  switch (settings.style) {
    case "pencil":
      applyPencilEffect(ctx, edges, width, height, settings)
      break
    case "charcoal":
      applyCharcoalEffect(ctx, edges, width, height, settings)
      break
    case "detailed":
      applyDetailedEffect(ctx, edges, width, height, settings)
      break
  }
}

function detectEdges(imageData: ImageData, sensitivity: number): Uint8ClampedArray {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const edges = new Uint8ClampedArray(width * height)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4

      // Sobel operator
      const gx =
        -1 * data[idx - 4 - width * 4] +
        -2 * data[idx - 4] +
        -1 * data[idx - 4 + width * 4] +
        1 * data[idx + 4 - width * 4] +
        2 * data[idx + 4] +
        1 * data[idx + 4 + width * 4]

      const gy =
        -1 * data[idx - width * 4 - 4] +
        -2 * data[idx - width * 4] +
        -1 * data[idx - width * 4 + 4] +
        1 * data[idx + width * 4 - 4] +
        2 * data[idx + width * 4] +
        1 * data[idx + width * 4 + 4]

      const magnitude = Math.sqrt(gx * gx + gy * gy) * sensitivity
      edges[y * width + x] = magnitude > 128 ? 255 : magnitude
    }
  }

  return edges
}

function applyPencilEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100

  // Draw edges with pencil-like strokes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge = edges[y * width + x]
      if (edge > 30) {
        const intensity = edge * lineStrength
        ctx.fillStyle = `rgba(0, 0, 0, ${intensity / 255})`

        // Simulate pencil strokes
        if (Math.random() < 0.3) {
          const length = Math.random() * 3 + 1
          const angle = Math.random() * Math.PI
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
          ctx.stroke()
        }
      }
    }
  }

  // Add shading
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.3
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 2
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`
      ctx.fillRect(x, y, size, size)
    }
    ctx.globalAlpha = 1
  }
}

function applyCharcoalEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100

  // Draw darker background
  ctx.fillStyle = "#f8f8f8"
  ctx.fillRect(0, 0, width, height)

  // Draw edges with charcoal-like strokes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge = edges[y * width + x]
      if (edge > 20) {
        const intensity = edge * lineStrength * 1.5
        ctx.fillStyle = `rgba(0, 0, 0, ${intensity / 255})`

        // Simulate charcoal strokes
        if (Math.random() < 0.4) {
          const length = Math.random() * 5 + 2
          const angle = Math.random() * Math.PI
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
          ctx.lineWidth = Math.random() * 2 + 1
          ctx.stroke()
        }
      }
    }
  }

  // Add texture
  ctx.globalAlpha = shading * 0.5
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 3
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`
    ctx.fillRect(x, y, size, size)
  }
  ctx.globalAlpha = 1
}

function applyDetailedEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100

  // Draw with detailed strokes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge = edges[y * width + x]
      if (edge > 25) {
        const intensity = edge * lineStrength

        // Create cross-hatching effect
        if (intensity > 150) {
          drawHatchLine(ctx, x, y, 45, 3, intensity / 255)
          drawHatchLine(ctx, x, y, -45, 3, intensity / 255)
        } else if (intensity > 100) {
          drawHatchLine(ctx, x, y, 45, 3, intensity / 255)
        } else if (intensity > 50) {
          drawHatchLine(ctx, x, y, 0, 2, intensity / 255)
        }
      }
    }
  }

  // Add fine details
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.2
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      drawHatchLine(ctx, x, y, Math.random() * 180, 1, Math.random() * 0.1)
    }
    ctx.globalAlpha = 1
  }
}

function drawHatchLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  intensity: number,
) {
  const radians = (angle * Math.PI) / 180
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + Math.cos(radians) * length, y + Math.sin(radians) * length)
  ctx.strokeStyle = `rgba(0, 0, 0, ${intensity})`
  ctx.lineWidth = 0.5
  ctx.stroke()
}
