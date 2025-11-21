import React from 'react';
import { cn } from '@/lib/utils';

export const BugraKarsliLogo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("bg-gray-500 flex items-center justify-center text-white font-bold", className)}>
            BK
        </div>
    );
};
