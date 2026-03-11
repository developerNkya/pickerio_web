"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User } from "lucide-react"

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-primary-foreground font-serif font-bold text-xl">P</span>
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-foreground">
            Picker<span className="italic text-primary">io</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/discovery" className="hover:text-foreground transition-colors">Discovery</Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="rounded-full px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="rounded-full px-5 shadow-lg shadow-primary/10">
                  Join
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
