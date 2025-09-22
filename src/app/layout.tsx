
import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/lib/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://xeref.ai'),
  title: 'Xeref.ai - Advanced AI Platform by Bugra Karsli',
  description: 'Xeref.ai is an innovative AI platform created by Bugra Karsli and the Xerenity Society team. Experience next-generation AI solutions.',
  keywords: ['Xeref.ai', 'Bugra Karsli', 'AI platform', 'artificial intelligence', 'Xerenity Society', 'machine learning'],
  alternates: {
    canonical: 'https://xeref.ai',
  },
  openGraph: {
    title: 'Xeref.ai - Revolutionary AI Platform',
    description: 'Discover Xeref.ai, the cutting-edge AI platform built by Bugra Karsli and Xerenity Society.',
    url: 'https://xeref.ai',
    images: [
      {
        url: '/assets/xeref-ai-platform.jpg',
        width: 1200,
        height: 630,
        alt: 'Xeref.ai Platform',
      },
    ],
    siteName: 'Xeref.ai',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@XerefAI',
    creator: '@BugraKarsli1',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <TooltipProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
        
        {/* Meta Pixel Script - Injected for Production Deployment */}
        <Script id="meta-pixel-script" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https'://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
               src="https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1"
          />
        </noscript>

      </body>
    </html>
  );
};

export default RootLayout;
