"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/discovery"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await login(email, password)
            router.push(callbackUrl)
        } catch (err) {
            setError("Invalid email or password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-primary/5 animate-blob mix-blend-multiply filter blur-3xl opacity-70" />
                <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-accent/5 animate-blob mix-blend-multiply filter blur-3xl opacity-70" style={{ animationDelay: "2s" }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-background border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
                    <div className="flex flex-col items-center text-center space-y-6 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-primary-foreground font-serif font-bold text-2xl">P</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-serif font-bold tracking-tight">Welcome Back</h1>
                            <p className="text-muted-foreground font-light">Enter your details to continue your discovery.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-12 h-14 rounded-2xl bg-secondary/30 border-none focus-visible:ring-2 focus-visible:ring-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 h-14 rounded-2xl bg-secondary/30 border-none focus-visible:ring-2 focus-visible:ring-primary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl text-lg font-medium shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
