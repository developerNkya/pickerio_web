"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Onboarding } from "@/components/onboarding"
import { HomeScreen } from "@/components/home-screen"
import { ImageSelector } from "@/components/image-selector"
import { ColorPicker } from "@/components/color-picker"
import { ColorResults } from "@/components/color-results"
import { Star, ArrowRight } from "lucide-react"

export type AppScreen = "onboarding" | "home" | "select" | "picker" | "results"

export interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  name: string
  x: number
  y: number
}

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user, useDiscoveryAttempt } = useAuth()
  const router = useRouter()
  const [screen, setScreen] = useState<AppScreen>("onboarding")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [pickedColors, setPickedColors] = useState<ColorInfo[]>([])
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null)
  const [attemptError, setAttemptError] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=/discovery")
    }
  }, [isAuthenticated, authLoading, router])

  // Check if user has seen onboarding before
  useEffect(() => {
    const seen = localStorage.getItem("pickerio-onboarding-seen")
    setHasSeenOnboarding(seen === "true")
    if (seen === "true") {
      setScreen("home")
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("pickerio-onboarding-seen", "true")
    setHasSeenOnboarding(true)
    setScreen("home")
  }

  const handleStartDiscovery = () => {
    if (user?.accountStatus === "trial" && user.attemptsRemaining <= 0) {
      setAttemptError(true)
      return
    }
    setScreen("select")
  }

  // Show nothing while checking auth or localStorage to prevent flash
  if (authLoading || (isAuthenticated && hasSeenOnboarding === null)) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!isAuthenticated) return null

  if (attemptError) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="space-y-6 max-w-md relative z-10 transition-all animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Star className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight">Discovery Limit Reached</h1>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            You&apos;ve reached the end of your trial discoveries. Unlock infinite inspiration with Pickerio Pro.
          </p>
          <div className="flex flex-col gap-4 pt-4">
            <Link href="/pricing">
              <Button size="lg" className="h-14 w-full rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 group">
                Go Pro - $3/month <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="h-14 w-full rounded-2xl text-muted-foreground">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setScreen("picker")
  }

  const handleColorPick = (colors: ColorInfo[]) => {
    // Record the attempt and auto-save the palette
    const success = useDiscoveryAttempt(colors.map(c => c.hex))
    if (!success) {
      setAttemptError(true)
      return
    }
    setPickedColors(colors)
    setScreen("results")
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPickedColors([])
    setScreen("home")
  }

  const handleBack = () => {
    if (screen === "select") setScreen("home")
    else if (screen === "picker") setScreen("select")
    else if (screen === "results") setScreen("picker")
  }

  return (
    <main className="min-h-screen bg-background">
      {screen === "onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}
      {screen === "home" && <HomeScreen onGetStarted={handleStartDiscovery} />}
      {screen === "select" && <ImageSelector onImageSelect={handleImageSelect} onBack={handleBack} />}
      {screen === "picker" && selectedImage && (
        <ColorPicker imageUrl={selectedImage} onColorPick={handleColorPick} onBack={handleBack} />
      )}
      {screen === "results" && <ColorResults colors={pickedColors} onNewPhoto={handleReset} onBack={handleBack} />}
    </main>
  )
}
