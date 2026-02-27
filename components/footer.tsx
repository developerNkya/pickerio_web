import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border/50 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-serif font-bold text-xl">P</span>
                            </div>
                            <span className="text-xl font-serif font-bold tracking-tight text-foreground">
                                Picker<span className="italic text-primary">io</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                            Capture the palette of the world around you. Every moment holds a masterpiece of color.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/discovery" className="hover:text-foreground transition-colors">Discovery Tool</Link></li>
                            <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Pickerio. Artfully crafted colors.</p>
                </div>
            </div>
        </footer>
    )
}
