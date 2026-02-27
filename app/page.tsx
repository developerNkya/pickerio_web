"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Palette, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 animate-blob mix-blend-multiply filter blur-3xl opacity-70" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-accent/5 animate-blob mix-blend-multiply filter blur-3xl opacity-70" style={{ animationDelay: "2s" }} />
          <div className="absolute -bottom-40 left-1/2 w-[400px] h-[400px] bg-chart-3/5 animate-blob mix-blend-multiply filter blur-3xl opacity-70" style={{ animationDelay: "4s" }} />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium tracking-wide text-primary">
              <Sparkles className="w-3 h-3" />
              <span>EXPERIENCE THE ART OF COLOR</span>
            </div>

            <div className="space-y-6 max-w-4xl">
              <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
                Capture the <span className="italic text-primary">Soul</span> of Every Hue
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                Pickerio transforms your surroundings into a curated palette of inspiration. Designed for artists, by code.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/discovery">
                <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-medium shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 w-full sm:w-auto">
                  Begin Discovery <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-medium w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Floating swatches mockup */}
            <div className="relative w-full max-w-2xl h-48 mt-12 grid grid-cols-4 md:grid-cols-6 gap-4">
              {[
                { color: "oklch(0.65 0.18 30)", delay: "0s", rotate: "-6deg" },
                { color: "oklch(0.7 0.16 150)", delay: "0.4s", rotate: "4deg" },
                { color: "oklch(0.75 0.14 60)", delay: "0.8s", rotate: "-2deg" },
                { color: "oklch(0.6 0.2 280)", delay: "1.2s", rotate: "8deg" },
                { color: "oklch(0.7 0.18 200)", delay: "1.6s", rotate: "-4deg" },
                { color: "oklch(0.45 0.12 30)", delay: "2.0s", rotate: "2deg" },
              ].map((swatch, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl shadow-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: swatch.color,
                    transform: `rotate(${swatch.rotate})`,
                    animation: `float 6s ease-in-out infinite ${swatch.delay}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 rounded-3xl bg-background border border-border/50 shadow-sm transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold">Artistic Precision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Advanced algorithms that capture more than just pixels—they capture the emotion of color.
              </p>
            </div>

            <div className="space-y-4 p-8 rounded-3xl bg-background border border-border/50 shadow-sm transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-bold">Instant Creation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                From photo to palette in seconds. Export your discoveries directly to your favorite design tools.
              </p>
            </div>

            <div className="space-y-4 p-8 rounded-3xl bg-background border border-border/50 shadow-sm transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-chart-4/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-serif font-bold">Infinite Inspiration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Explore a world of color without boundaries. No limits on how many palettes you can create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <div className="bg-foreground text-background rounded-[3rem] p-12 md:p-20 space-y-10 relative overflow-hidden shadow-2xl">
            {/* Decorative stroke */}
            <div className="absolute top-0 right-0 w-64 h-64 border-8 border-background/10 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                Ready to See the World Differently?
              </h2>
              <p className="text-xl text-background/70 font-light max-w-2xl mx-auto">
                Join the artistic community and start your color discovery journey today.
              </p>
            </div>

            <Link href="/discovery">
              <Button size="lg" className="h-16 px-12 rounded-2xl text-lg font-medium bg-background text-foreground hover:bg-background/90 transition-all active:scale-95 shadow-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
