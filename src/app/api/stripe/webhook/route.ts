
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';
import Stripe from 'stripe';

export async function POST(req: Request) {
  if (!db || !stripe) {
    return new NextResponse('Firebase Admin or Stripe not initialized', { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const planId = subscription.items.data[0].price.id;

    if (userId) {
      await db.collection('users').doc(userId).update({
        plan: planId,
        stripeCustomerId: subscription.customer,
      });
    }
  }

  return new NextResponse('OK', { status: 200 });
}
