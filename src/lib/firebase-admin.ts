import * as admin from 'firebase-admin';

// This prevents us from initializing the app multiple times in a serverless environment
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) {
      throw new Error('Firebase service account key environment variable not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (e: any) {
    // In development, it's okay if this fails, as not all pages may need it.
    // In production, this would be a critical error.
    console.warn(`Firebase Admin SDK initialization failed. This may be expected in a local development environment if the service account key is not set. Some backend features may not work. Error: ${e.message}`);
  }
}

// Export the initialized services, but handle the case where initialization might have failed.
const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
const adminAuth = admin.apps.length > 0 ? admin.auth() : null;

// Placeholder for customInitApp
const customInitApp = () => {
    if (!admin.apps.length) {
        console.warn("customInitApp called but Firebase Admin SDK not initialized.");
    }
};

export { adminDb as db, adminAuth as auth, customInitApp };
