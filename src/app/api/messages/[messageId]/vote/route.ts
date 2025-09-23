
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  if (!db) {
    return new NextResponse('Firebase Admin not initialized', { status: 500 });
  }

  try {
    const { messageId, vote } = await req.json();

    if (!messageId || !vote) {
      return new NextResponse('Message ID and vote are required', { status: 400 });
    }

    await db.collection('messages').doc(messageId).update({
      vote,
    });
    
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error voting on message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
