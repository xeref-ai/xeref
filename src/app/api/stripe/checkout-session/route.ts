
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  if (!auth || !stripe) {
    return new NextResponse('Firebase Admin or Stripe not initialized', { status: 500 });
  }

  try {
    const { priceId, idToken } = await req.json();

    if (!idToken) {
      return new NextResponse('User not authenticated', { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
