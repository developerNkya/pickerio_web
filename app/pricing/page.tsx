import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 bg-background relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 -left-20 w-80 h-80 bg-primary/5 animate-blob" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/4 -right-20 w-64 h-64 bg-accent/5 animate-blob" style={{ animationDelay: "3s" }} />
            </div>

            <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        Elevate Your <span className="italic text-primary">Art</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                        Simple, transparent pricing for infinite color discovery and palette creation.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:flex justify-center items-center">
                    <div className="bg-card border border-border/50 rounded-3xl p-10 shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-primary/10 hover:-translate-y-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 max-w-sm w-full">
                        <div className="space-y-2 mb-8">
                            <h3 className="text-2xl font-serif font-bold">Premium</h3>
                            <p className="text-muted-foreground text-sm">Full access to Pickerio discovery</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-serif font-bold">$3</span>
                            <span className="text-muted-foreground ml-2">/ month</span>
                        </div>

                        <ul className="space-y-4 mb-10 text-left">
                            <li className="flex items-center gap-3 text-sm">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span>Unlimited color picking from images</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span>Export palettes in multiple formats</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span>Advanced color details (CMYK, HSL)</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span>Save and sync your favorite palettes</span>
                            </li>
                        </ul>

                        <Link href="/discovery">
                            <Button className="w-full h-14 rounded-2xl text-lg font-medium shadow-lg shadow-primary/20">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground italic">
                    Try it out first. No commitment required.
                </p>
            </div>
        </div>
    )
}
