
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogoSvg } from '@/components/icons';
import { useAuth } from '@/lib/auth';
import { getFirebaseServices } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function WelcomeOrHomePage() {
  const { user, isInitialLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialLoading && user) {
      router.push('/home');
    }
  }, [user, isInitialLoading, router]);



  const handleCTAClick = () => {
    const { analytics } = getFirebaseServices();
    if (analytics) {
      logEvent(analytics, 'hero_cta_clicked');
    }
  };

  if (isInitialLoading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LogoSvg className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <LogoSvg className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">Xeref.ai</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Instant, Multimodal Insights
        </h1>
        <p className="mt-3 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-5 md:max-w-2xl">
          Xeref.ai supercharges your productivity with AI Agents that work 24/7 on your tasks - using the world's smartest AI models.
        </p>

        <div className="mt-10">
          <Button asChild size="lg" onClick={handleCTAClick}>
            <Link href="/login">
              Try Ultra-Search Now
            </Link>
          </Button>
        </div>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center border-t border-border">
        <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Xeref.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
