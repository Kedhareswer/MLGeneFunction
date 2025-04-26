"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, Check, X, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Selection {
  id: string
  name: string
  path: Path2D
  style: string
  settings: Record<string, any>
  x: number
  y: number
  width: number
  height: number
  blendMode: "hard" | "soft" | "gradient" | "feather"
  blendRadius: number
}

export type NonSelectedAreaMode = 'original' | 'transparent';

interface AreaSelectorProps {
  imageUrl: string
  selections: Selection[]
  onSelectionsChange: (selections: Selection[]) => void
  currentStyle: string
  currentSettings: Record<string, any>
  isActive: boolean
  onGenerate?: () => void
  nonSelectedAreaMode: NonSelectedAreaMode;
  onNonSelectedAreaModeChange: (mode: NonSelectedAreaMode) => void;
}

export function AreaSelector({
  imageUrl,
  selections,
  onSelectionsChange,
  currentStyle,
  currentSettings,
  isActive,
  onGenerate = () => {},
  nonSelectedAreaMode,
  onNonSelectedAreaModeChange,
}: AreaSelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [currentPath, setCurrentPath] = useState<Path2D | null>(null)
  const [currentRect, setCurrentRect] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [editingSelection, setEditingSelection] = useState<Selection | null>(null)
  const [selectionName, setSelectionName] = useState("")
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedSelectionId, setSelectedSelectionId] = useState<string | null>(null)
  const [showBlendingPreview, setShowBlendingPreview] = useState(false)
  const [blendMode, setBlendMode] = useState<"hard" | "soft" | "gradient" | "feather">("soft")
  const [blendRadius, setBlendRadius] = useState(10)
  // Live preview state
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);
  const [livePreviewRect, setLivePreviewRect] = useState<{x: number, y: number, width: number, height: number} | null>(null);

  // Load the image and set up the canvas only when imageUrl changes
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      setImageSize({ width: img.width, height: img.height });
      ctx.drawImage(img, 0, 0);
      drawSelections(false);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Overlay live preview on canvas
  useEffect(() => {
    if (!canvasRef.current || !livePreviewUrl || !livePreviewRect) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.drawImage(img, livePreviewRect.x, livePreviewRect.y, livePreviewRect.width, livePreviewRect.height);
      ctx.restore();
    };
    img.src = livePreviewUrl;
  }, [livePreviewUrl, livePreviewRect]);

  // Redraw selections and always redraw image first
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      drawAllSelections(ctx);
    };
    img.src = imageUrl;
  }, [selections, selectedSelectionId, showBlendingPreview, imageUrl]);

  // Live preview effect: whenever currentRect changes (drawing or resizing), generate a preview
  useEffect(() => {
    if (!isDrawing && !isDragging) {
      setLivePreviewUrl(null);
      setLivePreviewRect(null);
      return;
    }
    // Only preview if rect is reasonable
    if (currentRect.width > 5 && currentRect.height > 5 && imageUrl) {
      // Fast preview: use a small offscreen canvas
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = currentRect.width;
        previewCanvas.height = currentRect.height;
        const ctx = previewCanvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, currentRect.x, currentRect.y, currentRect.width, currentRect.height, 0, 0, currentRect.width, currentRect.height);
        // Apply a quick sketch effect (use a simple grayscale for speed, or call a fast version of your sketch effect)
        // For now, grayscale for speed:
        const imageData = ctx.getImageData(0, 0, currentRect.width, currentRect.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
          imageData.data[i] = avg;
          imageData.data[i+1] = avg;
          imageData.data[i+2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        setLivePreviewUrl(previewCanvas.toDataURL('image/png'));
        setLivePreviewRect({ ...currentRect });
      };
      img.src = imageUrl;
    } else {
      setLivePreviewUrl(null);
      setLivePreviewRect(null);
    }
  }, [isDrawing, isDragging, currentRect, imageUrl]);

  // drawSelections: optionally redraw image, always redraw selections
  const drawSelections = (redrawImage: boolean = false) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (redrawImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        drawAllSelections(ctx);
      };
      img.src = imageUrl;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Only draw image if already present (should be, due to initial effect)
      // (Optional: could cache image)
      // Draw all selections
      drawAllSelections(ctx);
    }
  }

  // Helper to draw all selections
  const drawAllSelections = (ctx: CanvasRenderingContext2D) => {
    selections.forEach((selection) => {
      ctx.save()

      // Different styling for selected selection
      if (selection.id === selectedSelectionId) {
        ctx.strokeStyle = "#ff3d00"
        ctx.lineWidth = 2
      } else {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
      }

      ctx.stroke(selection.path)

      // Draw selection name
      ctx.fillStyle = selection.id === selectedSelectionId ? "#ff3d00" : "#ffffff"
      ctx.font = "14px sans-serif"
      ctx.fillText(selection.name, selection.x + 5, selection.y + 20)

      // Draw blend radius visualization if enabled
      if (showBlendingPreview && selection.blendRadius > 0) {
        // Create a path for the inner rectangle (original selection minus blend radius)
        const innerX = selection.x + selection.blendRadius
        const innerY = selection.y + selection.blendRadius
        const innerWidth = Math.max(0, selection.width - 2 * selection.blendRadius)
        const innerHeight = Math.max(0, selection.height - 2 * selection.blendRadius)

        ctx.beginPath()
        ctx.rect(innerX, innerY, innerWidth, innerHeight)
        ctx.strokeStyle = selection.id === selectedSelectionId ? "rgba(255, 61, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])

        // Draw blend mode indicator
        ctx.fillStyle = selection.id === selectedSelectionId ? "rgba(255, 61, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"
        ctx.font = "12px sans-serif"
        ctx.fillText(
          `${selection.blendMode} (${selection.blendRadius}px)`,
          selection.x + 5,
          selection.y + selection.height - 10,
        )
      }

      ctx.restore()
    })

    // Draw current selection if drawing
    if (currentPath && isDrawing) {
      ctx.save()
      ctx.strokeStyle = "#00ff00"
      ctx.lineWidth = 2
      ctx.stroke(currentPath)
      ctx.restore()
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    // Check if clicking on an existing selection
    const clickedSelection = selections.find((selection) => {
      const ctx = canvas.getContext("2d")
      return ctx?.isPointInPath(selection.path, x, y)
    })

    if (clickedSelection) {
      setSelectedSelectionId(clickedSelection.id)
      setIsDragging(true)
      setDragStart({ x, y })
      return
    }

    // Start drawing new selection
    setIsDrawing(true)
    setStartPoint({ x, y })

    const newPath = new Path2D()
    newPath.rect(x, y, 1, 1) // Start with a tiny rectangle
    setCurrentPath(newPath)
    setCurrentRect({ x, y, width: 1, height: 1 })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    if (isDragging && selectedSelectionId) {
      // Move the selected selection
      const deltaX = x - dragStart.x
      const deltaY = y - dragStart.y

      const updatedSelections = selections.map((selection) => {
        if (selection.id === selectedSelectionId) {
          const newX = selection.x + deltaX
          const newY = selection.y + deltaY

          // Create new path with updated position
          const newPath = new Path2D()
          newPath.rect(newX, newY, selection.width, selection.height)

          return {
            ...selection,
            x: newX,
            y: newY,
            path: newPath,
          }
        }
        return selection
      })

      onSelectionsChange(updatedSelections)
      setDragStart({ x, y })
      return
    }

    if (!isDrawing) return

    // Update current selection rectangle
    const width = x - startPoint.x
    const height = y - startPoint.y

    const newPath = new Path2D()
    newPath.rect(startPoint.x, startPoint.y, width, height)
    setCurrentPath(newPath)
    setCurrentRect({
      x: startPoint.x,
      y: startPoint.y,
      width,
      height,
    })

    drawSelections(false)
  }

  const handleMouseUp = () => {
    if (!isActive) return

    if (isDragging) {
      setIsDragging(false)
      return
    }

    if (!isDrawing || !currentPath) return

    setIsDrawing(false)

    // Only add selection if it has some size
    if (Math.abs(currentRect.width) > 10 && Math.abs(currentRect.height) > 10) {
      // Normalize rectangle coordinates (handle negative width/height)
      const x = currentRect.width < 0 ? currentRect.x + currentRect.width : currentRect.x
      const y = currentRect.height < 0 ? currentRect.y + currentRect.height : currentRect.y
      const width = Math.abs(currentRect.width)
      const height = Math.abs(currentRect.height)

      // Create normalized path
      const normalizedPath = new Path2D()
      normalizedPath.rect(x, y, width, height)

      setEditingSelection({
        id: `selection-${Date.now()}`,
        name: `Selection ${selections.length + 1}`,
        path: normalizedPath,
        style: currentStyle,
        settings: { ...currentSettings },
        x,
        y,
        width,
        height,
        blendMode: "soft",
        blendRadius: 10,
      })

      setSelectionName(`Selection ${selections.length + 1}`)
      setBlendMode("soft")
      setBlendRadius(10)
    }

    setCurrentPath(null)
  }

  const confirmSelection = () => {
    if (!editingSelection) return

    const newSelection = {
      ...editingSelection,
      name: selectionName || `Selection ${selections.length + 1}`,
      blendMode,
      blendRadius,
    }

    onSelectionsChange([...selections, newSelection])
    setEditingSelection(null)
    setSelectionName("")
  }

  const cancelSelection = () => {
    setEditingSelection(null)
    setSelectionName("")
  }

  const deleteSelection = (id: string) => {
    onSelectionsChange(selections.filter((s) => s.id !== id))
    if (selectedSelectionId === id) {
      setSelectedSelectionId(null)
    }
  }

  const updateSelectionStyle = (id: string, style: string, settings: Record<string, any>) => {
    onSelectionsChange(selections.map((s) => (s.id === id ? { ...s, style, settings: { ...settings } } : s)))
  }

  const updateSelectionBlending = (
    id: string,
    blendMode: "hard" | "soft" | "gradient" | "feather",
    blendRadius: number,
  ) => {
    onSelectionsChange(selections.map((s) => (s.id === id ? { ...s, blendMode, blendRadius } : s)))
  }

  const editBlendingSettings = (selection: Selection) => {
    setEditingSelection(selection)
    setSelectionName(selection.name)
    setBlendMode(selection.blendMode)
    setBlendRadius(selection.blendRadius)
  }

  return (
    <div className="space-y-4">
      <div className="relative border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`w-full cursor-${isActive ? (isDragging ? "grabbing" : "crosshair") : "default"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {!isActive && selections.length > 0 && (
          <div className="absolute top-2 left-2 bg-background/80 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">
              {selections.length} area{selections.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
        {selections.length > 0 && (
          <div className="mb-2 flex gap-4 items-center">
            <span className="text-sm font-medium">Non-selected area:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                checked={nonSelectedAreaMode === 'original'}
                onChange={() => onNonSelectedAreaModeChange('original')}
              />
              <span className="text-xs">Show original image</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                checked={nonSelectedAreaMode === 'transparent'}
                onChange={() => onNonSelectedAreaModeChange('transparent')}
              />
              <span className="text-xs">Transparent (only show selected)</span>
            </label>
          </div>
        )}
      </div>

      {isActive && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Selected Areas</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowBlendingPreview(!showBlendingPreview)}>
                {showBlendingPreview ? "Hide Blending" : "Show Blending"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectionsChange([])}
                disabled={selections.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>

          {selections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Draw on the image to create areas with different sketch styles.
            </p>
          ) : (
            <div className="space-y-2">
              {selections.map((selection) => (
                <div
                  key={selection.id}
                  className={`flex items-center justify-between p-2 rounded-md border ${
                    selection.id === selectedSelectionId ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedSelectionId(selection.id)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selection.name}</Badge>
                    <Badge>{selection.style}</Badge>
                    <Badge variant="secondary">
                      {selection.blendMode} ({selection.blendRadius}px)
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editBlendingSettings(selection)}
                      title="Edit blending settings"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Edit Blending</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingSelection(selection)
                        setSelectionName(selection.name)
                        setBlendMode(selection.blendMode)
                        setBlendRadius(selection.blendRadius)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSelection(selection.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editingSelection && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingSelection.id.startsWith("selection-") ? "New Area" : "Edit Area"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="selection-name" className="text-sm font-medium">
                  Area Name
                </label>
                <input
                  id="selection-name"
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectionName}
                  onChange={(e) => setSelectionName(e.target.value)}
                  placeholder="Enter a name for this area"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blend-mode">Blend Mode</Label>
                <Select value={blendMode} onValueChange={(value) => setBlendMode(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blend mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hard">Hard Edge (No Blending)</SelectItem>
                    <SelectItem value="soft">Soft Blend</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="feather">Feathered Edge</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {blendMode === "hard" && "Creates a sharp transition with no blending between styles"}
                  {blendMode === "soft" && "Creates a smooth transition between styles"}
                  {blendMode === "gradient" && "Creates a gradual linear transition between styles"}
                  {blendMode === "feather" && "Creates a soft, feathered edge around the selection"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="blend-radius">Blend Radius</Label>
                  <span className="text-sm text-muted-foreground">{blendRadius}px</span>
                </div>
                <Slider
                  id="blend-radius"
                  min={0}
                  max={50}
                  step={1}
                  value={[blendRadius]}
                  onValueChange={(value) => setBlendRadius(value[0])}
                  disabled={blendMode === "hard"}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls how far the blending extends from the selection boundary
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={cancelSelection}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={confirmSelection}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
