
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseEnabled =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;
let perf: FirebasePerformance | undefined;
let appCheck: AppCheck | undefined;

if (isFirebaseEnabled) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);

  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    perf = getPerformance(app);

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      });
    }
  }
}

// @ts-ignore
export { app, auth, db, analytics, perf, appCheck };
