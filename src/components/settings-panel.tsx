
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModelsDialog } from '@/components/models-dialog';
import { X } from 'lucide-react';
import { type User } from 'firebase/auth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AppSettings = {
    model: string;
    temperature: number;
    systemPrompt: string;
    useWebSearch: boolean;
    darkMode: boolean;
    notifications: boolean;
    privacyMode: boolean;
};

export const SettingsPanel = ({
    settings,
    setSettings,
    onClose,
    user,
    theme,
    onToggleTheme
}: {
    settings: AppSettings,
    setSettings: (settings: AppSettings) => void,
    onClose: () => void,
    user: User | null,
    theme: 'light' | 'dark',
    onToggleTheme: () => void
}) => {
    const tempValue = Array.isArray(settings.temperature) ? settings.temperature[0] : settings.temperature;

    return (
        <div className="bg-[#121016] text-gray-300 flex-shrink-0 flex flex-col border-l border-gray-800 h-full w-[400px]">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white h-8 w-8">
                        <X size={20} />
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="general" className="flex-1 flex flex-col">
                <div className="px-6 pt-4">
                    <TabsList className="w-full grid grid-cols-2 bg-[#2C2D30]">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <TabsContent value="general" className="space-y-6 mt-0">
                            <div>
                                <Label className="text-sm font-medium text-gray-400">Model</Label>
                                <div className="mt-2">
                                    <ModelsDialog
                                        value={settings.model}
                                        onValueChange={(model) => setSettings({ ...settings, model })}
                                        user={user}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="temperature" className="text-sm font-medium text-gray-400">Temperature</Label>
                                    <span className="text-sm text-white font-mono">{tempValue}</span>
                                </div>
                                <Slider
                                    id="temperature"
                                    value={[tempValue]}
                                    onValueChange={(value) => setSettings({ ...settings, temperature: value[0] })}
                                    max={1}
                                    step={0.1}
                                    className="mt-3"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-400">System Prompt</Label>
                                <Textarea
                                    placeholder="e.g., You are a helpful assistant."
                                    className="bg-[#2C2D30] border-gray-700 mt-2 h-36 text-white placeholder:text-gray-500"
                                    value={settings.systemPrompt}
                                    onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="web-search" className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                                    <span>Web Search</span>
                                </Label>
                                <Switch
                                    id="web-search"
                                    checked={settings.useWebSearch}
                                    onCheckedChange={(checked) => setSettings({ ...settings, useWebSearch: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode" className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                                    <span>Dark Mode</span>
                                </Label>
                                <Switch
                                    id="dark-mode"
                                    checked={theme === 'dark'}
                                    onCheckedChange={onToggleTheme}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="notifications" className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                                    <span>Notifications</span>
                                </Label>
                                <Switch
                                    id="notifications"
                                    checked={settings.notifications}
                                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="privacy-mode" className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                                    <span>Privacy Mode</span>
                                </Label>
                                <Switch
                                    id="privacy-mode"
                                    checked={settings.privacyMode}
                                    onCheckedChange={(checked) => setSettings({ ...settings, privacyMode: checked })}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="account" className="space-y-6 mt-0">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user?.photoURL || ''} />
                                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm">Change Avatar</Button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Display Name</Label>
                                    <Input defaultValue={user?.displayName || ''} className="bg-[#2C2D30] border-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input defaultValue={user?.email || ''} disabled className="bg-[#2C2D30] border-gray-700 opacity-50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="bg-[#2C2D30] border-gray-700" />
                                </div>
                                <Button className="w-full">Save Changes</Button>
                            </div>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}
