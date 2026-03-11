"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Camera, Check, Copy, Palette, ChevronRight, Save, Download, Sparkles } from "lucide-react"
import type { ColorInfo } from "@/app/discovery/page"
import { ColorDetailModal } from "@/components/color-detail-modal"

interface ColorResultsProps {
  colors: ColorInfo[]
  onNewPhoto: () => void
  onBack: () => void
}

function getTechnicalName(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2 / 255

  if (max - min < 20) {
    if (lightness > 0.9) return "White Tint"
    if (lightness > 0.7) return "Light Gray"
    if (lightness > 0.4) return "Medium Gray"
    return "Dark Tone"
  }
  if (r >= g && r >= b) {
    if (g > b + 20) return "Warm Vermillion"
    if (b > g + 20) return "Cool Crimson"
    return "True Red Base"
  }
  if (g >= r && g >= b) {
    if (b > r + 20) return "Cyan-Green"
    if (r > b + 20) return "Yellow-Green"
    return "True Green Base"
  }
  if (r > g + 20) return "Violet-Blue"
  if (g > r + 20) return "Cyan-Blue"
  return "True Blue Base"
}

export function ColorResults({ colors, onNewPhoto, onBack }: ColorResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null)
  const { user, savePalette } = useAuth()
  const [isSaved, setIsSaved] = useState(false)

  const copyToClipboard = async (text: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSave = () => {
    savePalette(colors.map(c => c.hex), `Discovery ${new Date().toLocaleDateString()}`)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleExport = () => {
    const config = colors.reduce((acc, color, i) => {
      acc[`color-${i + 1}`] = color.hex
      return acc
    }, {} as any)
    const tailwind = JSON.stringify({ theme: { extend: { colors: config } } }, null, 2)
    navigator.clipboard.writeText(tailwind)
    alert("Tailwind config copied to clipboard!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {colors.slice(0, 4).map((color, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl animate-blob"
            style={{
              backgroundColor: color.hex,
              left: `${(i % 2) * 60 + 10}%`,
              top: `${Math.floor(i / 2) * 50 + 20}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <header className="flex items-center gap-4 px-6 py-5 relative z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-10 h-10 bg-secondary/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-serif font-semibold text-foreground">Your Palette</h1>
          <p className="text-sm text-muted-foreground">
            {colors.length} color{colors.length !== 1 ? "s" : ""} discovered
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Palette className="w-5 h-5 text-primary" />
        </div>
      </header>

      <div className="px-6 pb-4 relative z-10">
        <div className="flex h-16 rounded-2xl overflow-hidden shadow-lg">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 transition-all duration-300 hover:flex-[2] cursor-pointer"
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 relative z-10">
        <div className="grid gap-4 max-w-2xl mx-auto">
          {colors.map((color, index) => (
            <div
              key={index}
              onClick={() => setSelectedColor(color)}
              className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/30"
            >
              <div className="flex">
                <div className="w-32 sm:w-40 relative overflow-hidden" style={{ backgroundColor: color.hex }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                </div>

                <div className="flex-1 p-5 space-y-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground">{color.name}</h3>
                    <p className="text-sm text-muted-foreground">{getTechnicalName(color.hex)}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={(e) => copyToClipboard(color.hex, index * 2, e)}
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-xl transition-all duration-200 group/btn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
                        <span className="font-mono font-semibold text-foreground text-sm">{color.hex}</span>
                      </div>
                      {copiedIndex === index * 2 ? (
                        <div className="flex items-center gap-1 text-accent">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      )}
                    </button>

                    <button
                      onClick={(e) =>
                        copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, index * 2 + 1, e)
                      }
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-xl transition-all duration-200 group/btn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-3 rounded-full bg-red-400" />
                          <div className="w-1.5 h-3 rounded-full bg-green-400" />
                          <div className="w-1.5 h-3 rounded-full bg-blue-400" />
                        </div>
                        <span className="font-mono text-sm text-foreground">
                          {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                        </span>
                      </div>
                      {copiedIndex === index * 2 + 1 ? (
                        <div className="flex items-center gap-1 text-accent">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-primary font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View shades & mixture</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12 relative z-10 flex flex-col gap-4">
        <div className="max-w-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleSave}
            variant="outline"
            className={`h-14 rounded-2xl gap-2 transition-all ${isSaved ? 'bg-primary/10 border-primary text-primary' : ''}`}
            disabled={isSaved}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? "Saved to History" : "Save to History"}
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="h-14 rounded-2xl gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              Export Tailwind
              <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold">PRO</span>
            </span>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <Button
            onClick={onNewPhoto}
            size="lg"
            className="w-full h-16 rounded-2xl text-base gap-3 bg-foreground text-background hover:bg-foreground/90 shadow-xl group"
          >
            <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Discover New Colors
          </Button>
        </div>
      </div>

      {selectedColor && <ColorDetailModal color={selectedColor} onClose={() => setSelectedColor(null)} />}
    </div>
  )
}
