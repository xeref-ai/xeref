
'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

import { AI_MODELS } from '@/constants';

const models = AI_MODELS;

export const ModelsDialog = ({ value, onValueChange, user }: { value: string, onValueChange: (value: string) => void, user: any }) => {
    const { isUltraUser } = useAuth();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-card border-border">
                    <span>{value}</span>
                    <ChevronDown size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select a Model</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {models.map(model => (
                        <Button
                            key={model.id}
                            variant={value === model.id ? 'secondary' : 'ghost'}
                            className="w-full justify-between"
                            onClick={() => onValueChange(model.id)}
                            disabled={model.isPro && !isUltraUser}
                        >
                            <div className="flex items-center">
                                <span>{model.name}</span>
                                {model.isPro && <Star size={14} className="ml-2 text-yellow-500" />}
                            </div>
                            {value === model.id && <Check size={16} />}
                        </Button>
                    ))}
                </div>
                {!isUltraUser && (
                    <DialogFooter>
                        <div className="text-center w-full text-sm text-muted-foreground mt-4">
                            Logged in as {user?.displayName || user?.email || 'Guest'}.
                            <Link href="/pricing" className="underline text-primary ml-1">
                                Upgrade to Pro
                            </Link>
                            {' '}for advanced models.
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
