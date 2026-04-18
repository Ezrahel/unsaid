import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageSquarePlus } from 'lucide-react';

export function FeedbackModal({ children }: { children?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Feedback submitted:', formData);
    toast.success('Thank you for your feedback! We hear you.');
    
    setLoading(false);
    setOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children || (
          <Button variant="ghost" className="font-mono text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            Feedback
          </Button>
        )} 
      />
      <DialogContent className="sm:max-w-[425px] nothing-border glass">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Give Feedback</DialogTitle>
          <DialogDescription className="font-mono text-[10px] uppercase tracking-widest opacity-60">
            Tell us about your experience in the digital sanctuary.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest opacity-60">Identity (Optional)</Label>
            <Input 
              id="name" 
              placeholder="ANONYMOUS" 
              className="nothing-border bg-foreground/5 font-mono text-xs"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest opacity-60">Frequency (Email)</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="EMAIL_ADDRESS" 
              className="nothing-border bg-foreground/5 font-mono text-xs"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest opacity-60">Your Whisper</Label>
            <Textarea 
              id="message" 
              required
              placeholder="WHAT'S ON YOUR MIND?" 
              className="nothing-border bg-foreground/5 font-mono text-xs min-h-[120px] resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-background font-mono tracking-widest text-xs h-12 hover:bg-foreground/90 transition-all"
            >
              {loading ? 'TRANSMITTING...' : 'SUBMIT FEEDBACK'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
