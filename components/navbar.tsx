"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User, Menu, Palette, History, LayoutDashboard, Zap, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()

  const NavLinks = () => (
    <>
      <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
      <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
      {isAuthenticated && (
        <>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/history" className="hover:text-foreground transition-colors">History</Link>
          <Link href="/mixer" className="hover:text-foreground transition-colors">Mixer</Link>
        </>
      )}
      <Link href="/discovery" className="hover:text-foreground transition-colors">Discovery</Link>
    </>
  )

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <NavLinks />
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              {user?.accountStatus === "trial" && (
                <Link href="/pricing">
                  <Button variant="default" size="sm" className="rounded-full px-4 h-8 bg-gradient-to-r from-primary to-accent border-0 text-primary-foreground text-xs shadow-md">
                    <Zap className="w-3 h-3 mr-1 fill-current" /> Upgrade
                  </Button>
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{user?.email}</span>
              </Link>
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
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="rounded-full px-5 shadow-lg shadow-primary/10">
                  Join
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="font-serif">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 text-lg font-medium">
                  <SheetClose asChild><Link href="/">Home</Link></SheetClose>
                  <SheetClose asChild><Link href="/pricing">Pricing</Link></SheetClose>
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild><Link href="/dashboard" className="flex items-center gap-3"><LayoutDashboard className="w-5 h-5" /> Dashboard</Link></SheetClose>
                      <SheetClose asChild><Link href="/history" className="flex items-center gap-3"><History className="w-5 h-5" /> History</Link></SheetClose>
                      <SheetClose asChild><Link href="/mixer" className="flex items-center gap-3"><Zap className="w-5 h-5" /> Color Mixer</Link></SheetClose>
                      <SheetClose asChild><Link href="/profile" className="flex items-center gap-3"><User className="w-5 h-5" /> Profile</Link></SheetClose>
                      <SheetClose asChild><Link href="/discovery" className="flex items-center gap-3"><Sparkles className="w-5 h-5" /> Discovery</Link></SheetClose>
                      <div className="pt-4 mt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5"
                          onClick={logout}
                        >
                          <LogOut className="w-5 h-5 mr-3" /> Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild><Link href="/discovery">Discovery</Link></SheetClose>
                      <div className="pt-4 mt-4 border-t border-border flex flex-col gap-4">
                        <SheetClose asChild>
                          <Link href="/login">
                            <Button variant="outline" className="w-full h-12 rounded-xl">Login</Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/register">
                            <Button className="w-full h-12 rounded-xl">Join Now</Button>
                          </Link>
                        </SheetClose>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
