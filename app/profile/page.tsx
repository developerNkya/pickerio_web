"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Mail, ShieldCheck, CreditCard, LogOut, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { user, logout, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login?callbackUrl=/profile")
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
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Account Settings</h1>
                <p className="text-muted-foreground font-light">Manage your profile and subscription preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation - Sidebar style for larger screens */}
                <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start rounded-xl h-12 bg-primary/5 text-primary border-primary/20">
                        <User className="mr-3 w-4 h-4" /> Profile Info
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-xl h-12 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all">
                        <CreditCard className="mr-3 w-4 h-4" /> Billing & Usage
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-xl h-12 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all">
                        <ShieldCheck className="mr-3 w-4 h-4" /> Security
                    </Button>
                    <div className="pt-8">
                        <Button onClick={logout} variant="ghost" className="w-full justify-start rounded-xl h-12 text-destructive hover:bg-destructive/5 hover:text-destructive transition-all">
                            <LogOut className="mr-3 w-4 h-4" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden pb-4">
                        <CardHeader className="bg-secondary/10 border-b border-border/50 mb-6 py-8">
                            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground text-3xl font-serif font-bold mx-auto md:mx-0 shadow-xl shadow-primary/20">
                                {user?.email[0].toUpperCase()}
                            </div>
                            <div className="text-center md:text-left pt-4">
                                <CardTitle className="text-2xl font-serif">{user?.email}</CardTitle>
                                <CardDescription>Artistic Member since 2024</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</p>
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <Mail className="w-4 h-4 text-primary" /> {user?.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</p>
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <ShieldCheck className="w-4 h-4 text-accent" />
                                        {user?.status === "trial" ? "Free Trial" : "Pro Subscriber"}
                                    </div>
                                </div>
                            </div>

                            {user?.status === "trial" && (
                                <div className="mt-8 p-6 rounded-3xl bg-accent text-accent-foreground relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
                                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <Zap className="w-5 h-5" /> Limited Trial
                                            </h3>
                                            <p className="text-accent-foreground/80 text-sm max-w-xs">
                                                You have <strong>{user?.attemptsRemaining} attempts</strong> left. Upgrade now for unlimited discoveries.
                                            </p>
                                        </div>
                                        <Link href="/pricing" className="shrink-0 w-full sm:w-auto">
                                            <Button className="w-full sm:w-auto bg-white text-accent hover:bg-white/90 rounded-2xl h-12 px-6 font-bold shadow-lg transition-all active:scale-95 group">
                                                Upgrade $3 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
