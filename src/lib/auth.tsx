
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  isUltraUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ULTRA_USERS = [
    'bugrakarsli@gmail.com',
    'bugra@bugrakarsli.com',
];

async function syncUser(user: User) {
    try {
        const idToken = await user.getIdToken();
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
        });
    } catch (error) {
        console.error("Error syncing user:", error);
        // Optionally, you could add a toast notification here
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUltraUser, setIsUltraUser] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
        setIsInitialLoading(false);
        return;
    }

    let isMounted = true;

    getRedirectResult(auth)
      .then(result => {
        if (isMounted && result && result.user) {
          toast({ title: "Signed in successfully!", description: `Welcome ${result.user.displayName || result.user.email}!` });
          syncUser(result.user);
        }
      })
      .catch(error => {
        console.error("Error processing redirect result:", error);
        toast({
            title: "Sign-in Error",
            description: "An error occurred during sign-in. Please try again.",
            variant: "destructive",
        });
      })
      .finally(() => {
         if (isMounted) {
            // This listener will ensure we have the final auth state.
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if (isMounted) {
                    setUser(currentUser);
                    setIsUltraUser(!!currentUser?.email && ULTRA_USERS.includes(currentUser.email));
                    setIsInitialLoading(false);
                }
            });

            return () => {
              isMounted = false;
              unsubscribe();
            };
         }
      });
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Effect for handling all redirection logic based on auth state
  useEffect(() => {
    if (!isInitialLoading) {
      const publicPaths = ['/', '/login', '/pricing', '/terms', '/privacy', '/hiring', '/auth/action'];
      const isPublicPath = publicPaths.some(p => pathname.startsWith(p));

      if (!user && !isPublicPath) {
        router.push('/login');
      }
    }
  }, [user, isInitialLoading, pathname, router]);

  const value = { user, isLoading: isInitialLoading, isInitialLoading, isUltraUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
