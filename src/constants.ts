
import { PenLine, FileText, GitBranch, CheckCheck } from 'lucide-react';

export const AI_MODELS = [
    { id: 'gemini-3-pro-high', name: 'Gemini 3 Pro (High)', isPro: true, description: 'High reasoning capability' },
    { id: 'gemini-3-pro-low', name: 'Gemini 3 Pro (Low)', isPro: false, description: 'Efficient reasoning' },
    { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', isPro: true, description: 'Balanced performance' },
    { id: 'claude-sonnet-4.5-thinking', name: 'Claude Sonnet 4.5 (Thinking)', isPro: true, description: 'Enhanced reasoning with chain of thought' },
    { id: 'gpt-oss-120b', name: 'GPT-OSS 120B (Medium)', isPro: false, description: 'Open source model' },
];

export const EVENT_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-red-500',
];

export const SAMPLE_NOTES_DATA = [
    { id: 'note-1', title: 'Project Ideas', content: '1. AI-powered todo list\n2. Smart calendar integration', createdAt: new Date(), isPinned: true },
    { id: 'note-2', title: 'Meeting Notes', content: 'Discussed the new roadmap for Q4.', createdAt: new Date(), isPinned: false },
];

export const CHANGELOG_DATA = [
    {
        version: 'v4 - The Reasoning Era',
        date: 'Current Version',
        changes: [
            { type: 'New', description: 'Gemini 3 Pro Preview: Experience the next generation of reasoning capabilities with the new Gemini 3 Pro model.' },
            { type: 'New', description: 'Realtime Agent: Talk naturally with Gemini 2.5 Flash using the new low-latency Live API.' },
            { type: 'Fix', description: 'Resolved build issues with binary data types.' },
        ]
    },
    {
        version: 'v3 - The Realtime Update',
        date: 'November 15, 2025',
        changes: [
            { type: 'New', description: 'AI Voice Chat: Engage in real-time voice conversations with our new AI Voice Chat agent.' },
            { type: 'New', description: 'Multimodal RAG Agent: Upload documents and images to chat with your own data, enabling powerful, context-aware interactions.' },
            { type: 'New', description: 'Real-time Agent Framework: Introducing a new agent capable of performing tasks and interacting with external services in real-time.' },
            { type: 'Improved', description: 'Chat History: Your chat history in the sidebar is now grouped by date (Today, Yesterday, Last 7 Days, Older) for easier navigation.' },
            { type: 'Improved', description: 'Note Reordering: You can now drag and drop notes within their date groups to organize them your way.' },
            { type: 'Fix', description: 'Optimized local storage usage and resolved minor bugs in the notes and tasks views for a smoother experience.' },
        ]
    },
    {
        version: 'v2 - The Agent Update',
        date: 'October 26, 2025',
        changes: [
            { type: 'New', description: 'AI Task Decomposition: Use Gemini 2.5 Pro to break down high-level goals into structured tasks with suggested priorities.' },
            { type: 'New', description: 'Google Search Grounding: Get answers from your AI Chatbot grounded in real-time information from Google Search.' },
            { type: 'New', description: 'Calendar Function Calling: Create calendar events directly from your chat conversation.' },
            { type: 'New', description: 'Video Generation Agent: Create stunning videos from text prompts using the latest Veo models.' },
            { type: 'Improved', description: 'AI Task Generation: Upgraded the model to Gemini 2.5 Pro with Thinking capabilities for more intelligent project planning.' },
            { type: 'Improved', description: 'Chat Experience: Added hover actions (copy, feedback, edit) to messages for better control and Google Search grounding.' },
            { type: 'Improved', description: 'Theming: Full visual consistency for light mode across the application.' },
            { type: 'Fix', description: 'Addressed race condition issues with API key selection for video generation.' },
        ]
    }
];
