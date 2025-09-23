
'use client';

import React, { useState, useRef } from 'react';
import { ChatHeader } from '@/components/chat-header/chat-header';
import { ChatInterface } from '@/components/chat/chat-interface';
import { LogoSvg } from '@/components/icons';

const ChatPage = () => {
    const chatInterfaceRef = useRef<{ handleNewChat: () => void }>(null);

    const handleNewChat = () => {
        if (chatInterfaceRef.current) {
            chatInterfaceRef.current.handleNewChat();
        }
    }

    return (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <ChatHeader onNewChat={handleNewChat} />
            <ChatInterface ref={chatInterfaceRef} onNewChat={handleNewChat} />
        </div>
    )
}

export default ChatPage;
