
'use client';

import React, { FormEvent, useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Plus,
    ArrowUp,
    Target,
    MessageSquare,
    AudioLines,
    Paperclip,
    Search,
    Loader2,
    X,
    FileText,
    ThumbsUp,
    ThumbsDown,
    Copy,
    Edit,
    Ban,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ModelsDialog } from '@/components/models-dialog';
import { type User } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogoSvg, SparkleIcon } from '@/components/icons';
import { useAuth } from '@/lib/auth';
import { TodayFocusPanel } from '@/components/today-focus-panel';
import { CaseStudyCarousel } from '@/components/case-study-carousel';
import { getFirebaseServices } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

type AppSettings = {
    model: string;
    temperature: number;
    systemPrompt: string;
    useWebSearch: boolean;
    darkMode: boolean;
    notifications: boolean;
    privacyMode: boolean;
};

const OnboardingPopup = () => (
    <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <h4 className="font-bold">Introducing Smart Voice Input!</h4>
        <p className="text-sm mt-2">
            When using Voice Input, simply describe what you want to add - Xeref will automatically do the name/context split.
        </p>
    </div>
);

const StopIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="white" />
        <rect x="9" y="9" width="6" height="6" fill="black" />
    </svg>
);

export const CenterContent = ({
    user,
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    handleSendMessage,
    handleNewChat,
    chatMode,
    setChatMode,
    settings,
    setSettings,
    chatInputRef,
    filePreview,
    setFilePreview,
    attachedFile,
    setAttachedFile,
    isFocusModalOpen,
    setIsFocusModalOpen
}: {
    user: User | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    handleSendMessage: (message: Message) => void;
    handleNewChat: () => void;
    chatMode: 'chat' | 'agent' | 'ultra-search';
    setChatMode: (mode: 'chat' | 'agent' | 'ultra-search') => void;
    settings: AppSettings;
    setSettings: (settings: AppSettings) => void;
    chatInputRef: React.RefObject<HTMLTextAreaElement>;
    filePreview: string | null;
    setFilePreview: (preview: string | null) => void;
    attachedFile: File | null;
    setAttachedFile: (file: File | null) => void;
    isFocusModalOpen: boolean;
    setIsFocusModalOpen: (isOpen: boolean) => void;
}) => {
    const { toast } = useToast();
    const router = useRouter();
    const { isUltraUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>('GPT 4o');

    useEffect(() => {
        setIsClient(true);
        const hasSeenOnboarding = localStorage.getItem('hasSeenVoiceOnboarding');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    const handleAddToChat = (jsonString: string) => {
        setInput(jsonString);
        setIsFocusModalOpen(false);
    };

    const handleCopy = (text: string, messageId: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                description: "Message copied to clipboard.",
            });
            setCopiedMessageId(messageId);
            setTimeout(() => {
                setCopiedMessageId(null);
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast({
                title: "Error",
                description: "Could not copy message.",
                variant: "destructive",
            });
        });
    };

    const handleVote = async (messageId: string, vote: 'up' | 'down') => {
        setMessages(messages.map(msg =>
            msg.id === messageId
                ? { ...msg, votes: (msg.votes || 0) + (vote === 'up' ? 1 : -1) }
                : msg
        ));

        try {
            const token = await user?.getIdToken();
            await fetch(`/api/messages/${messageId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ vote }),
            });
        } catch (error) {
            console.error("Error submitting vote:", error);
            setMessages(messages.map(msg =>
                msg.id === messageId
                    ? { ...msg, votes: (msg.votes || 0) - (vote === 'up' ? 1 : -1) }
                    : msg
            ));
            toast({
                title: "Error",
                description: "Could not save your vote.",
                variant: "destructive",
            });
        }
    };

    const handleToggleListening = useCallback(async () => {
        if (!isClient) return;

        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast({ title: "Voice Input Not Supported", variant: "destructive" });
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            if (event.error !== 'no-speech') {
                toast({ title: "Voice Input Error", description: event.error, variant: "destructive" });
            }
        };
        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
            setInput(transcript);
        };
        recognition.start();
    }, [isClient, isListening, setInput, toast]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessageWrapper = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!input.trim() && !attachedFile) || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            model: selectedModel,
            ...(filePreview && { filePreview }),
        };

        setInput('');
        setAttachedFile(null);
        setFilePreview(null);

        handleSendMessage(userMessage);

    }, [input, attachedFile, filePreview, isLoading, handleSendMessage, selectedModel]);

    return (
        <div className="flex-1 flex flex-col bg-[#1A1D21] text-gray-300 h-full">
            <header className="p-3 flex justify-between items-center h-[57px] pr-6 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNewChat}>
                                    <Plus size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>New Chat</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="w-40">
                        <ModelsDialog value={selectedModel} onValueChange={setSelectedModel} user={user} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isUltraUser ? (
                        <div className="text-sm text-muted-foreground">
                            <span>xeref</span> / <span className="text-foreground font-medium">today's tasks</span>
                        </div>
                    ) : (
                        <Button asChild size="sm" onClick={() => {
                            const { analytics } = getFirebaseServices();
                            if (analytics) logEvent(analytics, 'upgrade_button_clicked');
                        }}>
                            <Link href="/pricing">
                                <ArrowUp size={14} className="mr-2" /> Upgrade to PRO
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={isFocusModalOpen} onOpenChange={setIsFocusModalOpen}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9">
                                            <Target size={18} />
                                        </Button>
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent><p>Today's Focus</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DialogContent className="bg-transparent border-none p-0 max-w-2xl shadow-none">
                            <TodayFocusPanel onClose={() => setIsFocusModalOpen(false)} onAddToChat={handleAddToChat} />
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 md:p-8">
                    {messages.length === 0 ? (
                        <div>
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <LogoSvg className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold">What can I help with?</h2>
                                </div>
                            </div>
                            <CaseStudyCarousel />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((message) => (
                                message.role === 'assistant' ? (
                                    <div key={message.id} className="group flex items-start gap-4">
                                        <Avatar className="h-8 w-8"><AvatarFallback><LogoSvg /></AvatarFallback></Avatar>
                                        <div className="flex flex-col gap-2 max-w-[80%]">
                                            <div className="rounded-lg px-4 py-3 bg-[#2C2D30]"><p>{message.content}</p></div>
                                            <div className="flex items-center gap-2">
                                                {message.model && <span className="text-xs text-gray-500">{message.model}</span>}
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleVote(message.id, 'up')}><ThumbsUp size={16} /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleVote(message.id, 'down')}><ThumbsDown size={16} /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleCopy(message.content, message.id)}><Copy size={16} /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={message.id} className="flex items-start justify-end gap-2">
                                        <div className="rounded-lg px-4 py-3 max-w-[80%] bg-[#2C2D30]"><p>{message.content}</p></div>
                                        <Avatar className="h-8 w-8"><AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback></Avatar>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="px-4 pt-4 pb-2 max-w-3xl w-full mx-auto">
                <form onSubmit={handleSendMessageWrapper}>
                    <div className="relative">
                        {filePreview && (
                            <div className="absolute bottom-full mb-2 w-full p-2 bg-gray-900 rounded-t-lg">
                                <div className="flex items-center gap-2">
                                    <Image src={filePreview} alt="File preview" width={40} height={40} className="rounded-md" />
                                    <span className="text-sm truncate">{attachedFile?.name}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => { setFilePreview(null); setAttachedFile(null); }}>
                                        <X size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center p-2 rounded-lg bg-[#2C2D30] border border-gray-700">
                            <Textarea
                                ref={chatInputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message Xeref..."
                                className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-base"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleSendMessageWrapper(e);
                                    }
                                }}
                            />
                            <div className="flex items-center space-x-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => fileInputRef.current?.click()}>
                                                <Paperclip size={18} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Attach file</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className={cn("h-9 w-9", isListening && "bg-red-500/20")} onClick={handleToggleListening}>
                                                {isListening ? <StopIcon className="h-5 w-5" /> : <AudioLines size={18} />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{isListening ? "Stop listening" : "Voice input"}</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Button type="submit" size="icon" className="h-9 w-9" disabled={(!input.trim() && !attachedFile) || isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowUp size={18} />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
