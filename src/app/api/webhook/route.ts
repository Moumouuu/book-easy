import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.paymentIntents.retrieve(
      session.payment_intent as string
    );

    if (!session?.metadata?.userEmail) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await prismadb.premiumUser.create({
      data: {
        userId: session?.metadata.userEmail as string,
        stripeCustomerId: subscription.customer as string,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
