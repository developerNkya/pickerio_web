"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { History as HistoryIcon, Trash2, Download, Copy, FolderPlus, MoreVertical, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function HistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login?callbackUrl=/history")
        }
    }, [isLoading, isAuthenticated, router])

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const generateTailwind = (colors: string[]) => {
        const config = colors.reduce((acc, color, i) => {
            acc[`color-${i + 1}`] = color
            return acc
        }, {} as any)
        return JSON.stringify({ theme: { extend: { colors: config } } }, null, 2)
    }

    if (isLoading || !isAuthenticated) return null

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-bold tracking-tight">Your Discovery History</h1>
                    <p className="text-muted-foreground font-light">Every artistic hue you&apos;ve ever captured.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-12">
                        <Download className="mr-2 w-4 h-4" /> Export All
                    </Button>
                    <Link href="/discovery">
                        <Button className="rounded-xl h-12 font-bold px-6 shadow-lg shadow-primary/20">
                            <Sparkles className="mr-2 w-4 h-4" /> New Discovery
                        </Button>
                    </Link>
                </div>
            </div>

            {user?.palettes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-secondary/10 rounded-[3rem] border-2 border-dashed border-border/50">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                        <HistoryIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-3">No Discoveries Yet</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Your history is a blank canvas. Start capturing colors from the world around you.
                    </p>
                    <Link href="/discovery">
                        <Button size="lg" className="rounded-2xl px-8">Begin Discovery</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {user?.palettes.map((palette, idx) => (
                        <Card key={palette.id} className="rounded-[2.5rem] overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px] group">
                            <div className="flex h-32 w-full">
                                {palette.colors.map((color, i) => (
                                    <div
                                        key={i}
                                        className="h-full flex-grow relative group/color cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        onClick={() => copyToClipboard(color, idx * 10 + i)}
                                    >
                                        <div className="absolute inset-x-0 bottom-0 py-2 bg-black/20 text-white text-[10px] font-mono text-center opacity-0 group-hover/color:opacity-100 transition-opacity">
                                            {copiedIndex === idx * 10 + i ? "COPIED!" : color}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">{palette.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(palette.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-secondary">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border/50">
                                            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={() => copyToClipboard(generateTailwind(palette.colors), idx)}>
                                                <Copy className="mr-2 w-4 h-4" /> Copy Tailwind CFG
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl cursor-pointer">
                                                <FolderPlus className="mr-2 w-4 h-4" /> Add to Project
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl cursor-pointer text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 w-4 h-4" /> Delete Palette
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-6">
                                    <div className="px-3 py-1 rounded-full bg-secondary/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {palette.projectId ? "Branding" : "General"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
