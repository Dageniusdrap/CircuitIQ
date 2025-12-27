import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { PricingPlans } from "@/components/pricing/pricing-plans"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
    title: "Pricing | CircuitIQ",
    description: "Choose the perfect plan for your wiring diagnostics needs",
}

export default async function PricingPage() {
    const session = await auth()

    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-16">
                <div className="container mx-auto px-4 py-16 max-w-7xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight text-white">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Choose the plan that fits your needs. Upgrade or downgrade anytime.
                        </p>
                    </div>

                    <PricingPlans currentPlan={session?.user?.plan} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
