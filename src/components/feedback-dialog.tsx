
'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Paperclip, Send, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendFeedback = async () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please tell us what prompted this feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // In a real implementation, you would upload the screenshot to a storage service
      // and get a URL. For now, we'll just simulate this.
      let screenshotUrl = '';
      if (screenshotFile) {
        screenshotUrl = `screenshots/${user?.uid || 'anonymous'}/${Date.now()}-${screenshotFile.name}`;
        console.log(`Simulating screenshot upload to: ${screenshotUrl}`);
      }

      const token = await user?.getIdToken();

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          screenshotUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "Feedback Sent!",
        description: "Thank you for helping us improve Xeref.ai.",
      });
      setDescription('');
      setScreenshotFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Could not send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScreenshotFile(e.target.files[0]);
      toast({
        title: "Screenshot Attached",
        description: `${e.target.files[0].name}`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Send Feedback to Google</DialogTitle>
          <DialogDescription>
            Tell us what prompted this feedback...
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Textarea
            placeholder="Please don't include any sensitive information"
            className="min-h-[120px] bg-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="text-xs text-muted-foreground">
            We may email you for more information or updates. Some account and system information may be sent to Google. We will use it to fix problems and improve our services, subject to our Privacy Policy and Terms of Service.
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center w-full">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileAttach}
              accept="image/*"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Screenshot
            </Button>
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendFeedback} disabled={isSending}>
              {isSending ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
