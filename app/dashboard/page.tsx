"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Palette, History, ArrowRight, Star, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login?callbackUrl=/dashboard")
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-bold tracking-tight">Bonjour, {user?.email.split("@")[0]}</h1>
                    <p className="text-muted-foreground font-light">Welcome back to your artistic hub.</p>
                </div>
                <Link href="/discovery">
                    <Button size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        <Sparkles className="mr-2 w-5 h-5" /> New Discovery
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Status Card */}
                <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-primary" /> Account Status
                        </CardTitle>
                        <CardDescription>Your current subscription level.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold tracking-wide text-primary uppercase">
                            {user?.accountStatus === "trial" ? "Free Trial" : "Pro Subscriber"}
                        </div>
                        {user?.accountStatus === "trial" ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Attempts Remaining: {user?.attemptsRemaining}/3</p>
                                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${(user?.attemptsRemaining || 0) * 33.3}%` }}
                                    />
                                </div>
                                <Link href="/pricing" className="block mt-4">
                                    <Button variant="outline" className="w-full rounded-xl group">
                                        Upgrade to Pro <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Unlimited artistic discoveries unlocked.</p>
                                <div className="flex gap-2 pt-2">
                                    <div className="flex-grow p-4 rounded-2xl bg-background border border-border/50 text-center">
                                        <p className="text-2xl font-serif font-bold">{user?.palettes.length}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Palettes</p>
                                    </div>
                                    <div className="flex-grow p-4 rounded-2xl bg-background border border-border/50 text-center">
                                        <p className="text-2xl font-serif font-bold">{user?.projects.length}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Projects</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Discovery Card */}
                <Card className="rounded-[2.5rem] border-border/50 shadow-sm md:col-span-2 overflow-hidden bg-background relative group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5 text-accent" /> {user?.palettes.length ? "Recent Discovery" : "Start Your Journey"}
                            </CardTitle>
                            <CardDescription>{user?.palettes.length ? "Pick up where you left off." : "The world is full of color waiting to be captured."}</CardDescription>
                        </div>
                        {user?.palettes.length ? (
                            <Link href="/history">
                                <Button variant="ghost" size="sm" className="rounded-full">View All</Button>
                            </Link>
                        ) : null}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        {user?.palettes.length ? (
                            <div className="w-full space-y-6">
                                <div className="flex h-20 rounded-2xl overflow-hidden shadow-lg">
                                    {user.palettes[0].colors.map((c, i) => (
                                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="font-serif font-bold text-lg">{user.palettes[0].name}</p>
                                    <Link href="/discovery">
                                        <Button variant="outline" className="rounded-xl">New discovery</Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground">
                                    <History className="w-8 h-8" />
                                </div>
                                <div className="max-w-xs">
                                    <p className="text-sm text-muted-foreground italic">
                                        You haven&apos;t started any discoveries yet.
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Highlight Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/50 group hover:border-primary/30 transition-all">
                    <h3 className="text-xl font-serif font-bold mb-3 flex items-center justify-between">
                        Saved History
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-sans font-bold uppercase tracking-widest">Pro</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        Access every palette you&apos;ve ever discovered. Organized, titled, and ready for use.
                    </p>
                    <Link href={user?.accountStatus === "subscribed" ? "/history" : "/pricing"}>
                        <Button variant="ghost" className="px-0 text-primary h-auto hover:bg-transparent">
                            {user?.accountStatus === "subscribed" ? "View History" : "Unlock History"} <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/50 group hover:border-primary/30 transition-all">
                    <h3 className="text-xl font-serif font-bold mb-3 flex items-center justify-between">
                        Export Center
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-sans font-bold uppercase tracking-widest">Pro</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        Export to Tailwind, CSS, SCSS, or Figma. One click to bring your discovery into your workflow.
                    </p>
                    <Link href={user?.accountStatus === "subscribed" ? "/history" : "/pricing"}>
                        <Button variant="ghost" className="px-0 text-primary h-auto hover:bg-transparent">
                            {user?.accountStatus === "subscribed" ? "Export Tools" : "Unlock Export"} <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/50 group hover:border-primary/30 transition-all">
                    <h3 className="text-xl font-serif font-bold mb-3 flex items-center justify-between">
                        Custom Projects
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-sans font-bold uppercase tracking-widest">Pro</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        Group your palettes by project. Perfect for interior design, branding, or digital art.
                    </p>
                    <Link href={user?.accountStatus === "subscribed" ? "/projects" : "/pricing"}>
                        <Button variant="ghost" className="px-0 text-primary h-auto hover:bg-transparent">
                            {user?.accountStatus === "subscribed" ? "View Projects" : "Unlock Projects"} <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
