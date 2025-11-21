
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { IconSidebar } from '@/components/icon-sidebar';
import { LeftSidebar } from '@/components/left-sidebar';
import { CenterContent } from '@/components/center-content';
import { RightNav } from '@/components/right-nav';
import { TasksView } from '@/components/tasks-view';
import { IdeasView } from '@/components/ideas-view';
import { NotesView } from '@/components/notes-view';
import { ArchivedTasksView } from '@/components/archived-tasks-view';
import { SettingsPanel } from '@/components/settings-panel';
import { WorkflowView } from '@/components/workflow-view';
import { CalendarView } from '@/components/calendar-view';
import { type Message, type Task, type Idea, type TaskStatus } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import {
  addTask,
  getTasksFromFirestore,
  getIdeasFromFirestore,
  addIdea,
  deleteIdea,
  updateTask,
  deleteArchivedTasks,
  updateUserContext
} from '@/lib/firestore';
import { serverTimestamp } from 'firebase/firestore';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-local-storage';

type RightPanelView = 'tasks' | 'ideas' | 'notes' | 'settings' | 'archived' | 'workflow' | 'calendar' | null;

type AppSettings = {
  model: string;
  temperature: number;
  systemPrompt: string;
  useWebSearch: boolean;
};

import { ChangelogModal } from '@/components/changelog-modal';
import { KeyboardShortcutsModal } from '@/components/keyboard-shortcuts-modal';

export default function HomePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  // Unified State Management
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRightView, setActiveRightView] = useState<RightPanelView>('tasks');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', {
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    systemPrompt: '',
    useWebSearch: false,
    darkMode: true,
    notifications: true,
    privacyMode: false
  });
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // All component logic and hooks would be here...

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Xeref.ai - Your AI-Powered Productivity Partner</title>
        <meta name="description" content="Xeref.ai supercharges your productivity with AI Agents that work 24/7 on your tasks, using the world's smartest AI models." />
      </Head>
      <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
        <IconSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />
        {!isSidebarCollapsed && <LeftSidebar />}

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={60} minSize={30}>
            <CenterContent
              user={user}
              messages={messages}
              isLoading={isBotThinking}
              handleSendMessage={(msg) => { /* Placeholder */ }}
              handleNewChat={() => { }}
              chatMode="agent"
              setChatMode={() => { }}
              settings={settings}
              setSettings={setSettings}
              chatInputRef={chatInputRef}
              input=""
              setInput={() => { }}
              setMessages={setMessages}
              filePreview={null}
              setFilePreview={() => { }}
              attachedFile={null}
              setAttachedFile={() => { }}
              isFocusModalOpen={false}
              setIsFocusModalOpen={() => { }}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={30}>
            <div className='h-full w-full flex'>
              <div className='flex-grow h-full'>
                {activeRightView === 'tasks' && <TasksView activeTasks={[]} isLoading={false} toggleTaskCompletion={() => { }} archiveTask={() => { }} onViewArchived={() => setActiveRightView('archived')} onClose={() => setActiveRightView(null)} onOpenGuestProfile={() => { }} />}
                {activeRightView === 'settings' && <SettingsPanel settings={settings} setSettings={setSettings} onClose={() => setActiveRightView(null)} user={user} theme="dark" onToggleTheme={() => { }} />}
                {/* Other views */}
              </div>
              <RightNav
                activeView={activeRightView}
                setActiveRightView={setActiveRightView}
                openFeedbackDialog={() => { }}
                openAddEventDialog={() => { }}
                openPostToSkoolDialog={() => { }}
                openSearchDialog={() => { }}
                openChangelog={() => setIsChangelogOpen(true)}
                openKeyboardShortcuts={() => setIsShortcutsOpen(true)}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
}
