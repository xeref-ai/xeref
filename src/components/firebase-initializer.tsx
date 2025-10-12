
'use client';

import { useEffect } from 'react';
import { initializeClientServices } from '@/lib/firebase';

export const FirebaseInitializer = () => {
  useEffect(() => {
    initializeClientServices();
  }, []);

  return null; // This component does not render anything
};
