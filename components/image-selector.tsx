"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, ImageIcon, Sparkles } from "lucide-react"

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void
  onBack: () => void
}

export function ImageSelector({ onImageSelect, onBack }: ImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageSelect(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      onImageSelect(url)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 animate-blob rounded-full" />
        <div
          className="absolute bottom-40 left-5 w-24 h-24 bg-accent/5 animate-blob rounded-full"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <header className="flex items-center gap-4 px-6 py-5 relative z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-10 h-10 bg-secondary/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-serif font-semibold text-foreground">Choose Your Canvas</h1>
          <p className="text-sm text-muted-foreground">Select an image to explore its colors</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6 relative z-10">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full max-w-md aspect-[4/3] flex flex-col items-center justify-center gap-6 rounded-3xl transition-all duration-500 cursor-pointer group ${
            isDragging ? "bg-primary/10 scale-[1.02] border-primary" : "bg-secondary/30 hover:bg-secondary/50"
          }`}
          style={{
            border: "3px dashed",
            borderColor: isDragging ? "oklch(0.45 0.12 30)" : "oklch(0.8 0.02 60)",
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
          </div>

          <div className="text-center space-y-2 px-4">
            <p className="font-serif text-xl font-medium text-foreground">Drop your masterpiece here</p>
            <p className="text-sm text-muted-foreground">or tap to browse your gallery</p>
          </div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none" />
        </div>

        <div className="flex items-center gap-6 w-full max-w-md">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-sm text-muted-foreground font-serif italic">or capture</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-16 rounded-2xl gap-3 text-base bg-transparent border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium">Gallery</div>
              <div className="text-xs text-muted-foreground">Choose existing</div>
            </div>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-16 rounded-2xl gap-3 text-base bg-transparent border-2 border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 group"
            onClick={() => cameraInputRef.current?.click()}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium">Camera</div>
              <div className="text-xs text-muted-foreground">Take a photo</div>
            </div>
          </Button>
        </div>

        {/* Hidden Inputs */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
