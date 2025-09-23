
import { NextResponse } from 'next/server';
import { db, customInitApp } from '@/lib/firebase-admin';

// Initialize Firebase Admin SDK for this route
customInitApp();

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
  }
  try {
    const newsSnapshot = await db.collection('skool_news').orderBy('createdAt', 'desc').limit(5).get();
    const news = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching Skool news:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
