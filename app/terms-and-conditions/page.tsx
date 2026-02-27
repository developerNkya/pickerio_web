export default function TermsPage() {
    return (
        <div className="container mx-auto px-6 py-20 max-w-4xl">
            <div className="space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        Terms <span className="italic text-primary">&</span> Conditions
                    </h1>
                    <p className="text-muted-foreground italic">Last Updated: February 27, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Pickerio ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">2. Description of Service</h2>
                        <p>
                            Pickerio provides tools for color discovery from images and digital sources. The Service is provided "as is" and "as available."
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">3. User Conduct</h2>
                        <p>
                            You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">4. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are owned by Pickerio and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">5. Limitation of Liability</h2>
                        <p>
                            In no event shall Pickerio be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
