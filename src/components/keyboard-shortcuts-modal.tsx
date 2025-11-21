import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHORTCUTS = [
    {
        category: "General", items: [
            { key: "⌘/Ctrl + K", description: "Open Command Palette" },
            { key: "⌘/Ctrl + /", description: "Show Keyboard Shortcuts" },
            { key: "Esc", description: "Close Modal / Clear Selection" },
        ]
    },
    {
        category: "Navigation", items: [
            { key: "G then H", description: "Go to Home" },
            { key: "G then T", description: "Go to Tasks" },
            { key: "G then N", description: "Go to Notes" },
            { key: "G then C", description: "Go to Calendar" },
        ]
    },
    {
        category: "Actions", items: [
            { key: "N", description: "New Task / Note" },
            { key: "⌘/Ctrl + Enter", description: "Submit / Send Message" },
            { key: "⌘/Ctrl + S", description: "Save Changes" },
        ]
    }
];

export const KeyboardShortcutsModal = ({ isOpen, onClose }: KeyboardShortcutsModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-[#1E1E1E] border-gray-800 text-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <Keyboard className="h-6 w-6" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Boost your productivity with these shortcuts.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SHORTCUTS.map((category, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{category.category}</h3>
                                <div className="space-y-2">
                                    {category.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center justify-between bg-[#2C2D30] p-2 rounded-md">
                                            <span className="text-sm text-gray-300">{item.description}</span>
                                            <kbd className="px-2 py-1 bg-[#1E1E1E] border border-gray-700 rounded text-xs text-gray-400 font-mono min-w-[60px] text-center">
                                                {item.key}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
