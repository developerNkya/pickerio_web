export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-6 py-20 max-w-4xl">
            <div className="space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        Privacy <span className="italic text-primary">Policy</span>
                    </h1>
                    <p className="text-muted-foreground italic">Last Updated: February 27, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">1. Information We Collect</h2>
                        <p>
                            We collect minimal information required to provide the Service. This includes images you upload (which are processed locally or temporarily for color extraction) and basic usage analytics.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">2. How We Use Your Information</h2>
                        <p>
                            Information is used solely to provide and improve the color discovery experience. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">3. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">4. Cookies</h2>
                        <p>
                            We use cookies to enhance your experience and analyze Service usage. You can manage cookie preferences through your browser settings.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
