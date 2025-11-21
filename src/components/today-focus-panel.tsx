
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';
import { X, Lightbulb, MessageSquare } from 'lucide-react';
import { type Task } from '@/lib/types';

const focusTasks: Task[] = [
  { id: '1', title: 'Finalize Q3 marketing report', status: 'todo', priority: 'Hard' },
  { id: '2', title: 'Prepare for investor meeting', status: 'todo', priority: 'Hard' },
  { id: '3', title: 'Review new UI/UX mockups', status: 'todo', priority: 'Medium' },
];

const productivityQuote = {
  text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  author: "Stephen Covey"
};

export const TodayFocusPanel = ({ onClose, onAddToChat }: { onClose: () => void; onAddToChat: (jsonString: string) => void; }) => {

  const handleAddToChatClick = () => {
    const focusData = {
      summary: "Today's Focus",
      tasks: focusTasks.map(task => ({
        task: task.title,
        priority: task.priority
      })),
      quote: productivityQuote.text,
      author: productivityQuote.author
    };

    const jsonString = JSON.stringify(focusData, null, 2);
    onAddToChat(jsonString);
  };

  return (
    <div className="bg-[#1A1D21] text-gray-300 rounded-lg shadow-2xl border border-gray-800 flex flex-col h-[70vh] max-h-[600px] w-full">
      <header className="p-4 flex justify-between items-center border-b border-gray-800 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Today's Focus</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {focusTasks.map(task => (
            <div key={task.id} className="flex items-center p-3 bg-[#2C2D30] rounded-md">
              <Checkbox id={`focus-${task.id}`} className="mr-3 h-5 w-5 border-gray-600" />
              <label htmlFor={`focus-${task.id}`} className="flex-grow text-sm">{task.title}</label>
              <Badge variant="outline" className="ml-2">{task.priority}</Badge>
            </div>
          ))}
        </div>
      </ScrollArea>

      <footer className="p-6 border-t border-gray-800 mt-auto flex-shrink-0">
        <div className="flex items-start text-sm">
          <Lightbulb className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <p className="italic">"{productivityQuote.text}"</p>
            <p className="text-right text-gray-500 mt-1">- {productivityQuote.author}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button onClick={handleAddToChatClick}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Use in Chat
          </Button>
        </div>
      </footer>
    </div>
  );
};
