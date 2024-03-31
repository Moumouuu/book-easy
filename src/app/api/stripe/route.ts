import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("user/setting");

export async function GET() {
  try {
    const data = await getServerSession();
    const userSession = data?.user;
    const userEmail = data?.user?.email;

    if (!userEmail || !userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.premiumUser.findUnique({
      where: {
        userId: user.id,
      },
    });

    // If the user already has a subscription, redirect to the settings page
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              name: "Bookeazy Premium",
              description:
                "Des réservations, des clients des coéquipiers en illimités ! Ainsi qu'un accès à des statistiques avancées. Et un accès prioritaire au support." ,
            },
            unit_amount: 4990,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
