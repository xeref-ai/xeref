
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  if (!db) {
    return NextResponse.json({ status: 'error', error: 'Firebase Admin not initialized' }, { status: 500 });
  }

  try {
    // Check Firestore connection by getting a simple document
    await db.collection('health_check').doc('status').get();
    
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ status: 'error', error: 'Could not connect to Firebase' }, { status: 500 });
  }
}
