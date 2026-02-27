"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
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
          <Link href="/discovery">
            <Button variant="default" size="sm" className="rounded-full px-5">
              Join
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
