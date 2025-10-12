
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
import { AddEventView } from '@/components/add-event-view';
import { TeamBuilderView } from '@/components/team-builder-view';
import { NewProjectView } from '@/components/new-project-view';
import { EditProjectView } from '@/components/edit-project-view';
import { WorkflowView } from '@/components/workflow-view';
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
import TodayFocusPanel from '@/components/today-focus-panel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { DocsSearch } from '@/components/docs-search';
import { FeedbackDialog } from '@/components/feedback-dialog';
import { PostToSkoolDialog } from '@/components/post-to-skool-dialog';
import { UserContextDialog } from '@/components/user-context-dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';


type RightPanelView = 'tasks' | 'ideas' | 'notes' | 'settings' | 'archived' | 'add-event' | 'newProject' | 'editProject' | 'team-builder' | 'workflow' | null;

type AppSettings = {
  model: string;
  temperature: number;
  systemPrompt: string;
  useWebSearch: boolean;
};

const initialMessages: Message[] = [];


export default function HomePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const ideaInputRef = useRef<HTMLInputElement>(null);

  // Layout State
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRightView, setActiveRightView] = useState<RightPanelView>('tasks');
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isPostToSkoolDialogOpen, setIsPostToSkoolDialogOpen] = useState(false);
  const [isUserContextDialogOpen, setIsUserContextDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'agent' | 'ultra-search'>('agent');
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', {
    model: 'GPT 4.1',
    temperature: 0.7,
    systemPrompt: '',
    useWebSearch: false,
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (user?.uid) {
        setIsDataLoading(true);
      getTasksFromFirestore(user.uid).then(setTasks);
      getIdeasFromFirestore(user.uid).then(setIdeas);
      if (isClient) {
        const hasSeenUserContext = localStorage.getItem('hasSeenUserContext');
        if (!hasSeenUserContext) {
          setIsUserContextDialogOpen(true);
        }
      }
      setIsDataLoading(false);
    }
  }, [user?.uid, isClient]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setAttachedFile(null);
    setFilePreview(null);
    toast({
      title: 'New Chat',
      description: 'Your conversation has been cleared.',
    });
  }, [toast]);

  const handleSendMessage = useCallback(async (userMessage: Message) => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to chat.', variant: 'destructive' });
      return;
    }
  
    setIsLoading(true);
    setMessages(prev => [...prev, userMessage]);
  
    if (chatMode === 'ultra-search') {
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userMessage.content }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch from search API');
        }
  
        const data = await response.json();
        const searchResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          model: 'Perplexity',
        };
        setMessages(prev => [...prev, searchResponse]);
      } catch (error) {
        console.error('Search API Error:', error);
        toast({ title: 'Error', description: 'Failed to get search results.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
      return;
    }
  
    // Simulate a delay and provide a fake response for other modes
    setTimeout(() => {
      const fakeResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a summarized fake response to your message: "${userMessage.content}"`,
        model: settings.model,
      };
      setMessages(prev => [...prev, fakeResponse]);
      setIsLoading(false);
    }, 1000);
  
  }, [user, toast, chatMode, settings]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const isTyping = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';

        if (e.ctrlKey || e.metaKey) {
            if (e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setSidebarCollapsed(prev => !prev);
            }
            if (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setChatMode(prev => {
                    const newMode = prev === 'agent' ? 'chat' : 'agent';
                     toast({
                        title: 'Mode Switched',
                        description: `Switched to ${newMode === 'agent' ? 'Agent' : 'Chat'} mode.`,
                    });
                    return newMode;
                });
            }
            return;
        }

        if (isTyping) return;

        switch(e.key.toLowerCase()) {
            case 'q':
                handleNewChat();
                break;
            case 's':
                setActiveRightView('settings');
                break;
            case 'f':
                setIsSearchOpen(true);
                break;
            case 'v':
                const rightViews: (RightPanelView)[] = ['tasks', 'ideas', 'notes'];
                // Get the current index, or start at -1 if no view is active
                const currentIndex = activeRightView ? rightViews.indexOf(activeRightView) : -1;
                const nextIndex = (currentIndex + 1) % rightViews.length;
                setActiveRightView(rightViews[nextIndex]);
                break;
            case 'c':
                setActiveRightView('archived');
                break;
            case 'e':
                setActiveRightView('add-event');
                break;
            default:
                break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeRightView, chatMode, handleNewChat, toast]);

  const handleAddIdea = async (text: string) => {
    if (!user) return;
    const newIdea = { text };
    const id = await addIdea(user.uid, newIdea);
    setIdeas(prev => [{ id, ...newIdea, createdAt: new Date() }, ...prev]);
  };

  const handleDeleteIdea = async (id: string) => {
    if (!user) return;
    await deleteIdea(user.uid, id);
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const handleAddTask = async (taskDetails: { instructions: string; model: string; mode: string; source: string }) => {
    if (!user) return;
    const newTask = {
      title: taskDetails.instructions,
      status: 'todo' as TaskStatus,
      createdAt: serverTimestamp(),
      // You can add the other details to the task object as needed
      model: taskDetails.model,
      mode: taskDetails.mode,
      source: taskDetails.source,
      priority: 'Easy'
    };
    const id = await addTask(user.uid, newTask);
    setTasks(prev => [{ id, ...newTask, createdAt: new Date() }, ...prev]);
  };

  const activeTasks = tasks.filter(task => task.status !== 'archived');
  const archivedTasks = tasks.filter(task => task.status === 'archived');

  const handleToggleTaskCompletion = async (id: string, currentStatus: TaskStatus) => {
      if (!user) return;
      const isDone = currentStatus === 'done';
      const newStatus = isDone ? 'todo' : 'done';
      const updates: Partial<Task> = { 
          status: newStatus,
          completedAt: isDone ? null : serverTimestamp()
      };
      await updateTask(user.uid, id, updates);
      setTasks(tasks.map(t => 
          t.id === id ? { ...t, status: newStatus, completedAt: isDone ? null : new Date() } : t
      ));
  };
  
  const handleArchiveTask = async (id: string) => {
    if (!user) return;
    const updates: Partial<Task> = { status: 'archived' };
    await updateTask(user.uid, id, updates);
    // Optimistically update UI
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, status: 'archived' } : t));
    toast({ description: "Task moved to completed." });
  };

  const handleUnarchiveTask = async (id: string) => {
    if (!user) return;
    const updates: Partial<Task> = { status: 'todo', completedAt: null };
    await updateTask(user.uid, id, updates);
    // Optimistically update UI
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, status: 'todo', completedAt: null } : t));
    toast({ description: "Task restored." });
  };

  const handleDeleteAllArchived = async () => {
    if (!user || archivedTasks.length === 0) return;
    const taskIdsToDelete = archivedTasks.map(t => t.id);
    await deleteArchivedTasks(user.uid, taskIdsToDelete);
    setTasks(activeTasks);
    toast({ description: "All completed tasks deleted." });
  };

  const handleSaveUserContext = async (context: string) => {
    if (user) {
      await updateUserContext(user.uid, { context });
      if (isClient) {
        localStorage.setItem('hasSeenUserContext', 'true');
      }
    }
  };


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
          onNewProjectClick={() => setActiveRightView('newProject')}
          onEditProjectClick={() => setActiveRightView('editProject')}
        />
        {!isSidebarCollapsed && <LeftSidebar />}
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1"
        >
          <ResizablePanel defaultSize={65} minSize={40}>
           <div className="flex flex-col h-full">
              <CenterContent
                user={user}
                messages={messages}
                setMessages={setMessages}
                input={input || ''}
                setInput={setInput}
                isLoading={isLoading}
                handleSendMessage={handleSendMessage}
                handleNewChat={handleNewChat}
                chatMode={chatMode}
                setChatMode={setChatMode}
                settings={settings}
                setSettings={setSettings}
                chatInputRef={chatInputRef}
                filePreview={filePreview}
                setFilePreview={setFilePreview}
                attachedFile={attachedFile}
                setAttachedFile={setAttachedFile}
                isFocusModalOpen={isFocusModalOpen}
                setIsFocusModalOpen={setIsFocusModalOpen}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className={cn(!activeRightView && "hidden")} />
          
          <ResizablePanel
            defaultSize={35}
            minSize={30}
            collapsible
            collapsedSize={0}
            onExpand={() => {
              if (activeRightView === null) {
                setActiveRightView('tasks');
              }
            }}
            onCollapse={() => {
              setActiveRightView(null);
            }}
            className={cn('transition-all duration-300', activeRightView === null ? 'min-w-0 w-0 !-mr-2' : 'min-w-[350px]')}
          >
          <div className={cn('h-full w-full flex', activeRightView === null && 'hidden')}>
            <div className='flex-grow h-full'>
              {activeRightView === 'tasks' && user && (
                <TasksView 
                  activeTasks={activeTasks}
                  isLoading={isDataLoading}
                  toggleTaskCompletion={handleToggleTaskCompletion}
                  archiveTask={handleArchiveTask}
                  onViewArchived={() => setActiveRightView('archived')}
                  onClose={() => setActiveRightView(null)}
                   onOpenGuestProfile={() => {
                      setIsUserContextDialogOpen(true);
                  }}
                />
              )}
               {activeRightView === 'archived' && user && (
                  <ArchivedTasksView
                      archivedTasks={archivedTasks}
                      unarchiveTask={handleUnarchiveTask}
                      deleteAllArchived={handleDeleteAllArchived}
                      onBack={() => setActiveRightView('tasks')}
                  />
              )}
              {activeRightView === 'ideas' && user && (
                  <IdeasView
                      onClose={() => setActiveRightView(null)}
                      ideas={ideas}
                      addIdea={handleAddIdea}
                      deleteIdea={handleDeleteIdea}
                  />
              )}
              {activeRightView === 'notes' && (
                  <NotesView onClose={() => setActiveRightView(null)} />
              )}
              {activeRightView === 'workflow' && (
                  <WorkflowView onClose={() => setActiveRightView(null)} />
              )}
              {activeRightView === 'settings' && user && (
                  <SettingsPanel
                      settings={settings}
                      setSettings={setSettings}
                      onClose={() => setActiveRightView(null)}
                      user={user}
                  />
              )}
              {activeRightView === 'add-event' && (
                  <AddEventView onClose={() => setActiveRightView(null)} />
              )}
              {activeRightView === 'newProject' && (
                  <NewProjectView onClose={() => setActiveRightView('tasks')} />
              )}
              {activeRightView === 'editProject' && (
                  <EditProjectView onClose={() => setActiveRightView('tasks')} />
              )}
              {activeRightView === 'team-builder' && (
                  <TeamBuilderView />
              )}
            </div>
            <RightNav 
                activeView={activeRightView} 
                setActiveRightView={setActiveRightView}
                openFeedbackDialog={() => setIsFeedbackDialogOpen(true)}
                openAddEventDialog={() => setActiveRightView('add-event')}
                openPostToSkoolDialog={() => setIsPostToSkoolDialogOpen(true)}
                openTeamBuilder={() => setActiveRightView('team-builder')}
                openSearchDialog={() => setIsSearchOpen(true)}
             />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-2xl rounded-lg overflow-hidden">
              <DocsSearch />
          </DialogContent>
        </Dialog>
        <FeedbackDialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} />
        <PostToSkoolDialog open={isPostToSkoolDialogOpen} onOpenChange={setIsPostToSkoolDialogOpen} />
        <UserContextDialog open={isUserContextDialogOpen} onOpenChange={setIsUserContextDialogOpen} onSave={handleSaveUserContext} />
      </div>
    </>
  );
}
