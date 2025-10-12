
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, type Analytics, isSupported } from 'firebase/analytics';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
// ** THE FIX PART 1 **: Explicitly import for side-effects.
import 'firebase/analytics'; 

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

export const isFirebaseEnabled = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isFirebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn('Firebase configuration is incomplete.');
  // @ts-ignore
  auth = {}; 
  // @ts-ignore
  db = {};
}

let analytics: Analytics | undefined;
let perf: FirebasePerformance | undefined;
let isClientInitialized = false;

// ** THE FIX PART 2 **: This function will be called *only* on the client.
export const initializeClientServices = async () => {
  if (isFirebaseEnabled && typeof window !== 'undefined' && !isClientInitialized) {
    isClientInitialized = true;
    await enableIndexedDbPersistence(db).catch(console.warn);
    if (await isSupported()) {
      // ** THE FIX PART 3 **: Only call getAnalytics() inside the client initializer.
      analytics = getAnalytics(app);
      perf = getPerformance(app);
    }
  }
};

// ** THE FIX PART 4 **: A "getter" to ensure components only access analytics after initialization.
export const getFirebaseServices = () => ({
  analytics,
  perf,
});

export { app, auth, db };
