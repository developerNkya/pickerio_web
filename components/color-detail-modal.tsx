"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, X, Droplets, Blend, Sparkles } from "lucide-react"
import type { ColorInfo } from "@/app/page"

interface ColorDetailModalProps {
  color: ColorInfo
  onClose: () => void
}

// Generate shades (lighter and darker variations)
function generateShades(hex: string): { shade: string; label: string; percentage: number }[] {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  const shades = []

  // Lighter shades
  for (let i = 4; i >= 1; i--) {
    const factor = 1 + i * 0.15
    const newR = Math.min(255, Math.round(r + (255 - r) * (factor - 1)))
    const newG = Math.min(255, Math.round(g + (255 - g) * (factor - 1)))
    const newB = Math.min(255, Math.round(b + (255 - b) * (factor - 1)))
    shades.push({
      shade: `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`,
      label: `+${i * 15}%`,
      percentage: 100 + i * 15,
    })
  }

  // Original
  shades.push({ shade: hex, label: "Base", percentage: 100 })

  // Darker shades
  for (let i = 1; i <= 4; i++) {
    const factor = 1 - i * 0.15
    const newR = Math.max(0, Math.round(r * factor))
    const newG = Math.max(0, Math.round(g * factor))
    const newB = Math.max(0, Math.round(b * factor))
    shades.push({
      shade: `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`,
      label: `-${i * 15}%`,
      percentage: 100 - i * 15,
    })
  }

  return shades
}

// Get technical color name and family
function getColorDetails(hex: string): {
  technicalName: string
  family: string
  temperature: string
  mixture: { colors: string[]; percentages: number[] }
} {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  // Determine color family and temperature
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2 / 255

  let family = "Neutral"
  let temperature = "Neutral"
  let technicalName = ""

  if (max - min < 20) {
    // Grayscale
    family = "Neutral"
    temperature = "Neutral"
    if (lightness > 0.9) technicalName = "Pure White Tint"
    else if (lightness > 0.7) technicalName = "Light Gray"
    else if (lightness > 0.4) technicalName = "Medium Gray"
    else if (lightness > 0.15) technicalName = "Charcoal"
    else technicalName = "Near Black"
  } else if (r >= g && r >= b) {
    if (r > g + 30 && r > b + 30) {
      family = "Red"
      temperature = "Warm"
      if (g > b + 20) {
        technicalName = lightness > 0.6 ? "Coral Tint" : "Vermillion"
        family = "Orange-Red"
      } else if (b > g + 20) {
        technicalName = lightness > 0.6 ? "Rose Pink" : "Crimson"
        family = "Magenta-Red"
      } else {
        technicalName = lightness > 0.6 ? "Salmon" : "True Red"
      }
    } else if (g > b) {
      family = "Orange"
      temperature = "Warm"
      technicalName = lightness > 0.6 ? "Peach" : "Burnt Orange"
    } else {
      family = "Pink"
      temperature = "Warm"
      technicalName = lightness > 0.6 ? "Blush Pink" : "Deep Rose"
    }
  } else if (g >= r && g >= b) {
    family = "Green"
    temperature = "Cool"
    if (b > r + 20) {
      technicalName = lightness > 0.6 ? "Mint" : "Teal"
      family = "Cyan-Green"
      temperature = "Cool"
    } else if (r > b + 20) {
      technicalName = lightness > 0.6 ? "Lime" : "Olive"
      family = "Yellow-Green"
      temperature = "Warm"
    } else {
      technicalName = lightness > 0.6 ? "Sage" : "Forest Green"
    }
  } else {
    family = "Blue"
    temperature = "Cool"
    if (r > g + 20) {
      technicalName = lightness > 0.6 ? "Lavender" : "Violet"
      family = "Purple"
    } else if (g > r + 20) {
      technicalName = lightness > 0.6 ? "Sky Blue" : "Cerulean"
      family = "Cyan-Blue"
    } else {
      technicalName = lightness > 0.6 ? "Periwinkle" : "Navy"
    }
  }

  // Calculate color mixture (simplified RYB-ish model for artistic context)
  const mixture = calculateMixture(r, g, b)

  return { technicalName, family, temperature, mixture }
}

function calculateMixture(r: number, g: number, b: number): { colors: string[]; percentages: number[] } {
  const colors: string[] = []
  const percentages: number[] = []

  const total = r + g + b || 1

  // Determine primary color contributions
  if (r > 50) {
    colors.push("Red")
    percentages.push(Math.round((r / total) * 100))
  }
  if (g > 50) {
    // Green in light = Yellow contribution in pigment theory
    if (r > 100 && g > 100 && b < 150) {
      colors.push("Yellow")
      percentages.push(Math.round((g / total) * 100))
    } else {
      colors.push("Green")
      percentages.push(Math.round((g / total) * 100))
    }
  }
  if (b > 50) {
    colors.push("Blue")
    percentages.push(Math.round((b / total) * 100))
  }

  // Add white/black for lightness
  const lightness = (r + g + b) / 3
  if (lightness > 200) {
    colors.push("White")
    percentages.push(Math.round(((lightness - 200) / 55) * 30))
  } else if (lightness < 80) {
    colors.push("Black")
    percentages.push(Math.round(((80 - lightness) / 80) * 40))
  }

  // Normalize percentages
  const sum = percentages.reduce((a, b) => a + b, 0)
  if (sum > 0) {
    for (let i = 0; i < percentages.length; i++) {
      percentages[i] = Math.round((percentages[i] / sum) * 100)
    }
  }

  return { colors, percentages }
}

const mixColorMap: Record<string, string> = {
  Red: "#E53935",
  Blue: "#1E88E5",
  Yellow: "#FDD835",
  Green: "#43A047",
  White: "#FAFAFA",
  Black: "#212121",
}

export function ColorDetailModal({ color, onClose }: ColorDetailModalProps) {
  const [copiedShade, setCopiedShade] = useState<string | null>(null)
  const shades = generateShades(color.hex)
  const details = getColorDetails(color.hex)

  const copyToClipboard = async (hex: string) => {
    await navigator.clipboard.writeText(hex)
    setCopiedShade(hex)
    setTimeout(() => setCopiedShade(null), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Color Header */}
        <div
          className="relative h-40 overflow-hidden rounded-t-3xl sm:rounded-t-3xl"
          style={{ backgroundColor: color.hex }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">{color.name}</h2>
            <p className="text-white/80 text-sm font-medium">{details.technicalName}</p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Color Summary */}
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Sparkles className="w-4 h-4 text-primary" />
              Color Summary
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-background rounded-xl p-3">
                <span className="text-muted-foreground text-xs block mb-1">Family</span>
                <span className="font-semibold text-foreground">{details.family}</span>
              </div>
              <div className="bg-background rounded-xl p-3">
                <span className="text-muted-foreground text-xs block mb-1">Temperature</span>
                <span className="font-semibold text-foreground">{details.temperature}</span>
              </div>
              <div className="bg-background rounded-xl p-3">
                <span className="text-muted-foreground text-xs block mb-1">HEX Code</span>
                <span className="font-mono font-semibold text-foreground">{color.hex.toUpperCase()}</span>
              </div>
              <div className="bg-background rounded-xl p-3">
                <span className="text-muted-foreground text-xs block mb-1">RGB Values</span>
                <span className="font-mono font-semibold text-foreground">
                  {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                </span>
              </div>
            </div>
          </div>

          {/* Color Mixture */}
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Blend className="w-4 h-4 text-primary" />
              Color Mixture
            </div>
            <p className="text-sm text-muted-foreground">This color can be achieved by mixing:</p>
            <div className="flex flex-wrap gap-2">
              {details.mixture.colors.map((mixColor, i) => (
                <div key={mixColor} className="flex items-center gap-2 bg-background rounded-full pl-1 pr-3 py-1">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: mixColorMap[mixColor] }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {mixColor} <span className="text-muted-foreground">{details.mixture.percentages[i]}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2 h-8 rounded-lg overflow-hidden">
              {details.mixture.colors.map((mixColor, i) => (
                <div
                  key={mixColor}
                  className="h-full transition-all"
                  style={{
                    backgroundColor: mixColorMap[mixColor],
                    width: `${details.mixture.percentages[i]}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Shades */}
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Droplets className="w-4 h-4 text-primary" />
              Color Shades
            </div>
            <p className="text-sm text-muted-foreground">Tap any shade to copy its HEX code</p>
            <div className="grid grid-cols-9 gap-1">
              {shades.map((s, i) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(s.shade)}
                  className="group relative aspect-square rounded-lg transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: s.shade }}
                >
                  {s.label === "Base" && (
                    <div className="absolute inset-0 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-card" />
                  )}
                  {copiedShade === s.shade && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Lighter</span>
              <span>Darker</span>
            </div>
          </div>

          {/* Large shade preview on tap */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl bg-transparent"
              onClick={() => copyToClipboard(color.hex)}
            >
              {copiedShade === color.hex ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HEX
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl bg-transparent"
              onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy RGB
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
