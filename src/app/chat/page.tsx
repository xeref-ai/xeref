
'use client';

import React, { useState } from 'react';
import { ChatHeader } from '@/components/chat-header/chat-header';
import { ChatInterface } from '@/components/chat/chat-interface';
import { type Message } from '@/lib/types';

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotThinking, setIsBotThinking] = useState(false);

    const handleResetChat = () => {
        setMessages([]);
    }

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
        };

        setMessages(prev => [...prev, userMessage]);
        setIsBotThinking(true);

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I received your message. This is a placeholder response.',
            };
            setMessages(prev => [...prev, botMessage]);
            setIsBotThinking(false);
        }, 1000);
    }

    return (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <ChatHeader handleResetChat={handleResetChat} />
            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isBotThinking={isBotThinking}
            />
        </div>
    )
}

export default ChatPage;
