"use client"

import { Button } from "@/components/ui/button"

interface HomeScreenProps {
  onGetStarted: () => void
}

export function HomeScreen({ onGetStarted }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 animate-blob"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/4 -right-16 w-48 h-48 bg-accent/10 animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 -left-10 w-40 h-40 bg-chart-3/10 animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute -bottom-10 right-1/4 w-56 h-56 bg-chart-4/10 animate-blob"
          style={{ animationDelay: "6s" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 max-w-md text-center relative z-10">
        <div className="relative animate-float">
          <div className="relative w-32 h-32">
            {/* Palette shape */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="palette-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.95 0.02 60)" />
                  <stop offset="100%" stopColor="oklch(0.88 0.03 40)" />
                </linearGradient>
              </defs>
              <ellipse
                cx="50"
                cy="50"
                rx="45"
                ry="40"
                fill="url(#palette-gradient)"
                stroke="oklch(0.45 0.12 30)"
                strokeWidth="2"
              />
              {/* Paint dots */}
              <circle cx="30" cy="35" r="8" fill="#E63946" />
              <circle cx="50" cy="28" r="7" fill="#F4A261" />
              <circle cx="70" cy="35" r="8" fill="#2A9D8F" />
              <circle cx="75" cy="55" r="7" fill="#264653" />
              <circle cx="65" cy="70" r="6" fill="#E9C46A" />
              {/* Thumb hole */}
              <ellipse
                cx="35"
                cy="60"
                rx="10"
                ry="8"
                fill="oklch(0.98 0.01 60)"
                stroke="oklch(0.45 0.12 30)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-foreground">
            Picker<span className="italic text-primary">io</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Capture the palette of the world around you. Every moment holds a masterpiece of color.
          </p>
        </div>

        <div className="relative w-full max-w-xs h-24 mt-4">
          {[
            { color: "#E63946", x: "5%", y: "10%", size: "w-14 h-14", rotate: "-12deg", delay: "0s" },
            { color: "#F4A261", x: "22%", y: "35%", size: "w-12 h-12", rotate: "8deg", delay: "0.5s" },
            { color: "#E9C46A", x: "42%", y: "5%", size: "w-16 h-16", rotate: "-5deg", delay: "1s" },
            { color: "#2A9D8F", x: "60%", y: "30%", size: "w-13 h-13", rotate: "15deg", delay: "1.5s" },
            { color: "#264653", x: "80%", y: "10%", size: "w-14 h-14", rotate: "-8deg", delay: "2s" },
          ].map((swatch, i) => (
            <div
              key={i}
              className={`absolute ${swatch.size} rounded-2xl shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl cursor-pointer`}
              style={{
                backgroundColor: swatch.color,
                left: swatch.x,
                top: swatch.y,
                transform: `rotate(${swatch.rotate})`,
                animationDelay: swatch.delay,
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <span className="px-4 py-2 bg-secondary/50 rounded-full border border-border/50">Snap a photo</span>
          <span className="px-4 py-2 bg-secondary/50 rounded-full border border-border/50">Touch to discover</span>
          <span className="px-4 py-2 bg-secondary/50 rounded-full border border-border/50">Save your palette</span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 relative z-10">
        <Button
          onClick={onGetStarted}
          size="lg"
          className="w-full h-16 text-lg font-medium rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 bg-foreground text-background hover:bg-foreground/90"
        >
          Begin Your Discovery
        </Button>
        <p className="text-center text-sm text-muted-foreground italic">No account needed. Simply explore.</p>
      </div>
    </div>
  )
}
