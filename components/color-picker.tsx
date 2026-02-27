"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Sparkles, X } from "lucide-react"
import type { ColorInfo } from "@/app/page"

interface ColorPickerProps {
  imageUrl: string
  onColorPick: (colors: ColorInfo[]) => void
  onBack: () => void
}

function getColorName(r: number, g: number, b: number): string {
  const colors: { name: string; r: number; g: number; b: number }[] = [
    { name: "Crimson", r: 255, g: 0, b: 0 },
    { name: "Coral Reef", r: 255, g: 127, b: 80 },
    { name: "Tangerine", r: 255, g: 165, b: 0 },
    { name: "Golden Hour", r: 255, g: 215, b: 0 },
    { name: "Sunflower", r: 255, g: 255, b: 0 },
    { name: "Fresh Lime", r: 50, g: 205, b: 50 },
    { name: "Forest", r: 0, g: 128, b: 0 },
    { name: "Ocean Teal", r: 0, g: 128, b: 128 },
    { name: "Aquamarine", r: 0, g: 255, b: 255 },
    { name: "Sky Canvas", r: 135, g: 206, b: 235 },
    { name: "Sapphire", r: 0, g: 0, b: 255 },
    { name: "Midnight", r: 0, g: 0, b: 128 },
    { name: "Royal Plum", r: 128, g: 0, b: 128 },
    { name: "Wisteria", r: 138, g: 43, b: 226 },
    { name: "Fuchsia", r: 255, g: 0, b: 255 },
    { name: "Blush", r: 255, g: 192, b: 203 },
    { name: "Rose Petal", r: 255, g: 0, b: 127 },
    { name: "Sienna", r: 139, g: 69, b: 19 },
    { name: "Sandstone", r: 210, g: 180, b: 140 },
    { name: "Ivory", r: 245, g: 245, b: 220 },
    { name: "Pure White", r: 255, g: 255, b: 255 },
    { name: "Platinum", r: 192, g: 192, b: 192 },
    { name: "Stone", r: 128, g: 128, b: 128 },
    { name: "Graphite", r: 54, g: 69, b: 79 },
    { name: "Obsidian", r: 0, g: 0, b: 0 },
  ]

  let minDistance = Number.POSITIVE_INFINITY
  let closestColor = "Unknown"

  for (const color of colors) {
    const distance = Math.sqrt(Math.pow(r - color.r, 2) + Math.pow(g - color.g, 2) + Math.pow(b - color.b, 2))
    if (distance < minDistance) {
      minDistance = distance
      closestColor = color.name
    }
  }

  return closestColor
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  )
}

export function ColorPicker({ imageUrl, onColorPick, onBack }: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pickedColors, setPickedColors] = useState<ColorInfo[]>([])
  const [currentColor, setCurrentColor] = useState<{ hex: string; rgb: { r: number; g: number; b: number } } | null>(
    null,
  )
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const scale = Math.min(containerWidth / img.width, containerHeight / img.height)

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      setImageLoaded(true)
    }
    img.src = imageUrl
  }, [imageUrl])

  const getColorAtPosition = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const canvasX = Math.floor((x - rect.left) * scaleX)
    const canvasY = Math.floor((y - rect.top) * scaleY)

    if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) {
      return null
    }

    const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data
    return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      x: canvasX,
      y: canvasY,
    }
  }, [])

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const color = getColorAtPosition(clientX, clientY)
      if (color) {
        setCurrentColor({
          hex: rgbToHex(color.r, color.g, color.b),
          rgb: { r: color.r, g: color.g, b: color.b },
        })
        setCursorPos({ x: clientX, y: clientY })
      }
    },
    [getColorAtPosition],
  )

  const handleClick = useCallback(
    (clientX: number, clientY: number) => {
      const color = getColorAtPosition(clientX, clientY)
      if (color) {
        const colorInfo: ColorInfo = {
          hex: rgbToHex(color.r, color.g, color.b),
          rgb: { r: color.r, g: color.g, b: color.b },
          name: getColorName(color.r, color.g, color.b),
          x: color.x,
          y: color.y,
        }
        setPickedColors((prev) => [...prev, colorInfo])
      }
    },
    [getColorAtPosition],
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseClick = (e: React.MouseEvent) => {
    handleClick(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    handleClick(touch.clientX, touch.clientY)
  }

  const removeColor = (index: number) => {
    setPickedColors((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDone = () => {
    if (pickedColors.length > 0) {
      onColorPick(pickedColors)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-foreground/95">
      <header className="flex items-center justify-between px-4 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-10 h-10 bg-secondary/50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-serif font-semibold text-foreground">Color Studio</h1>
            <p className="text-xs text-muted-foreground">Touch anywhere to capture colors</p>
          </div>
        </div>
        <Button
          onClick={handleDone}
          disabled={pickedColors.length === 0}
          className="rounded-full gap-2 px-5 bg-foreground text-background hover:bg-foreground/90"
        >
          <Check className="w-4 h-4" />
          Done ({pickedColors.length})
        </Button>
      </header>

      {/* Canvas Area */}
      <div ref={containerRef} className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full rounded-2xl shadow-2xl cursor-crosshair touch-none"
          style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {imageLoaded &&
          pickedColors.map((color, index) => {
            const canvas = canvasRef.current
            if (!canvas) return null
            const rect = canvas.getBoundingClientRect()
            const scaleX = rect.width / canvas.width
            const scaleY = rect.height / canvas.height
            const x = rect.left + color.x * scaleX
            const y = rect.top + color.y * scaleY

            return (
              <div
                key={index}
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: x, top: y }}
              >
                <div
                  className="w-full h-full rounded-full border-[3px] border-white shadow-lg"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: `0 0 0 2px ${color.hex}, 0 4px 12px rgba(0,0,0,0.3)`,
                  }}
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-card rounded-full flex items-center justify-center text-[10px] font-bold text-foreground shadow">
                  {index + 1}
                </div>
              </div>
            )
          })}

        {currentColor && cursorPos && (
          <div
            className="fixed z-50 pointer-events-none transition-all duration-75"
            style={{
              left: cursorPos.x + 20,
              top: cursorPos.y - 70,
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-2xl shadow-xl border border-border">
              <div
                className="w-10 h-10 rounded-xl shadow-inner"
                style={{
                  backgroundColor: currentColor.hex,
                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px ${currentColor.hex}40`,
                }}
              />
              <div>
                <span className="font-mono text-sm font-semibold text-foreground block">{currentColor.hex}</span>
                <span className="text-xs text-muted-foreground">Tap to capture</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground font-serif italic">Preparing your canvas...</span>
            </div>
          </div>
        )}

        {imageLoaded && pickedColors.length === 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-5 py-3 bg-card/95 backdrop-blur rounded-full shadow-lg border border-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Touch to discover colors</span>
            </div>
          </div>
        )}
      </div>

      {pickedColors.length > 0 && (
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Palette</span>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {pickedColors.map((color, index) => (
              <div key={index} className="relative flex-shrink-0 group">
                <div
                  className="w-16 h-16 rounded-2xl shadow-md transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: color.hex, boxShadow: `0 4px 12px ${color.hex}40` }}
                />
                <button
                  onClick={() => removeColor(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
