export default function RefundPage() {
    return (
        <div className="container mx-auto px-6 py-20 max-w-4xl">
            <div className="space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        Refund <span className="italic text-primary">Policy</span>
                    </h1>
                    <p className="text-muted-foreground italic">Last Updated: February 27, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">1. Monthly Subscriptions</h2>
                        <p>
                            Our subscription plan is $3 per month. You may cancel your subscription at any time through your account settings.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">2. Refund Eligibility</h2>
                        <p>
                            Due to the digital nature of our service, we generally do not offer refunds once a subscription period has begun. However, if you experience technical issues that prevent you from using the service, please contact us.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">3. Processing Refunds</h2>
                        <p>
                            Approved refunds will be processed within 5-10 business days and credited back to your original payment method.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">4. Contact Us</h2>
                        <p>
                            For any questions regarding refunds, please reach out to our support team at support@pickerio.art.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
