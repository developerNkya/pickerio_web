"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Minus, RotateCcw, Save, Trash2, ArrowRight, Palette } from "lucide-react"

interface MixerColor {
    hex: string
    weight: number
}

export default function MixerPage() {
    const { isAuthenticated, isLoading, savePalette, user } = useAuth()
    const isTrialEnded = user?.accountStatus === "trial" && user.attemptsRemaining <= 0;
    const [colors, setColors] = useState<MixerColor[]>([
        { hex: "#3b82f6", weight: 50 },
        { hex: "#ef4444", weight: 50 },
    ])
    const [resultColor, setResultColor] = useState("#95639d")
    const [isMixing, setIsMixing] = useState(false)

    const mixColors = (colorList: MixerColor[]) => {
        setIsMixing(true)

        // Simple hex to RGB conversion
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 }
        }

        const rgbToHex = (r: number, g: number, b: number) => {
            return "#" + [r, g, b].map(x => {
                const hex = Math.round(x).toString(16)
                return hex.length === 1 ? "0" + hex : hex
            }).join("")
        }

        let totalWeight = 0
        let r = 0, g = 0, b = 0

        colorList.forEach(c => {
            const rgb = hexToRgb(c.hex)
            r += rgb.r * c.weight
            g += rgb.g * c.weight
            b += rgb.b * c.weight
            totalWeight += c.weight
        })

        const finalHex = rgbToHex(r / totalWeight, g / totalWeight, b / totalWeight)

        // Simulate mixing animation delay
        setTimeout(() => {
            setResultColor(finalHex)
            setIsMixing(false)
        }, 300)
    }

    useEffect(() => {
        mixColors(colors)
    }, [colors])

    const addColor = () => {
        if (colors.length < 5) {
            const newColors = [...colors, { hex: "#fbbf24", weight: 20 }]
            setColors(newColors)
        }
    }

    const removeColor = (index: number) => {
        if (colors.length > 2) {
            const newColors = colors.filter((_, i) => i !== index)
            setColors(newColors)
        }
    }

    const updateWeight = (index: number, delta: number) => {
        const newColors = [...colors]
        newColors[index].weight = Math.max(1, Math.min(100, newColors[index].weight + delta))
        setColors(newColors)
    }

    const updateHex = (index: number, hex: string) => {
        const newColors = [...colors]
        newColors[index].hex = hex
        setColors(newColors)
    }

    const handleSave = () => {
        savePalette([resultColor], "Mixed Discovery")
        alert("Result color saved to History!")
    }

    if (isLoading) return null

    return (
        <div className="relative">
            {isTrialEnded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-background/60 backdrop-blur-md rounded-[2.5rem]">
                    <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Palette className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold tracking-tight mb-4">Mixer Locked</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Your trial attempts have run out. Upgrade to Pro to unlock the Artistic Color Mixer and unlimited palettes.</p>
                    <Link href="/pricing" className="pointer-events-auto">
                        <Button size="lg" className="rounded-2xl h-14 bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Upgrade to Pro - $3/month
                        </Button>
                    </Link>
                </div>
            )}
            <div className={`container mx-auto px-6 py-12 max-w-5xl transition-all duration-700 ${isTrialEnded ? 'pointer-events-none opacity-20 blur-sm' : ''}`}>
                <div className="flex flex-col mb-12 space-y-4">
                    <h1 className="text-4xl font-serif font-bold tracking-tight">Artistic Color Mixer</h1>
                    <p className="text-muted-foreground font-light text-xl">Combine different hues live to form a unique resulting color.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Input Colors Area */}
                    <div className="space-y-6">
                        <Card className="rounded-[2.5rem] border-border/50 shadow-xl overflow-hidden bg-background/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Source Hues</CardTitle>
                                <CardDescription>Adjust weights and colors to blend them.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {colors.map((color, index) => (
                                    <div key={index} className="flex items-center gap-6 group animate-in slide-in-from-left duration-300">
                                        <div
                                            className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/20 transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: color.hex }}
                                        >
                                            <input
                                                type="color"
                                                value={color.hex}
                                                onChange={(e) => updateHex(index, e.target.value)}
                                                className="opacity-0 w-full h-full cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex-grow space-y-3">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span>Weight</span>
                                                <span className="text-primary">{color.weight}%</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateWeight(index, -5)}>
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <div className="flex-grow h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${color.weight}%` }} />
                                                </div>
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateWeight(index, 5)}>
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeColor(index)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5 group"
                                    onClick={addColor}
                                    disabled={colors.length >= 5}
                                >
                                    <Plus className="mr-2 w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Color
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Result Area */}
                    <div className="lg:sticky lg:top-24 flex flex-col items-center">
                        <div className="relative w-full aspect-square max-w-[400px]">
                            {/* Artistic circles animation */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className={`w-full h-full rounded-full transition-all duration-700 ease-out shadow-2xl ${isMixing ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}
                                    style={{
                                        backgroundColor: resultColor,
                                        boxShadow: `0 0 80px ${resultColor}40`
                                    }}
                                />

                                {/* Orbital circles for effect */}
                                {colors.map((c, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-12 h-12 rounded-full border-4 border-white shadow-lg transition-all duration-[1.5s] ease-in-out"
                                        style={{
                                            backgroundColor: c.hex,
                                            transform: `rotate(${i * (360 / colors.length)}deg) translate(${isMixing ? '60px' : '160px'}) rotate(-${i * (360 / colors.length)}deg)`,
                                            opacity: isMixing ? 1 : 0.4
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white mix-blend-difference">
                                <span className="text-4xl font-mono font-bold uppercase tracking-tighter">{resultColor}</span>
                                <span className="text-sm uppercase tracking-[0.2em] font-light mt-2">Resulting Hue</span>
                            </div>
                        </div>

                        <div className="mt-12 w-full max-w-[400px] flex flex-col gap-4">
                            <Button size="lg" className="h-16 rounded-[2rem] text-lg font-bold shadow-2xl hover:scale-[1.02] active:scale-95 transition-all" onClick={handleSave}>
                                <Save className="mr-3 w-6 h-6" /> Save Mixed discovery
                            </Button>
                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-grow h-14 rounded-2xl" onClick={() => setColors([{ hex: "#3b82f6", weight: 50 }, { hex: "#ef4444", weight: 50 }])}>
                                    <RotateCcw className="mr-2 w-4 h-4" /> Reset
                                </Button>
                                <Link href="/discovery" className="flex-grow">
                                    <Button variant="secondary" className="w-full h-14 rounded-2xl group">
                                        New Photo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
