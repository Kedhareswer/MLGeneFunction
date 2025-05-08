"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageUploader } from "@/components/image-uploader"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { Download, RefreshCw, Share2, Scissors } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"
import { useToast } from "@/hooks/use-toast"
import { ProgressIndicator } from "@/components/progress-indicator"
import { ImageComparison } from "@/components/image-comparison"
import { AreaSelector, type Selection, type NonSelectedAreaMode } from "@/components/area-selector"

import { AnimatedSketchButton } from "./AnimatedSketchButton";

export default function ConvertPage() {
  const [selectedCategory, setSelectedCategory] = useState<'artistic' | 'technical'>('artistic');
  const [fullscreenImg, setFullscreenImg] = useState<null | 'original' | 'sketch'>(null);
  // Popup for wait suggestion (show only once per session)
  const [showWaitPopup, setShowWaitPopup] = useState(false);
  const [hasSeenWaitPopup, setHasSeenWaitPopup] = useState(false);
  const [image, setImage] = useState<string | null>(null)
  const [sketch, setSketch] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const styleCategories = {
    artistic: [
      "pencil",
      "charcoal",
      "ink",
      "conte",
      "scribble",
      "gesture",
      "woodcut",
      "stippling"
    ],
    technical: [
      "detailed",
      "crosshatch",
      "geometric",
      "topographic",
      "blueprint",
      "architectural",
    ]
  }

  const [settings, setSettings] = useState({
    style: "pencil",
    lineStrength: 50,
    detail: 50,
    shading: 30,
    // Artistic style settings
    pencilHardness: 3, // 1-5 (soft to hard)
    charcoalTexture: 50, // Texture grain
    inkTexture: 50, // Brush texture
    conteSoftness: 50, // Softness of strokes
    scribbleDensity: 50, // Density of scribble lines
    lineRandomness: 50, // Randomness of line placement
    strokeDirection: 0, // Direction of scribble strokes (0-360)
    gestureLineFluidity: 50, // Line fluidity
    gestureStrokePressure: 50, // Stroke pressure
    gestureMovementIntensity: 50, // Movement intensity
    brushRoughness: 50, // Roughness of brush strokes
    brushDirection: 0, // Direction of brush strokes (0-360)
    edgeEmphasis: 50, // Emphasis on edges
    grainDensity: 50, // Density of grain pattern
    toneContrast: 50, // Contrast in tonal values
    patternScale: 50, // Scale of lithograph pattern
    stipplingDensity: 50, // Dot density for Stippling
    // Technical style settings
    detailedDensity: 50, // Line density
    crosshatchAngle: 45, // Angle variation
    shapeComplexity: 50, // Complexity of geometric shapes
    edgeThreshold: 50, // Edge detection sensitivity
    minShapeSize: 10, // Minimum size of geometric shapes
    topographicDensity: 50, // Contour density
    topographicThickness: 50, // Line thickness
    topographicSensitivity: 50, // Height sensitivity
    blueprintPrecision: 50, // Grid precision
    blueprintWeight: 50, // Line weight
    blueprintDetail: 50, // Detail level
    architecturalLineHierarchy: 50, // Line hierarchy
    architecturalDetailLevel: 50, // Detail level
    architecturalScalePrecision: 50, // Scale precision
    woodcutBoldness: 50 // Edge boldness
  })
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selections, setSelections] = useState<Selection[]>([])
  const [nonSelectedAreaMode, setNonSelectedAreaMode] = useState<NonSelectedAreaMode>('original');
  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setSketch(null)
    setSelections([])
  }

  const handleProcessImage = async () => {
    if (!image) return

    setIsProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Process the image with selections or as a whole
    let processedSketch

    if (selections.length > 0) {
      processedSketch = await simulateImageProcessingWithSelections(image, selections, settings, nonSelectedAreaMode)
    } else {
      processedSketch = await simulateImageProcessing(image, settings)
    }

    setSketch(processedSketch)
    setIsProcessing(false)
    // Expose applySketchEffect to window for animation
    if (typeof window !== "undefined" && (window as any).applySketchEffect === undefined) {
      (window as any).applySketchEffect = applySketchEffect;
    }
  }

  const handleSettingChange = (key: string, value: number | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    // If we already have a sketch, update it when settings change
    if (sketch && image && !selectionMode) {
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
    setSelections([])
    setSettings({
      style: "pencil",
      lineStrength: 50,
      detail: 50,
      shading: 30,
      pencilHardness: 3,
      charcoalTexture: 50,
      inkTexture: 50,
      conteSoftness: 50,
      scribbleDensity: 50,
      lineRandomness: 50,
      strokeDirection: 0,
      gestureLineFluidity: 50,
      gestureStrokePressure: 50,
      gestureMovementIntensity: 50,
      brushRoughness: 50,
      brushDirection: 0,
      edgeEmphasis: 50,
      grainDensity: 50,
      toneContrast: 50,
      patternScale: 50,
      stipplingDensity: 50,
      detailedDensity: 50,
      crosshatchAngle: 45,
      shapeComplexity: 50,
      edgeThreshold: 50,
      minShapeSize: 10,
      topographicDensity: 50,
      topographicThickness: 50,
      topographicSensitivity: 50,
      blueprintPrecision: 50,
      blueprintWeight: 50,
      blueprintDetail: 50,
      architecturalLineHierarchy: 50,
      architecturalDetailLevel: 50,
      architecturalScalePrecision: 50,
      woodcutBoldness: 50
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

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev)

    // If turning off selection mode and we have selections, process the image
    if (selectionMode && selections.length > 0 && image && !isProcessing) {
      handleProcessImage()
    }
  }

  const handleSelectionsChange = (newSelections: Selection[]) => {
    setSelections(newSelections)
  }

  // Get current settings for the selected style
  const getCurrentSettings = () => {
    const baseSettings = {
      lineStrength: settings.lineStrength,
      detail: settings.detail,
      shading: settings.shading,
    }

    switch (settings.style) {
      // Artistic Styles
      case "pencil":
        return { ...baseSettings, pencilHardness: settings.pencilHardness }
      case "charcoal":
        return { ...baseSettings, charcoalTexture: settings.charcoalTexture }
      case "ink":
        return { ...baseSettings, inkTexture: settings.inkTexture }
      case "conte":
        return { ...baseSettings, conteSoftness: settings.conteSoftness }
      case "scribble":
        return { ...baseSettings, scribbleDensity: settings.scribbleDensity, lineRandomness: settings.lineRandomness, strokeDirection: settings.strokeDirection }
      case "gesture":
        return { ...baseSettings, gestureLineFluidity: settings.gestureLineFluidity, gestureStrokePressure: settings.gestureStrokePressure, gestureMovementIntensity: settings.gestureMovementIntensity }
      case "drybrush":
        return { ...baseSettings, brushRoughness: settings.brushRoughness, brushDirection: settings.brushDirection, edgeEmphasis: settings.edgeEmphasis }
      case "stippling":
        return { ...baseSettings, stipplingDensity: settings.stipplingDensity }
      case "woodcut":
        return { ...baseSettings, woodcutBoldness: settings.woodcutBoldness }
      
      // Technical Styles
      case "detailed":
        return { ...baseSettings, detailedDensity: settings.detailedDensity }
      case "crosshatch":
        return { ...baseSettings, crosshatchAngle: settings.crosshatchAngle }
      case "geometric":
        return { ...baseSettings, shapeComplexity: settings.shapeComplexity, edgeThreshold: settings.edgeThreshold, minShapeSize: settings.minShapeSize }
      case "topographic":
        return { ...baseSettings, topographicDensity: settings.topographicDensity, topographicThickness: settings.topographicThickness, topographicSensitivity: settings.topographicSensitivity }
      case "blueprint":
        return { ...baseSettings, blueprintPrecision: settings.blueprintPrecision, blueprintWeight: settings.blueprintWeight, blueprintDetail: settings.blueprintDetail }
      case "architectural":
        return { ...baseSettings, architecturalLineHierarchy: settings.architecturalLineHierarchy, architecturalDetailLevel: settings.architecturalDetailLevel, architecturalScalePrecision: settings.architecturalScalePrecision }
      default:
        return baseSettings
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Fullscreen Modal for Original/Sketch */}
        {fullscreenImg && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.95)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setFullscreenImg(null)}
          >
            <img
              src={fullscreenImg === 'original' ? image! : sketch!}
              alt={fullscreenImg === 'original' ? 'Original Fullscreen' : 'Sketch Fullscreen'}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
              }}
              onClick={e => e.stopPropagation()}
            />
            {/* Close button */}
            <button
              onClick={e => { e.stopPropagation(); setFullscreenImg(null); }}
              style={{
                position: "fixed",
                top: 24,
                right: 32,
                background: "rgba(0,0,0,0.7)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                zIndex: 1001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close fullscreen"
            >
              ×
            </button>
          </div>
        )}

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
                {image && !sketch && !selectionMode && (
                  <div className="mb-4 animate-fade-in">
                    <ProgressIndicator isProcessing={isProcessing} />
                  </div>
                )}

                {/* Selection Mode Toggle */}
                {image && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="selection-mode" checked={selectionMode} onCheckedChange={toggleSelectionMode} />
                      <Label htmlFor="selection-mode" className="flex items-center">
                        <Scissors className="mr-2 h-4 w-4" />
                        Area Selection Mode
                      </Label>
                    </div>

                    {selectionMode && (
                      <p className="text-sm text-muted-foreground">
                        Draw on the image to select areas for different styles
                      </p>
                    )}
                  </div>
                )}

                {selectionMode ? (
                  <>
                    <AreaSelector
                      imageUrl={image}
                      selections={selections}
                      onSelectionsChange={handleSelectionsChange}
                      currentStyle={settings.style}
                      currentSettings={getCurrentSettings()}
                      isActive={selectionMode}
                      nonSelectedAreaMode={nonSelectedAreaMode}
                      onNonSelectedAreaModeChange={setNonSelectedAreaMode}
                    />
                    {/* Show sketch output card below the area selector if present */}
                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="aspect-square overflow-hidden rounded-md relative">
                            <img
                              src={image || "/placeholder.svg"}
                              alt="Original"
                              className="h-full w-full object-cover"
                              onClick={() => setFullscreenImg('original')}
                              style={{ cursor: 'zoom-in' }}
                            />
                            <button
                              title="Fullscreen Original"
                              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
                              onClick={() => setFullscreenImg('original')}
                              style={{ lineHeight: 0 }}
                            >
                              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17 8V3H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 12V17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17 12V17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                          <p className="mt-2 text-center font-medium">Original Image</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="aspect-square overflow-hidden rounded-md bg-muted/30 relative">
                            {isProcessing ? (
                              <SkeletonLoader />
                            ) : sketch ? (
                              <>
                                <img
                                  src={sketch || "/placeholder.svg"}
                                  alt="Sketch"
                                  className="h-full w-full object-cover animate-fade-in"
                                  onClick={() => setFullscreenImg('sketch')}
                                  style={{ cursor: 'zoom-in' }}
                                />
                                <button
                                  title="Fullscreen Sketch"
                                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
                                  onClick={() => setFullscreenImg('sketch')}
                                  style={{ lineHeight: 0 }}
                                >
                                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17 8V3H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 12V17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17 12V17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <p className="text-center text-muted-foreground">
                                  Click "Generate Sketch" to process your image
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-center font-medium">
                            {isProcessing ? "Processing..." : "Sketch Output"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-square overflow-hidden rounded-md relative">
  <img
    src={image || "/placeholder.svg"}
    alt="Original"
    className="h-full w-full object-cover"
    onClick={() => setFullscreenImg('original')}
    style={{ cursor: 'zoom-in' }}
  />
  <button
    title="Fullscreen Original"
    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
    onClick={() => setFullscreenImg('original')}
    style={{ lineHeight: 0 }}
  >
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8V3H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12V17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 12V17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
</div>
<p className="mt-2 text-center font-medium">Original Image</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-square overflow-hidden rounded-md bg-muted/30 relative">
  {isProcessing ? (
    <SkeletonLoader />
  ) : sketch ? (
    <>
      <img
        src={sketch || "/placeholder.svg"}
        alt="Sketch"
        className="h-full w-full object-cover animate-fade-in"
        onClick={() => setFullscreenImg('sketch')}
        style={{ cursor: 'zoom-in' }}
      />
      <button
        title="Fullscreen Sketch"
        className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
        onClick={() => setFullscreenImg('sketch')}
        style={{ lineHeight: 0 }}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 8V3H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12V17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 12V17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="text-center text-muted-foreground">
        Click "Generate Sketch" to process your image
      </p>
    </div>
  )}
</div>
<p className="mt-2 text-center font-medium">
  {isProcessing ? "Processing..." : "Sketch Output"}
</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {!sketch && !isProcessing && !selectionMode && (
                    <>
                      <Button onClick={() => {
                        if (!hasSeenWaitPopup) setShowWaitPopup(true);
                        handleProcessImage();
                      }}>
                        Generate Sketch
                      </Button>
                      {/* Wait suggestion popup */}
                      {showWaitPopup && (
                        <div style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100vw',
                          height: '100vh',
                          background: 'rgba(0,0,0,0.45)',
                          zIndex: 2000,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                          onClick={() => { setShowWaitPopup(false); setHasSeenWaitPopup(true); }}
                        >
                          <div style={{
                            background: '#fff',
                            borderRadius: 12,
                            padding: 32,
                            maxWidth: 350,
                            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                            textAlign: 'center',
                            position: 'relative',
                          }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Tip for Better Results</h3>
                            <p style={{ fontSize: 16, color: '#333', marginBottom: 16 }}>
                              The AI model may take 15–20 seconds to generate the best sketch. If you wait a bit longer, the result will be higher quality!
                            </p>
                            <button
                              style={{
                                background: '#181818',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 20px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                marginTop: 8,
                              }}
                              onClick={() => { setShowWaitPopup(false); setHasSeenWaitPopup(true); }}
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {selectionMode && selections.length > 0 && (
                    <Button onClick={handleProcessImage}>Generate with Selected Areas</Button>
                  )}

                  {sketch && !selectionMode && (
                    <>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Sketch
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

          {comparisonMode && image && sketch && !selectionMode && (
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
                      defaultValue="artistic"
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value as 'artistic' | 'technical')}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="artistic">Artistic</TabsTrigger>
                        <TabsTrigger value="technical">Technical</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {styleCategories[selectedCategory as keyof typeof styleCategories].map((style) => (
                        <Button
                          key={style}
                          variant={settings.style === style ? "default" : "outline"}
                          className="w-full capitalize"
                          onClick={() => handleSettingChange("style", style)}
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
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

                  {/* Style-specific controls */}
                  {settings.style === "pencil" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pencilHardness">Pencil Hardness</Label>
                        <span className="text-sm text-muted-foreground">{settings.pencilHardness}/5</span>
                      </div>
                      <Slider
                        id="pencilHardness"
                        min={1}
                        max={5}
                        step={1}
                        value={[settings.pencilHardness || 3]}
                        onValueChange={(value) => handleSettingChange("pencilHardness", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Softer pencils (1-2) create darker, more textured lines. Harder pencils (4-5) create lighter,
                        cleaner lines.
                      </p>
                    </div>
                  )}

                  {settings.style === "charcoal" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="charcoalTexture">Texture Grain</Label>
                        <span className="text-sm text-muted-foreground">{settings.charcoalTexture}%</span>
                      </div>
                      <Slider
                        id="charcoalTexture"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.charcoalTexture || 50]}
                        onValueChange={(value) => handleSettingChange("charcoalTexture", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the amount of texture grain in the charcoal effect. Higher values create a rougher,
                        more textured look.
                      </p>
                    </div>
                  )}

                  {settings.style === "detailed" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="detailedDensity">Line Density</Label>
                        <span className="text-sm text-muted-foreground">{settings.detailedDensity}%</span>
                      </div>
                      <Slider
                        id="detailedDensity"
                        min={10}
                        max={100}
                        step={1}
                        value={[settings.detailedDensity || 50]}
                        onValueChange={(value) => handleSettingChange("detailedDensity", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the density of lines in detailed areas. Higher values create more intricate, detailed
                        sketches.
                      </p>
                    </div>
                  )}

                  {settings.style === "crosshatch" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="crosshatchAngle">Line Angle</Label>
                        <span className="text-sm text-muted-foreground">{settings.crosshatchAngle}°</span>
                      </div>
                      <Slider
                        id="crosshatchAngle"
                        min={15}
                        max={75}
                        step={1}
                        value={[settings.crosshatchAngle || 45]}
                        onValueChange={(value) => handleSettingChange("crosshatchAngle", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the angle of crosshatching lines. Different angles create different visual textures.
                      </p>
                    </div>
                  )}

                  {settings.style === "ink" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="inkTexture">Brush Texture</Label>
                        <span className="text-sm text-muted-foreground">{settings.inkTexture}%</span>
                      </div>
                      <Slider
                        id="inkTexture"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.inkTexture || 50]}
                        onValueChange={(value) => handleSettingChange("inkTexture", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the texture of the ink brush strokes. Higher values create more textured, varied brush
                        strokes.
                      </p>
                    </div>
                  )}

                  {settings.style === "scribble" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="scribbleDensity">Scribble Density</Label>
                        <span className="text-sm text-muted-foreground">{settings.scribbleDensity}%</span>
                      </div>
                      <Slider
                        id="scribbleDensity"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.scribbleDensity || 50]}
                        onValueChange={(value) => handleSettingChange("scribbleDensity", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="lineRandomness">Line Randomness</Label>
                        <span className="text-sm text-muted-foreground">{settings.lineRandomness}%</span>
                      </div>
                      <Slider
                        id="lineRandomness"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.lineRandomness || 50]}
                        onValueChange={(value) => handleSettingChange("lineRandomness", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="strokeDirection">Stroke Direction</Label>
                        <span className="text-sm text-muted-foreground">{settings.strokeDirection}°</span>
                      </div>
                      <Slider
                        id="strokeDirection"
                        min={0}
                        max={360}
                        step={15}
                        value={[settings.strokeDirection || 0]}
                        onValueChange={(value) => handleSettingChange("strokeDirection", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Energetic, loose sketching style with overlapping lines for shading.
                      </p>
                    </div>
                  )}

                  {settings.style === "geometric" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shapeComplexity">Shape Complexity</Label>
                        <span className="text-sm text-muted-foreground">{settings.shapeComplexity}%</span>
                      </div>
                      <Slider
                        id="shapeComplexity"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.shapeComplexity || 50]}
                        onValueChange={(value) => handleSettingChange("shapeComplexity", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="edgeThreshold">Edge Detection</Label>
                        <span className="text-sm text-muted-foreground">{settings.edgeThreshold}%</span>
                      </div>
                      <Slider
                        id="edgeThreshold"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.edgeThreshold || 50]}
                        onValueChange={(value) => handleSettingChange("edgeThreshold", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="minShapeSize">Minimum Shape Size</Label>
                        <span className="text-sm text-muted-foreground">{settings.minShapeSize}px</span>
                      </div>
                      <Slider
                        id="minShapeSize"
                        min={1}
                        max={50}
                        step={1}
                        value={[settings.minShapeSize || 10]}
                        onValueChange={(value) => handleSettingChange("minShapeSize", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Clean, modern aesthetic using geometric shapes.
                      </p>
                    </div>
                  )}

                  {settings.style === "drybrush" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="brushRoughness">Brush Roughness</Label>
                        <span className="text-sm text-muted-foreground">{settings.brushRoughness}%</span>
                      </div>
                      <Slider
                        id="brushRoughness"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.brushRoughness || 50]}
                        onValueChange={(value) => handleSettingChange("brushRoughness", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="brushDirection">Stroke Direction</Label>
                        <span className="text-sm text-muted-foreground">{settings.brushDirection}°</span>
                      </div>
                      <Slider
                        id="brushDirection"
                        min={0}
                        max={360}
                        step={15}
                        value={[settings.brushDirection || 0]}
                        onValueChange={(value) => handleSettingChange("brushDirection", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="edgeEmphasis">Edge Emphasis</Label>
                        <span className="text-sm text-muted-foreground">{settings.edgeEmphasis}%</span>
                      </div>
                      <Slider
                        id="edgeEmphasis"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.edgeEmphasis || 50]}
                        onValueChange={(value) => handleSettingChange("edgeEmphasis", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Rough, textured strokes with dramatic contrast.
                      </p>
                    </div>
                  )}

                  {settings.style === "lithograph" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="grainDensity">Grain Density</Label>
                        <span className="text-sm text-muted-foreground">{settings.grainDensity}%</span>
                      </div>
                      <Slider
                        id="grainDensity"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.grainDensity || 50]}
                        onValueChange={(value) => handleSettingChange("grainDensity", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="toneContrast">Tone Contrast</Label>
                        <span className="text-sm text-muted-foreground">{settings.toneContrast}%</span>
                      </div>
                      <Slider
                        id="toneContrast"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.toneContrast || 50]}
                        onValueChange={(value) => handleSettingChange("toneContrast", value[0])}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="patternScale">Pattern Scale</Label>
                        <span className="text-sm text-muted-foreground">{settings.patternScale}%</span>
                      </div>
                      <Slider
                        id="patternScale"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.patternScale || 50]}
                        onValueChange={(value) => handleSettingChange("patternScale", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Classic printmaking style with tonal gradients.
                      </p>
                    </div>
                  )}

                  {settings.style === "woodcut" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="woodcutBoldness">Edge Boldness</Label>
                        <span className="text-sm text-muted-foreground">{settings.woodcutBoldness}%</span>
                      </div>
                      <Slider
                        id="woodcutBoldness"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.woodcutBoldness || 50]}
                        onValueChange={(value) => handleSettingChange("woodcutBoldness", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the boldness of edges in the woodcut style. Higher values create more dramatic,
                        high-contrast results.
                      </p>
                    </div>
                  )}


                  {settings.style === "conte" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="conteSoftness">Softness</Label>
                        <span className="text-sm text-muted-foreground">{settings.conteSoftness}%</span>
                      </div>
                      <Slider
                        id="conteSoftness"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.conteSoftness || 50]}
                        onValueChange={(value) => handleSettingChange("conteSoftness", value[0])}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the softness of the conte crayon effect. Higher values create softer, more blended
                        strokes.
                      </p>
                    </div>
                  )}

                  {settings.style === "stippling" && (
                    <div className="space-y-2 mt-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="stipplingDensity">Stippling Density</Label>
                        <span className="text-sm text-muted-foreground">{settings.stipplingDensity}%</span>
                      </div>
                      <Slider
                        id="stipplingDensity"
                        value={[settings.stipplingDensity]}
                        onValueChange={([val]) => handleSettingChange("stipplingDensity", val)}
                        min={10}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls the density of dots in the stippling effect. Higher values create a denser, darker sketch.
                      </p>
                    </div>
                  )}

                  {settings.style === "topographic" && (
                    <div className="space-y-2 mt-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="topographicDensity">Contour Density</Label>
                        <span className="text-sm text-muted-foreground">{settings.topographicDensity}%</span>
                      </div>
                      <Slider
                        id="topographicDensity"
                        value={[settings.topographicDensity]}
                        onValueChange={([val]) => handleSettingChange("topographicDensity", val)}
                        min={10}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="topographicThickness">Line Thickness</Label>
                        <span className="text-sm text-muted-foreground">{settings.topographicThickness}%</span>
                      </div>
                      <Slider
                        id="topographicThickness"
                        value={[settings.topographicThickness]}
                        onValueChange={([val]) => handleSettingChange("topographicThickness", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="topographicSensitivity">Height Sensitivity</Label>
                        <span className="text-sm text-muted-foreground">{settings.topographicSensitivity}%</span>
                      </div>
                      <Slider
                        id="topographicSensitivity"
                        value={[settings.topographicSensitivity]}
                        onValueChange={([val]) => handleSettingChange("topographicSensitivity", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Creates elevation-like contour lines with adjustable density and thickness.
                      </p>
                    </div>
                  )}

                  {settings.style === "blueprint" && (
                    <div className="space-y-2 mt-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="blueprintPrecision">Grid Precision</Label>
                        <span className="text-sm text-muted-foreground">{settings.blueprintPrecision}%</span>
                      </div>
                      <Slider
                        id="blueprintPrecision"
                        value={[settings.blueprintPrecision]}
                        onValueChange={([val]) => handleSettingChange("blueprintPrecision", val)}
                        min={10}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="blueprintWeight">Line Weight</Label>
                        <span className="text-sm text-muted-foreground">{settings.blueprintWeight}%</span>
                      </div>
                      <Slider
                        id="blueprintWeight"
                        value={[settings.blueprintWeight]}
                        onValueChange={([val]) => handleSettingChange("blueprintWeight", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="blueprintDetail">Detail Level</Label>
                        <span className="text-sm text-muted-foreground">{settings.blueprintDetail}%</span>
                      </div>
                      <Slider
                        id="blueprintDetail"
                        value={[settings.blueprintDetail]}
                        onValueChange={([val]) => handleSettingChange("blueprintDetail", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Technical drawing style with precise lines and grid-like patterns.
                      </p>
                    </div>
                  )}

                  {settings.style === "architectural" && (
                    <div className="space-y-2 mt-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="architecturalLineHierarchy">Line Hierarchy</Label>
                        <span className="text-sm text-muted-foreground">{settings.architecturalLineHierarchy}%</span>
                      </div>
                      <Slider
                        id="architecturalLineHierarchy"
                        value={[settings.architecturalLineHierarchy]}
                        onValueChange={([val]) => handleSettingChange("architecturalLineHierarchy", val)}
                        min={10}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="architecturalDetailLevel">Detail Level</Label>
                        <span className="text-sm text-muted-foreground">{settings.architecturalDetailLevel}%</span>
                      </div>
                      <Slider
                        id="architecturalDetailLevel"
                        value={[settings.architecturalDetailLevel]}
                        onValueChange={([val]) => handleSettingChange("architecturalDetailLevel", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="architecturalScalePrecision">Scale Precision</Label>
                        <span className="text-sm text-muted-foreground">{settings.architecturalScalePrecision}%</span>
                      </div>
                      <Slider
                        id="architecturalScalePrecision"
                        value={[settings.architecturalScalePrecision]}
                        onValueChange={([val]) => handleSettingChange("architecturalScalePrecision", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Precise architectural drawing style with varying line weights and structured details.
                      </p>
                    </div>
                  )}

                  {settings.style === "gesture" && (
                    <div className="space-y-2 mt-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="gestureLineFluidity">Line Fluidity</Label>
                        <span className="text-sm text-muted-foreground">{settings.gestureLineFluidity}%</span>
                      </div>
                      <Slider
                        id="gestureLineFluidity"
                        value={[settings.gestureLineFluidity]}
                        onValueChange={([val]) => handleSettingChange("gestureLineFluidity", val)}
                        min={10}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="gestureStrokePressure">Stroke Pressure</Label>
                        <span className="text-sm text-muted-foreground">{settings.gestureStrokePressure}%</span>
                      </div>
                      <Slider
                        id="gestureStrokePressure"
                        value={[settings.gestureStrokePressure]}
                        onValueChange={([val]) => handleSettingChange("gestureStrokePressure", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Label htmlFor="gestureMovementIntensity">Movement Intensity</Label>
                        <span className="text-sm text-muted-foreground">{settings.gestureMovementIntensity}%</span>
                      </div>
                      <Slider
                        id="gestureMovementIntensity"
                        value={[settings.gestureMovementIntensity]}
                        onValueChange={([val]) => handleSettingChange("gestureMovementIntensity", val)}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Expressive, flowing lines that capture movement and form with minimal detail.
                      </p>
                    </div>
                  )}
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
    pencilHardness?: number
    charcoalTexture?: number
    detailedDensity?: number
    crosshatchAngle?: number
    inkTexture?: number
    woodcutBoldness?: number
    etchingDepth?: number
    conteSoftness?: number
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

// New function to process image with multiple selections
async function simulateImageProcessingWithSelections(
  imageDataUrl: string,
  selections: Selection[],
  defaultSettings: any,
  nonSelectedAreaMode: NonSelectedAreaMode
) {
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

      if (nonSelectedAreaMode === 'original') {
        // Draw original image first
        ctx.drawImage(img, 0, 0);
      } else {
        // Transparent background (ensure alpha is 0 everywhere)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Also ensure canvas is fully transparent
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // For each selection, process only the selected area
      selections.forEach((selection) => {
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext("2d")

        if (!tempCtx) return

        // Draw only the selected region from the image and apply sketch effect
        tempCtx.save();
        tempCtx.beginPath();
        tempCtx.rect(selection.x, selection.y, selection.width, selection.height);
        tempCtx.clip();
        tempCtx.drawImage(img, 0, 0);
        applySketchEffect(tempCtx, tempCanvas.width, tempCanvas.height, {
          style: selection.style,
          lineStrength: selection.settings?.lineStrength ?? 5,
          detail: selection.settings?.detail ?? 5,
          shading: selection.settings?.shading ?? 5,
          ...selection.settings,
        });
        tempCtx.restore();

        // Apply blending based on selection's blend mode and radius
        applyBlendedSelection(ctx, tempCanvas, selection)
      })

      resolve(canvas.toDataURL("image/png"))
    }

    img.src = imageDataUrl
  })
}

// New function to apply blended selections
function applyBlendedSelection(ctx: CanvasRenderingContext2D, sourceCanvas: HTMLCanvasElement, selection: Selection) {
  const { x, y, width, height, blendMode, blendRadius } = selection

  // For hard edge (no blending), just copy the region directly
  if (blendMode === "hard" || blendRadius === 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.clearRect(x, y, width, height); // Remove original in selection
    ctx.drawImage(
      sourceCanvas,
      x, y, width, height, // source rect
      x, y, width, height  // destination rect
    );
    ctx.restore();
    return;
  }

  // For other blend modes, we need to create a mask
  const maskCanvas = document.createElement("canvas")
  maskCanvas.width = ctx.canvas.width
  maskCanvas.height = ctx.canvas.height
  const maskCtx = maskCanvas.getContext("2d")

  if (!maskCtx) return

  // Create the base mask shape
  maskCtx.fillStyle = "black"
  maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
  maskCtx.fillStyle = "white"

  switch (blendMode) {
    case "soft":
      // Create a soft-edged mask with gaussian-like falloff
      const gradient = maskCtx.createRadialGradient(
        x + width / 2,
        y + height / 2,
        Math.min(width, height) / 2 - blendRadius,
        x + width / 2,
        y + height / 2,
        Math.min(width, height) / 2,
      )
      gradient.addColorStop(0, "white")
      gradient.addColorStop(1, "black")
      maskCtx.fillStyle = "white"
      maskCtx.fillRect(x, y, width, height)
      maskCtx.globalCompositeOperation = "source-atop"
      maskCtx.fillStyle = gradient
      maskCtx.fillRect(x - blendRadius, y - blendRadius, width + blendRadius * 2, height + blendRadius * 2)
      maskCtx.globalCompositeOperation = "source-over"
      break

    case "gradient":
      // Create a linear gradient from the edge inward
      maskCtx.fillRect(
        x + blendRadius,
        y + blendRadius,
        Math.max(0, width - blendRadius * 2),
        Math.max(0, height - blendRadius * 2),
      )

      // Top gradient
      const topGradient = maskCtx.createLinearGradient(0, y, 0, y + blendRadius)
      topGradient.addColorStop(0, "black")
      topGradient.addColorStop(1, "white")
      maskCtx.fillStyle = topGradient
      maskCtx.fillRect(x, y, width, blendRadius)

      // Bottom gradient
      const bottomGradient = maskCtx.createLinearGradient(0, y + height - blendRadius, 0, y + height)
      bottomGradient.addColorStop(0, "white")
      bottomGradient.addColorStop(1, "black")
      maskCtx.fillStyle = bottomGradient
      maskCtx.fillRect(x, y + height - blendRadius, width, blendRadius)

      // Left gradient
      const leftGradient = maskCtx.createLinearGradient(x, 0, x + blendRadius, 0)
      leftGradient.addColorStop(0, "black")
      leftGradient.addColorStop(1, "white")
      maskCtx.fillStyle = leftGradient
      maskCtx.fillRect(x, y + blendRadius, blendRadius, height - blendRadius * 2)

      // Right gradient
      const rightGradient = maskCtx.createLinearGradient(x + width - blendRadius, 0, x + width, 0)
      rightGradient.addColorStop(0, "white")
      rightGradient.addColorStop(1, "black")
      maskCtx.fillStyle = rightGradient
      maskCtx.fillRect(x + width - blendRadius, y + blendRadius, blendRadius, height - blendRadius * 2)
      break

    case "feather":
      // Create a feathered edge with blur
      maskCtx.filter = `blur(${blendRadius}px)`
      maskCtx.fillRect(
        x + blendRadius,
        y + blendRadius,
        Math.max(0, width - blendRadius * 2),
        Math.max(0, height - blendRadius * 2),
      )
      maskCtx.filter = "none"
      break
  }

  // Apply the masked image to the main canvas
  ctx.save();
  // Draw the mask into an alpha channel
  const maskedSketch = document.createElement('canvas');
  maskedSketch.width = ctx.canvas.width;
  maskedSketch.height = ctx.canvas.height;
  const maskedSketchCtx = maskedSketch.getContext('2d');
  if (!maskedSketchCtx) {
    ctx.restore();
    return;
  }
  // Draw the sketch
  maskedSketchCtx.drawImage(sourceCanvas, 0, 0);
  // Set mask as alpha
  maskedSketchCtx.globalCompositeOperation = 'destination-in';
  maskedSketchCtx.drawImage(maskCanvas, 0, 0);
  maskedSketchCtx.globalCompositeOperation = 'source-over';
  // Composite the result over the main canvas
  ctx.drawImage(maskedSketch, 0, 0);
  ctx.restore();
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
    pencilHardness?: number
    charcoalTexture?: number
    detailedDensity?: number
    crosshatchAngle?: number
    inkTexture?: number
    woodcutBoldness?: number
    etchingDepth?: number
    conteSoftness?: number
    scribbleDensity?: number
    lineRandomness?: number
    strokeDirection?: number
    shapeComplexity?: number
    edgeThreshold?: number
    minShapeSize?: number
    brushRoughness?: number
    brushDirection?: number
    edgeEmphasis?: number
    grainDensity?: number
    toneContrast?: number
    patternScale?: number
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
    case "crosshatch":
      applyCrosshatchEffect(ctx, edges, width, height, settings)
      break
    case "ink":
      applyInkWashEffect(ctx, edges, width, height, settings)
      break
    case "woodcut":
      applyWoodcutEffect(ctx, edges, width, height, settings)
      break
    case "conte":
      applyConteEffect(ctx, edges, width, height, settings)
      break
    case "stippling":
      applyStipplingEffect(ctx, edges, width, height, settings)
      break
    case "scribble":
      applyScribbleEffect(ctx, edges, width, height, settings)
      break
    case "geometric":
      applyGeometricEffect(ctx, edges, width, height, settings)
      break
    case "lithograph":
      applyLithographEffect(ctx, edges, width, height, settings)
      break
    case "zentangle":
      applyZentangleEffect(ctx, edges, width, height, settings)
      break
    case "topographic":
      applyTopographicEffect(ctx, edges, width, height, settings)
      break
    case "blueprint":
      applyBlueprintEffect(ctx, edges, width, height, settings)
      break
    case "architectural":
      applyArchitecturalEffect(ctx, edges, width, height, settings)
      break
    case "gesture":
      applyGestureEffect(ctx, edges, width, height, settings)
      break
    case "wireframe":
      applyWireframeEffect(ctx, edges, width, height, settings)
      break
  }
}

function applyTopographicEffect(ctx: CanvasRenderingContext2D, edges: Uint8ClampedArray, width: number, height: number, settings: any) {
  const { topographicDensity = 50, topographicThickness = 50, topographicSensitivity = 50 } = settings;
  const density = topographicDensity / 100;
  const thickness = topographicThickness / 100;
  const sensitivity = topographicSensitivity / 100;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';
  
  // Create contour lines
  for (let y = 0; y < height; y += Math.max(2, Math.floor(10 / density))) {
    let path = new Path2D();
    let inLine = false;
    
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const elevation = edges[idx] * sensitivity;
      
      if (elevation > 128) {
        if (!inLine) {
          path.moveTo(x, y);
          inLine = true;
        } else {
          path.lineTo(x, y);
        }
      } else if (inLine) {
        inLine = false;
      }
    }
    
    ctx.lineWidth = thickness * 2;
    ctx.stroke(path);
  }
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';

  // Create contour lines based on edge intensity
  for (let y = 0; y < height; y += Math.max(2, Math.floor(10 * (1 - density)))) {
    let path = new Path2D();
    let inLine = false;

    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const intensity = edges[idx] / 255;

      if (intensity > sensitivity) {
        if (!inLine) {
          path.moveTo(x, y);
          inLine = true;
        }
        const yOffset = Math.sin(x * 0.1) * thickness * 5;
        path.lineTo(x, y + yOffset);
      } else if (inLine) {
        inLine = false;
      }
    }

    ctx.lineWidth = thickness * 2;
    ctx.stroke(path);
  }
}

function applyBlueprintEffect(ctx: CanvasRenderingContext2D, edges: Uint8ClampedArray, width: number, height: number, settings: any) {
  const { blueprintPrecision = 50, blueprintWeight = 50, blueprintDetail = 50 } = settings;
  const precision = blueprintPrecision / 100;
  const weight = blueprintWeight / 100;
  const detail = blueprintDetail / 100;

  // Set blueprint style background
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#1e40af';

  // Draw grid
  const gridSize = Math.max(10, Math.floor(50 * (1 - precision)));
  ctx.lineWidth = 0.5;
  
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw main lines
  ctx.lineWidth = weight * 2;
  for (let y = 0; y < height; y++) {
    let path = new Path2D();
    let inLine = false;
    
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (edges[idx] > 128 * detail) {
        if (!inLine) {
          path.moveTo(x, y);
          inLine = true;
        } else {
          path.lineTo(x, y);
        }
      } else if (inLine) {
        inLine = false;
      }
    }
    
    ctx.stroke(path);
  }

  // Set blueprint style
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#0f3a75';

  // Draw grid
  const blueprintGridSize = Math.max(10, Math.floor(50 * (1 - precision)));
  ctx.lineWidth = weight;

  // Draw detail lines based on edges
  for (let y = 0; y < height; y += blueprintGridSize) {
    for (let x = 0; x < width; x += blueprintGridSize) {
      const idx = y * width + x;
      const intensity = edges[idx] / 255;

      if (intensity > 1 - detail) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + gridSize * Math.random(), y + gridSize * Math.random());
        ctx.stroke();
      }
    }
  }

  // Add grid overlay
  ctx.lineWidth = weight * 0.5;
  for (let x = 0; x < width; x += gridSize * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize * 2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function applyZentangleEffect(ctx: CanvasRenderingContext2D, edges: Uint8ClampedArray, width: number, height: number, settings: any) {
  const { zentangleComplexity, zentangleSize, zentangleDensity } = settings;
  const complexity = zentangleComplexity / 100;
  const size = Math.max(10, Math.floor(50 * (1 - zentangleSize / 100)));
  const density = zentangleDensity / 100;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';

  // Create grid for patterns
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const idx = (y * width + x) * 4;
      const intensity = edges[idx] / 255;

      if (Math.random() < density) {
        const pattern = Math.floor(Math.random() * 5); // 5 different pattern types
        ctx.save();
        ctx.translate(x, y);

        switch (pattern) {
          case 0: // Circles
            for (let i = 0; i < size * complexity; i += 4) {
              ctx.beginPath();
              ctx.arc(size/2, size/2, i, 0, Math.PI * 2);
              ctx.stroke();
            }
            break;

          case 1: // Crosshatch
            for (let i = 0; i < size; i += 4) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(size, i);
              ctx.moveTo(i, 0);
              ctx.lineTo(i, size);
              ctx.stroke();
            }
            break;

          case 2: // Spirals
            ctx.beginPath();
            for (let i = 0; i < size * complexity; i++) {
              const angle = 0.1 * i;
              const radius = i * 0.3;
              const x = size/2 + radius * Math.cos(angle);
              const y = size/2 + radius * Math.sin(angle);
              i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
            break;

          case 3: // Dots
            for (let i = 0; i < size; i += 4) {
              for (let j = 0; j < size; j += 4) {
                if (Math.random() < complexity) {
                  ctx.beginPath();
                  ctx.arc(i, j, 1, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
            break;

          case 4: // Waves
            for (let i = 0; i < size; i += 4) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              for (let x = 0; x < size; x += 2) {
                ctx.lineTo(x, i + Math.sin(x * 0.1) * 5 * complexity);
              }
              ctx.stroke();
            }
            break;
        }
        ctx.restore();
      }
    }
  }
}

function applyArchitecturalEffect(ctx: CanvasRenderingContext2D, edges: Uint8ClampedArray, width: number, height: number, settings: any) {
  const { architecturalLineHierarchy = 50, architecturalDetailLevel = 50, architecturalScalePrecision = 50 } = settings;
  const hierarchy = architecturalLineHierarchy / 100;
  const detailLevel = architecturalDetailLevel / 100;
  const scalePrecision = architecturalScalePrecision / 100;

  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw primary structural lines
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2 * hierarchy;
  for (let y = 0; y < height; y += 2) {
    let path = new Path2D();
    let inLine = false;
    
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (edges[idx] > 200) {
        if (!inLine) {
          path.moveTo(x, y);
          inLine = true;
        } else {
          path.lineTo(x, y);
        }
      } else if (inLine) {
        inLine = false;
      }
    }
    
    ctx.stroke(path);
  }

  // Draw secondary detail lines
  ctx.lineWidth = 1 * detailLevel;
  ctx.strokeStyle = '#666666';
  for (let y = 0; y < height; y += 3) {
    let path = new Path2D();
    let inLine = false;
    
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (edges[idx] > 150 && edges[idx] <= 200) {
        if (!inLine) {
          path.moveTo(x, y);
          inLine = true;
        } else {
          path.lineTo(x, y);
        }
      } else if (inLine) {
        inLine = false;
      }
    }
    
    ctx.stroke(path);
  }

  // Add scale indicators
  const scaleSize = Math.max(20, Math.floor(100 * scalePrecision));
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  
  for (let x = 0; x < width; x += scaleSize) {
    ctx.beginPath();
    ctx.moveTo(x, height - 10);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function applyGestureEffect(ctx: CanvasRenderingContext2D, edges: Uint8ClampedArray, width: number, height: number, settings: any) {
  const { gestureLineFluidity = 50, gestureStrokePressure = 50, gestureMovementIntensity = 50 } = settings;
  const fluidity = gestureLineFluidity / 100;
  const pressure = gestureStrokePressure / 100;
  const intensity = gestureMovementIntensity / 100;

  // Set background and stroke properties
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Enhanced gesture drawing with dynamic pressure
  const lineSpacing = Math.max(2, Math.floor(6 * (1 - intensity)));
  
  // Primary gesture strokes
  for (let y = 0; y < height; y += lineSpacing) {
    let path = new Path2D();
    let inLine = false;
    let lastX = 0;
    let lastY = y;
    let strokePoints: [number, number][] = [];
    
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const edge = edges[idx];
      
      if (edge > 100) { // Adjusted threshold for better line detection
        const edgeIntensity = edge / 255;
        if (!inLine) {
          const startY = y + Math.sin(x * fluidity * 0.1) * (8 * fluidity);
          path.moveTo(x, startY);
          inLine = true;
          lastX = x;
          lastY = startY;
          strokePoints = [[x, startY]];
        } else {
          // Dynamic offset based on edge intensity and fluidity
          const offset = Math.sin(x * fluidity * 0.1) * (12 * fluidity) * edgeIntensity;
          const newY = y + offset;

          // Smooth curve generation with dynamic control points
          if (strokePoints.length >= 2) {
            const [px, py] = strokePoints[strokePoints.length - 1];
            const [ppx, ppy] = strokePoints[strokePoints.length - 2];
            
            const cp1x = px + (x - ppx) * 0.5;
            const cp1y = py + (newY - ppy) * 0.5;
            
            path.quadraticCurveTo(cp1x, cp1y, x, newY);
          } else {
            path.lineTo(x, newY);
          }

          strokePoints.push([x, newY]);
          lastX = x;
          lastY = newY;
        }
      } else if (inLine) {
        // Smooth stroke ending
        if (strokePoints.length >= 2) {
          const [px, py] = strokePoints[strokePoints.length - 1];
          path.lineTo(px + (x - px) * 0.5, py);
        }
        inLine = false;
        
        // Draw with dynamic pressure
        ctx.lineWidth = Math.max(1.5, pressure * 6 * (1 + intensity));
        ctx.stroke(path);
        
        path = new Path2D();
        strokePoints = [];
      }
    }
    
    if (inLine) {
      ctx.lineWidth = Math.max(1.5, pressure * 6 * (1 + intensity));
      ctx.stroke(path);
    }
  }

  // Secondary expressive strokes
  ctx.globalAlpha = 0.4;
  const expressiveStrokes = Math.floor(25 * intensity);
  for (let i = 0; i < expressiveStrokes; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const idx = Math.floor(y) * width + Math.floor(x);
    
    if (edges[idx] > 120) {
      const length = 25 + Math.random() * 35 * fluidity;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      // Create flowing expressive strokes
      const cp1x = x + Math.cos(angle) * length * 0.33;
      const cp1y = y + Math.sin(angle) * length * 0.33;
      const cp2x = x + Math.cos(angle) * length * 0.66;
      const cp2y = y + Math.sin(angle) * length * 0.66;
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      ctx.lineWidth = Math.max(0.8, pressure * 4);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function applyWireframeEffect(ctx: CanvasRenderingContext2D, edges: Uint8ClampedArray, width: number, height: number, settings: any) {
  const { wireframeDensity, wireframeDepth, wireframePoints } = settings;
  const density = wireframeDensity / 100;
  const depth = wireframeDepth / 100;
  const points = Math.floor(wireframePoints / 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';

  // Create wireframe mesh
  const gridSize = Math.max(20, Math.floor(100 * (1 - density)));
  const vertices: [number, number][] = [];

  // Generate vertices based on edge detection
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      const idx = y * width + x;
      const intensity = edges[idx] / 255;
      
      if (intensity > 0.3) {
        const zOffset = intensity * depth * 20;
        vertices.push([x + Math.random() * gridSize, y + Math.random() * gridSize + zOffset]);
      }
    }
  }

  // Connect nearby vertices
  ctx.lineWidth = 0.5;
  vertices.forEach(([x1, y1], i) => {
    let connected = 0;
    for (let j = i + 1; j < vertices.length && connected < points; j++) {
      const [x2, y2] = vertices[j];
      const distance = Math.hypot(x2 - x1, y2 - y1);
      
      if (distance < gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        connected++;
      }
    }
  });
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

function applyStipplingEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: any
) {
  ctx.fillStyle = 'black';
  const dotSize = 1;
  const density = settings.stipplingDensity / 50; // Convert 0-100 to 0-2 range
  
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const idx = y * width + x;
      const edgeValue = edges[idx];
      
      // Calculate probability based on edge value and density
      const probability = (edgeValue / 255) * density;
      
      if (Math.random() < probability) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function applyHatchingEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: any
) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  
  const angle = (settings.hatchingAngle * Math.PI) / 180;
  const spacing = settings.hatchingSpacing;
  const lineLength = 10;
  
  // Calculate the offset for diagonal lines
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const idx = y * width + x;
      const edgeValue = edges[idx];
      
      if (edgeValue > 50) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + lineLength * cos,
          y + lineLength * sin
        );
        ctx.stroke();
      }
    }
  }
}

function applyPencilEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    pencilHardness?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const hardness = settings.pencilHardness || 3

  // Adjust stroke characteristics based on hardness
  const strokeOpacity = 1 - (hardness - 1) * 0.15 // Softer pencils are darker
  const strokeVariation = (6 - hardness) * 0.5 // Softer pencils have more variation

  // Draw edges with pencil-like strokes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge = edges[y * width + x]
      if (edge > 30) {
        const intensity = edge * lineStrength
        ctx.fillStyle = `rgba(0, 0, 0, ${(intensity / 255) * strokeOpacity})`

        // Simulate pencil strokes with hardness-based variation
        if (Math.random() < 0.3) {
          const length = Math.random() * (3 + strokeVariation) + 1
          const angle = Math.random() * Math.PI
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
          ctx.lineWidth = hardness <= 2 ? 1.5 : 1 // Softer pencils have thicker lines
          ctx.stroke()
        }
      }
    }
  }

  // Add shading with hardness-based texture
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.3
    const grainAmount = (6 - hardness) * 300 // More grain for softer pencils

    for (let i = 0; i < grainAmount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * (hardness <= 2 ? 3 : 2)
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1 * strokeOpacity})`
      ctx.fillRect(x, y, size, size)
    }
    ctx.globalAlpha = 1
  }
}

function applyScribbleEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    scribbleDensity?: number
    lineRandomness?: number
    strokeDirection?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const density = (settings.scribbleDensity || 50) / 100
  const randomness = (settings.lineRandomness || 50) / 100
  const baseDirection = ((settings.strokeDirection || 0) * Math.PI) / 180

  ctx.strokeStyle = 'black'
  ctx.lineCap = 'round'

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const edge = edges[y * width + x]
      if (edge > 20 && Math.random() < density) {
        const intensity = edge * lineStrength
        ctx.lineWidth = Math.random() * 2 + 0.5

        // Create scribble lines with controlled randomness
        const numLines = Math.floor(intensity / 50) + 1
        for (let i = 0; i < numLines; i++) {
          const angleVariation = (Math.random() - 0.5) * Math.PI * randomness
          const angle = baseDirection + angleVariation
          const length = Math.random() * 8 + 4

          ctx.beginPath()
          ctx.moveTo(x, y)
          
          // Create curved scribble effect
          const cp1x = x + Math.cos(angle) * length * 0.5
          const cp1y = y + Math.sin(angle) * length * 0.5
          const cp2x = x + Math.cos(angle) * length * 0.8
          const cp2y = y + Math.sin(angle) * length * 0.8
          const endX = x + Math.cos(angle) * length
          const endY = y + Math.sin(angle) * length

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
          ctx.globalAlpha = intensity / 255 * 0.3
          ctx.stroke()
        }
      }
    }
  }
  ctx.globalAlpha = 1
}

function applyGeometricEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shapeComplexity?: number
    edgeThreshold?: number
    minShapeSize?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const complexity = (settings.shapeComplexity || 50) / 100
  const threshold = (settings.edgeThreshold || 50) / 100
  const minSize = settings.minShapeSize || 10

  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1

  // Create geometric shapes based on edge detection
  for (let y = 0; y < height; y += minSize) {
    for (let x = 0; x < width; x += minSize) {
      let avgEdge = 0
      let count = 0

      // Calculate average edge intensity for the area
      for (let dy = 0; dy < minSize && y + dy < height; dy++) {
        for (let dx = 0; dx < minSize && x + dx < width; dx++) {
          avgEdge += edges[(y + dy) * width + (x + dx)]
          count++
        }
      }
      avgEdge /= count

      if (avgEdge > threshold * 255) {
        const size = minSize + Math.random() * minSize * complexity
        const shapeType = Math.random()

        ctx.beginPath()
        if (shapeType < 0.4) {
          // Triangle
          const angle = Math.random() * Math.PI * 2
          ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size)
          for (let i = 1; i <= 3; i++) {
            const a = angle + (i * Math.PI * 2) / 3
            ctx.lineTo(x + Math.cos(a) * size, y + Math.sin(a) * size)
          }
        } else if (shapeType < 0.7) {
          // Rectangle
          ctx.rect(x, y, size, size)
        } else {
          // Circle
          ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2)
        }
        ctx.globalAlpha = avgEdge / 255 * lineStrength
        ctx.stroke()
      }
    }
  }
  ctx.globalAlpha = 1
}

function applyDryBrushEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    brushRoughness?: number
    brushDirection?: number
    edgeEmphasis?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const roughness = (settings.brushRoughness || 50) / 100
  const baseDirection = ((settings.brushDirection || 0) * Math.PI) / 180
  const emphasis = (settings.edgeEmphasis || 50) / 100

  ctx.strokeStyle = 'black'
  ctx.lineCap = 'square'

  // Create dry brush strokes
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const edge = edges[y * width + x]
      if (edge > 20) {
        const intensity = edge * lineStrength
        const strokeLength = 10 + Math.random() * 20 * roughness

        // Multiple strokes for dry brush effect
        const numStrokes = Math.floor(3 + roughness * 3)
        for (let i = 0; i < numStrokes; i++) {
          const angleVar = (Math.random() - 0.5) * Math.PI * roughness
          const angle = baseDirection + angleVar
          
          ctx.beginPath()
          ctx.lineWidth = (Math.random() * 2 + 0.5) * (1 + emphasis)
          
          // Create broken, rough strokes
          const segments = Math.floor(3 + roughness * 4)
          let currentX = x
          let currentY = y
          
          for (let j = 0; j < segments; j++) {
            const segLength = strokeLength / segments
            const nextX = currentX + Math.cos(angle) * segLength
            const nextY = currentY + Math.sin(angle) * segLength
            
            if (Math.random() < 0.7) { // Create breaks in stroke
              ctx.moveTo(currentX, currentY)
              ctx.lineTo(nextX, nextY)
            }
            
            currentX = nextX
            currentY = nextY
          }
          
          ctx.globalAlpha = intensity / 255 * 0.2
          ctx.stroke()
        }
      }
    }
  }
  ctx.globalAlpha = 1
}

function applyLithographEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    grainDensity?: number
    toneContrast?: number
    patternScale?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const density = (settings.grainDensity || 50) / 100
  const contrast = (settings.toneContrast || 50) / 100
  const scale = (settings.patternScale || 50) / 100

  ctx.fillStyle = 'black'
  
  // Create lithographic grain pattern
  const patternSize = Math.max(2, Math.floor(4 * scale))
  for (let y = 0; y < height; y += patternSize) {
    for (let x = 0; x < width; x += patternSize) {
      const edge = edges[y * width + x]
      if (edge > 0) {
        const intensity = edge * lineStrength
        const adjustedIntensity = Math.pow(intensity / 255, 1 + contrast) // Adjust contrast
        
        // Create grainy texture
        const grainCount = Math.floor(density * patternSize * patternSize)
        for (let i = 0; i < grainCount; i++) {
          const grainX = x + Math.random() * patternSize
          const grainY = y + Math.random() * patternSize
          const grainSize = Math.random() * 2 * scale
          
          ctx.globalAlpha = adjustedIntensity * 0.3
          ctx.beginPath()
          ctx.arc(grainX, grainY, grainSize, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Add characteristic lithograph lines
        if (Math.random() < adjustedIntensity * 0.3) {
          ctx.beginPath()
          ctx.lineWidth = 0.5
          const angle = Math.random() * Math.PI
          const lineLength = patternSize * 2
          
          ctx.moveTo(
            x + Math.cos(angle) * lineLength,
            y + Math.sin(angle) * lineLength
          )
          ctx.lineTo(
            x - Math.cos(angle) * lineLength,
            y - Math.sin(angle) * lineLength
          )
          
          ctx.globalAlpha = adjustedIntensity * 0.2
          ctx.stroke()
        }
      }
    }
  }
  ctx.globalAlpha = 1
}

function applyCharcoalEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    charcoalTexture?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const textureGrain = (settings.charcoalTexture || 50) / 100

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

        // Simulate charcoal strokes with texture-based variation
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

  // Add texture based on grain setting
  ctx.globalAlpha = shading * 0.5
  const grainDensity = Math.floor(textureGrain * 3000)

  for (let i = 0; i < grainDensity; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * (textureGrain * 4 + 1)
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2 * textureGrain})`
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
    detailedDensity?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const density = (settings.detailedDensity || 50) / 100

  // Adjust line spacing based on density
  const lineSpacing = Math.max(1, Math.floor(5 - density * 4))

  // Draw with detailed strokes
  for (let y = 0; y < height; y += lineSpacing) {
    for (let x = 0; x < width; x += lineSpacing) {
      const edge = edges[y * width + x]
      if (edge > 25) {
        const intensity = edge * lineStrength

        // Create cross-hatching effect with density-based variation
        if (intensity > 150) {
          drawHatchLine(ctx, x, y, 45, 3, intensity / 255)
          drawHatchLine(ctx, x, y, -45, 3, intensity / 255)
          if (density > 0.7) {
            drawHatchLine(ctx, x, y, 0, 2, (intensity / 255) * 0.7)
          }
        } else if (intensity > 100) {
          drawHatchLine(ctx, x, y, 45, 3, intensity / 255)
          if (density > 0.8) {
            drawHatchLine(ctx, x, y, -45, 2, (intensity / 255) * 0.6)
          }
        } else if (intensity > 50) {
          drawHatchLine(ctx, x, y, 0, 2, intensity / 255)
        }
      }
    }
  }

  // Add fine details based on density
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.2
    const detailAmount = Math.floor(density * 4000)

    for (let i = 0; i < detailAmount; i++) {
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

function applyCrosshatchEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    crosshatchAngle?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const angleVariation = settings.crosshatchAngle || 45

  // Clear canvas with white background
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, width, height)

  // Apply crosshatching with multiple layers and angle variation
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const idx = y * width + x
      const edge = edges[idx]
      const intensity = edge * lineStrength

      if (intensity > 200) {
        // Dense crosshatching for dark areas
        drawHatchLine(ctx, x, y, angleVariation, 6, 0.7)
        drawHatchLine(ctx, x, y, -angleVariation, 6, 0.7)
        if (angleVariation < 60) {
          drawHatchLine(ctx, x, y, 0, 6, 0.5)
          drawHatchLine(ctx, x, y, 90, 6, 0.5)
        }
      } else if (intensity > 150) {
        // Medium crosshatching
        drawHatchLine(ctx, x, y, angleVariation, 6, 0.6)
        drawHatchLine(ctx, x, y, -angleVariation, 6, 0.6)
      } else if (intensity > 100) {
        // Light crosshatching
        drawHatchLine(ctx, x, y, angleVariation, 5, 0.5)
      } else if (intensity > 50) {
        // Very light hatching
        drawHatchLine(ctx, x, y, angleVariation, 4, 0.3)
      }
    }
  }

  // Add texture based on shading setting
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.2
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const angle = Math.random() > 0.5 ? angleVariation : -angleVariation
      drawHatchLine(ctx, x, y, angle, 3, Math.random() * 0.2)
    }
    ctx.globalAlpha = 1
  }
}

function applyInkWashEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    inkTexture?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const brushTexture = (settings.inkTexture || 50) / 100

  // Clear canvas with slightly off-white background to mimic paper
  ctx.fillStyle = "#fafaf8"
  ctx.fillRect(0, 0, width, height)

  // Create a temporary canvas for the wash effect
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext("2d")

  if (!tempCtx) return

  // Draw base ink wash with texture-based variation
  const strokeSpacing = Math.max(1, Math.floor(4 - brushTexture * 2))

  for (let y = 0; y < height; y += strokeSpacing) {
    for (let x = 0; x < width; x += strokeSpacing) {
      const idx = y * width + x
      const edge = edges[idx]

      if (edge > 5) {
        const intensity = edge * lineStrength
        const opacity = Math.min(0.9, intensity / 255)

        // Draw ink wash strokes with texture-based variation
        tempCtx.beginPath()
        const strokeLength = Math.random() * (10 + brushTexture * 5) + 5
        const angle = Math.random() * Math.PI

        tempCtx.moveTo(x, y)
        tempCtx.lineTo(x + Math.cos(angle) * strokeLength, y + Math.sin(angle) * strokeLength)

        tempCtx.lineWidth = Math.random() * (brushTexture * 4 + 1) + 1
        tempCtx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.4})`
        tempCtx.stroke()
      }
    }
  }

  // Apply blur to simulate ink diffusion (more blur for higher texture)
  tempCtx.filter = `blur(${brushTexture * 1.5 + 0.5}px)`
  tempCtx.drawImage(tempCanvas, 0, 0)

  // Draw on main canvas
  ctx.drawImage(tempCanvas, 0, 0)

  // Add darker ink lines for definition
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const idx = y * width + x
      const edge = edges[idx]

      if (edge > 100) {
        const intensity = edge * lineStrength

        ctx.beginPath()
        const strokeLength = Math.random() * 5 + 2
        const angle = Math.random() * Math.PI

        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(angle) * strokeLength, y + Math.sin(angle) * strokeLength)

        ctx.lineWidth = Math.random() * 1.5 + 0.5
        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.9, intensity / 255)})`
        ctx.stroke()
      }
    }
  }

  // Add texture based on shading and brush texture
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.15
    const spatterAmount = Math.floor(brushTexture * 1500)

    for (let i = 0; i < spatterAmount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height

      ctx.beginPath()
      ctx.arc(x, y, Math.random() * (brushTexture * 4 + 1), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}

function applyWoodcutEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    woodcutBoldness?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const boldness = (settings.woodcutBoldness || 50) / 100

  // Clear canvas with white background
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, width, height)

  // Create high contrast woodcut effect with boldness-based threshold
  const threshold = 100 - boldness * 60 // Lower threshold = more black areas

  // First pass - create bold areas
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const edge = edges[idx]
      const intensity = edge * lineStrength

      if (intensity > threshold) {
        ctx.fillStyle = "black"
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  // Second pass - add texture with boldness-based variation
  const textureFrequency = Math.max(1, Math.floor(5 - boldness * 3))

  for (let y = 0; y < height; y += textureFrequency) {
    for (let x = 0; x < width; x += textureFrequency) {
      // Add woodcut-like texture lines
      if (Math.random() < 0.3) {
        const lineLength = Math.random() * (boldness * 8 + 3) + 3
        const angle = Math.random() > 0.7 ? 0 : 90 // Mostly horizontal or vertical

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(
          x + Math.cos((angle * Math.PI) / 180) * lineLength,
          y + Math.sin((angle * Math.PI) / 180) * lineLength,
        )

        // Vary line opacity based on position
        const pixelData = ctx.getImageData(x, y, 1, 1).data
        const isDark = pixelData[0] < 128 // Check if pixel is already dark

        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${Math.random() * 0.3})`
          : `rgba(0, 0, 0, ${Math.random() * 0.4})`

        ctx.lineWidth = Math.random() * (boldness * 2 + 0.5) + 0.5
        ctx.stroke()
      }
    }
  }

  // Add bold outlines for definition based on boldness
  const outlineThickness = Math.max(1, Math.floor(boldness * 3))

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      const edge = edges[idx]

      if (edge > 200) {
        ctx.fillStyle = "black"
        ctx.fillRect(x - outlineThickness, y - outlineThickness, outlineThickness * 2 + 1, outlineThickness * 2 + 1)
      }
    }
  }
}

function applyEtchingEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    etchingDepth?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const lineDepth = (settings.etchingDepth || 50) / 100

  // Clear canvas with off-white background
  ctx.fillStyle = "#f9f9f7"
  ctx.fillRect(0, 0, width, height)

  // Create fine etching lines
  const lineSpacing = Math.max(1, Math.floor(3 - lineDepth * 2))

  // First pass - horizontal etching lines
  for (let y = 0; y < height; y += lineSpacing) {
    let inDarkArea = false
    let lineLength = 0

    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const edge = edges[idx]
      const intensity = edge * lineStrength

      // Determine if we're in a dark area
      const isDark = intensity > 70

      // Start or continue a line in dark areas
      if (isDark) {
        if (!inDarkArea) {
          // Start a new line
          inDarkArea = true
          lineLength = 0
          ctx.beginPath()
          ctx.moveTo(x, y + Math.random() * lineSpacing * 0.8)
        }

        lineLength++
      } else if (inDarkArea) {
        // End the line
        inDarkArea = false
        if (lineLength > 2) {
          ctx.lineTo(x, y + Math.random() * lineSpacing * 0.8)
          ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.9, lineDepth + 0.3)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }

  // Second pass - vertical etching lines for darker areas
  for (let x = 0; x < width; x += lineSpacing * 2) {
    let inDarkArea = false
    let lineLength = 0

    for (let y = 0; y < height; y++) {
      const idx = y * width + x
      const edge = edges[idx]
      const intensity = edge * lineStrength

      // Determine if we're in a dark area
      const isDark = intensity > 120

      // Start or continue a line in dark areas
      if (isDark) {
        if (!inDarkArea) {
          // Start a new line
          inDarkArea = true
          lineLength = 0
          ctx.beginPath()
          ctx.moveTo(x + Math.random() * lineSpacing * 0.8, y)
        }

        lineLength++
      } else if (inDarkArea) {
        // End the line
        inDarkArea = false
        if (lineLength > 2) {
          ctx.lineTo(x + Math.random() * lineSpacing * 0.8, y)
          ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.9, lineDepth + 0.2)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }

  // Third pass - diagonal lines for the darkest areas
  if (lineDepth > 0.4) {
    for (let i = 0; i < width + height; i += lineSpacing * 3) {
      for (let j = 0; j < Math.min(width, height); j += lineSpacing * 2) {
        const x = Math.min(width - 1, i - j)
        const y = Math.min(height - 1, j)

        const idx = y * width + x
        if (idx >= 0 && idx < edges.length) {
          const edge = edges[idx]
          const intensity = edge * lineStrength

          if (intensity > 180) {
            const lineLength = Math.random() * (lineDepth * 10) + 5
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(Math.min(width - 1, x + lineLength * 0.7), Math.min(height - 1, y + lineLength * 0.7))
            ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.9, lineDepth * 0.8)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }
  }

  // Add texture based on shading
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.1
    const textureAmount = Math.floor(lineDepth * 2000)

    for (let i = 0; i < textureAmount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 0.5 + 0.2

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}

function applyConteEffect(
  ctx: CanvasRenderingContext2D,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  settings: {
    lineStrength: number
    shading: number
    conteSoftness?: number
  },
) {
  const lineStrength = settings.lineStrength / 100
  const shading = settings.shading / 100
  const softness = (settings.conteSoftness || 50) / 100

  // Clear canvas with slightly textured background
  ctx.fillStyle = "#f8f7f5"
  ctx.fillRect(0, 0, width, height)

  // Add paper texture
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.fillStyle = `rgba(220, 220, 215, ${Math.random() * 0.05})`
    ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1)
  }

  // Create a temporary canvas for the conte effect
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext("2d")

  if (!tempCtx) return

  // Draw base conte strokes with softness-based variation
  const strokeSpacing = Math.max(1, Math.floor(4 - softness * 2))

  for (let y = 0; y < height; y += strokeSpacing) {
    for (let x = 0; x < width; x += strokeSpacing) {
      const idx = y * width + x
      const edge = edges[idx]

      if (edge > 20) {
        const intensity = edge * lineStrength
        const opacity = Math.min(0.9, intensity / 255)

        // Draw conte crayon-like strokes
        tempCtx.beginPath()

        // Vary stroke direction based on position
        const angle = ((x % 20) / 20) * Math.PI
        const strokeLength = Math.random() * (softness * 8 + 4) + 3

        tempCtx.moveTo(x, y)
        tempCtx.lineTo(x + Math.cos(angle) * strokeLength, y + Math.sin(angle) * strokeLength)

        tempCtx.lineWidth = Math.random() * (softness * 3 + 1) + 1
        tempCtx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.6})`
        tempCtx.stroke()
      }
    }
  }

  // Apply blur based on softness to simulate conte texture
  tempCtx.filter = `blur(${softness * 1.2}px)`
  tempCtx.drawImage(tempCanvas, 0, 0)

  // Draw on main canvas
  ctx.drawImage(tempCanvas, 0, 0)

  // Add smudging effect based on softness
  if (softness > 0.3) {
    const smudgeCount = Math.floor(softness * 200)

    for (let i = 0; i < smudgeCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const smudgeLength = Math.random() * (softness * 20) + 5
      const angle = Math.random() * Math.PI

      ctx.globalAlpha = Math.random() * 0.3
      ctx.filter = `blur(${softness * 2}px)`

      // Get the color at this point
      const pixelData = ctx.getImageData(x, y, 1, 1).data
      const brightness = (pixelData[0] + pixelData[1] + pixelData[2]) / 3

      // Only smudge if there's something to smudge
      if (brightness < 240) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(angle) * smudgeLength, y + Math.sin(angle) * smudgeLength)
        ctx.lineWidth = Math.random() * (softness * 5) + 2
        ctx.strokeStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, 0.3)`
        ctx.stroke()
      }
    }

    ctx.filter = "none"
    ctx.globalAlpha = 1
  }

  // Add texture based on shading
  if (shading > 0) {
    ctx.globalAlpha = shading * 0.15
    const textureAmount = Math.floor((1 - softness) * 2000) // Less texture for softer conte

    for (let i = 0; i < textureAmount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height

      ctx.beginPath()
      ctx.arc(x, y, Math.random() * 1.5 + 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}
