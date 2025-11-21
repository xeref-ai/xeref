import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CHANGELOG_DATA, EVENT_COLORS } from '@/constants';

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangelogModal = ({ isOpen, onClose }: ChangelogModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-[#1E1E1E] border-gray-800 text-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Changelog</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Stay updated with the latest features and improvements.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4 mt-4">
                    <div className="space-y-8">
                        {CHANGELOG_DATA.map((release, index) => (
                            <div key={index} className="relative pl-8 border-l border-gray-700 pb-8 last:pb-0 last:border-0">
                                <div className={`absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-gray-600'}`} />
                                <div className="flex flex-col space-y-1 mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        {release.version}
                                        {index === 0 && <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-xs">Latest</Badge>}
                                    </h3>
                                    <span className="text-sm text-gray-500">{release.date}</span>
                                </div>
                                <ul className="space-y-3">
                                    {release.changes.map((change, changeIndex) => (
                                        <li key={changeIndex} className="flex items-start gap-3 text-sm">
                                            <Badge variant="outline" className={`
                        mt-0.5 min-w-[60px] justify-center border-0
                        ${change.type === 'New' ? 'bg-green-500/10 text-green-400' :
                                                    change.type === 'Improved' ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-orange-500/10 text-orange-400'}
                      `}>
                                                {change.type}
                                            </Badge>
                                            <span className="leading-relaxed text-gray-300">{change.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
