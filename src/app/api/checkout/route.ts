import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

// Initialize Stripe only if secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
    apiVersion: "2025-12-15.clover",
}) : null

const PRICE_IDS = {
    PROFESSIONAL_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    PROFESSIONAL_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    ENTERPRISE_MONTHLY: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    ENTERPRISE_YEARLY: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
}

export async function POST(req: NextRequest) {
    try {
        if (!stripe) {
            return NextResponse.json(
                { error: "Stripe is not configured" },
                { status: 500 }
            )
        }

        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { priceId, plan, isYearly } = body

        // Get or create Stripe customer
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        let stripeCustomerId = user.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: {
                    userId: user.id,
                },
            })
            stripeCustomerId = customer.id

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId },
            })
        }

        // Determine the price ID
        let selectedPriceId = priceId
        if (!selectedPriceId) {
            if (plan === "PROFESSIONAL") {
                selectedPriceId = isYearly ? PRICE_IDS.PROFESSIONAL_YEARLY : PRICE_IDS.PROFESSIONAL_MONTHLY
            } else if (plan === "ENTERPRISE") {
                selectedPriceId = isYearly ? PRICE_IDS.ENTERPRISE_YEARLY : PRICE_IDS.ENTERPRISE_MONTHLY
            }
        }

        if (!selectedPriceId) {
            return NextResponse.json(
                { error: "Invalid plan selected" },
                { status: 400 }
            )
        }

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: selectedPriceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&plan=${plan}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
            metadata: {
                userId: user.id,
                plan: plan,
            },
            subscription_data: {
                metadata: {
                    userId: user.id,
                    plan: plan,
                },
            },
            allow_promotion_codes: true,
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
        console.error("Checkout error:", error)
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        )
    }
}
