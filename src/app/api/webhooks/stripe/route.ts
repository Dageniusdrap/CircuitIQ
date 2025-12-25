import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

// Initialize Stripe only if secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
    apiVersion: "2025-12-15.clover",
}) : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

// Type-safe access helper for Stripe subscription
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSubscriptionData(subscription: any) {
    return {
        id: subscription.id as string,
        currentPeriodStart: subscription.current_period_start as number,
        currentPeriodEnd: subscription.current_period_end as number,
        cancelAtPeriodEnd: subscription.cancel_at_period_end as boolean,
        status: subscription.status as string,
        customer: typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer?.id || "") as string,
        priceId: subscription.items?.data?.[0]?.price?.id as string,
    }
}

export async function POST(req: NextRequest) {
    if (!stripe) {
        return NextResponse.json(
            { error: "Stripe is not configured" },
            { status: 500 }
        )
    }

    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature || !webhookSecret) {
        return NextResponse.json(
            { error: "Missing signature or webhook secret" },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
        console.error("Webhook signature verification failed:", error)
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        )
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session
                await handleCheckoutComplete(session)
                break
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object
                await handleSubscriptionUpdate(subscription)
                break
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object
                await handleSubscriptionCanceled(subscription)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Webhook handler error:", error)
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        )
    }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId
    const plan = session.metadata?.plan as "PROFESSIONAL" | "ENTERPRISE"

    if (!userId || !plan) {
        console.error("Missing userId or plan in session metadata")
        return
    }

    const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : null

    if (!subscriptionId || !stripe) {
        console.error("No subscription ID in session or Stripe not configured")
        return
    }

    const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
    const sub = getSubscriptionData(subscriptionResponse)

    await prisma.user.update({
        where: { id: userId },
        data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.priceId,
            stripeCurrentPeriodEnd: new Date(sub.currentPeriodEnd * 1000),
            plan: plan,
        },
    })

    // Create or update subscription record
    await prisma.subscription.upsert({
        where: { userId },
        create: {
            userId,
            plan: plan,
            status: "ACTIVE",
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.priceId,
            stripeCustomerId: sub.customer,
            currentPeriodStart: new Date(sub.currentPeriodStart * 1000),
            currentPeriodEnd: new Date(sub.currentPeriodEnd * 1000),
        },
        update: {
            plan: plan,
            status: "ACTIVE",
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.priceId,
            currentPeriodStart: new Date(sub.currentPeriodStart * 1000),
            currentPeriodEnd: new Date(sub.currentPeriodEnd * 1000),
        },
    })

    console.log(`Subscription activated for user ${userId}: ${plan}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionUpdate(subscriptionData: any) {
    const sub = getSubscriptionData(subscriptionData)

    if (!sub.customer) return

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: sub.customer },
    })

    if (!user) {
        console.error("User not found for subscription update")
        return
    }

    const status = sub.status === "active" ? "ACTIVE" :
        sub.status === "past_due" ? "PAST_DUE" :
            sub.status === "canceled" ? "CANCELED" :
                sub.status === "trialing" ? "TRIALING" : "INACTIVE"

    await prisma.subscription.update({
        where: { userId: user.id },
        data: {
            status,
            currentPeriodStart: new Date(sub.currentPeriodStart * 1000),
            currentPeriodEnd: new Date(sub.currentPeriodEnd * 1000),
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        },
    })

    await prisma.user.update({
        where: { id: user.id },
        data: {
            stripeCurrentPeriodEnd: new Date(sub.currentPeriodEnd * 1000),
        },
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCanceled(subscriptionData: any) {
    const sub = getSubscriptionData(subscriptionData)

    const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: sub.id },
    })

    if (!user) {
        console.error("User not found for canceled subscription")
        return
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            plan: "FREE",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
        },
    })

    await prisma.subscription.update({
        where: { userId: user.id },
        data: {
            plan: "FREE",
            status: "CANCELED",
        },
    })

    console.log(`Subscription canceled for user ${user.id}`)
}
