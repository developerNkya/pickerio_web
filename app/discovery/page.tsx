"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Onboarding } from "@/components/onboarding"
import { HomeScreen } from "@/components/home-screen"
import { ImageSelector } from "@/components/image-selector"
import { ColorPicker } from "@/components/color-picker"
import { ColorResults } from "@/components/color-results"

export type AppScreen = "onboarding" | "home" | "select" | "picker" | "results"

export interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  name: string
  x: number
  y: number
}

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [screen, setScreen] = useState<AppScreen>("onboarding")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [pickedColors, setPickedColors] = useState<ColorInfo[]>([])
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null)

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

  // Show nothing while checking auth or localStorage to prevent flash
  if (authLoading || (isAuthenticated && hasSeenOnboarding === null)) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!isAuthenticated) return null

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setScreen("picker")
  }

  const handleColorPick = (colors: ColorInfo[]) => {
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
      {screen === "home" && <HomeScreen onGetStarted={() => setScreen("select")} />}
      {screen === "select" && <ImageSelector onImageSelect={handleImageSelect} onBack={handleBack} />}
      {screen === "picker" && selectedImage && (
        <ColorPicker imageUrl={selectedImage} onColorPick={handleColorPick} onBack={handleBack} />
      )}
      {screen === "results" && <ColorResults colors={pickedColors} onNewPhoto={handleReset} onBack={handleBack} />}
    </main>
  )
}
