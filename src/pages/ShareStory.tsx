import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudRain, 
  HelpCircle, 
  RotateCcw, 
  AlertCircle, 
  CircleDashed,
  ArrowRight,
  Ghost,
  Heart,
  Globe,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { addStory } from '@/lib/database';
import { toast } from 'sonner';

const ShareStory = () => {
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [activeEmotion, setActiveEmotion] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const emotions = [
    { id: 'sad', icon: CloudRain, label: 'Sad', prompt: 'What brings tears to your eyes today?' },
    { id: 'confused', icon: HelpCircle, label: 'Confused', prompt: 'Where did the path become unclear?' },
    { id: 'regret', icon: RotateCcw, label: 'Regret', prompt: 'What would you say to your past self?' },
    { id: 'worried', icon: AlertCircle, label: 'Worried', prompt: 'What keeps your heart racing at night?' },
    { id: 'empty', icon: CircleDashed, label: 'Empty', prompt: 'Describe the space where the feeling used to be.' },
  ];

  const handleRelease = async () => {
    // Check if the HTML content is just an empty paragraph
    const isReallyEmpty = !story || story === '<p></p>' || story.trim() === '';
    if (isReallyEmpty) return;
    
    setIsSubmitting(true);
    
    try {
      // Save to SQLite database
      await addStory({
        content: story,
        emotion: activeEmotion || 'unspecified',
        isPublic: isPublic,
        authorId: undefined // No auth for now
      });

      setIsSubmitting(false);
      setIsReleased(true);
      setStory('');
      
      // Reset after a few seconds
      setTimeout(() => {
        setIsReleased(false);
        setActiveEmotion(null);
        setIsPublic(true);
      }, 5000);
    } catch (error) {
      console.error("Error releasing story:", error);
      toast.error("The void is temporarily closed. Please try again soon.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-foreground/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-foreground/[0.03] blur-[100px] rounded-full" />
        <div className="absolute inset-0 dot-matrix opacity-[0.03]" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4 block">The Confessional</span>
          <h1 className="text-5xl md:text-7xl mb-6 leading-tight">Share your <br /><span className="opacity-30 italic">unspoken story.</span></h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto leading-relaxed">
            This is a safe vessel. No judgment, no logs, no memory. 
            Just a place to pour out what's heavy, then let it dissolve into the digital ether.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveEmotion(emotion.id)}
              className={`p-6 rounded-none border transition-all duration-500 flex flex-col items-center gap-3 ${
                activeEmotion === emotion.id 
                  ? 'bg-foreground text-background border-foreground' 
                  : 'bg-transparent border-foreground/10 hover:border-foreground/30'
              }`}
            >
              <emotion.icon className={`w-6 h-6 ${activeEmotion === emotion.id ? 'opacity-100' : 'opacity-40'}`} />
              <span className="font-mono text-[10px] uppercase tracking-widest">{emotion.label}</span>
            </motion.button>
          ))}
        </div>

        <Card className="nothing-border glass p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isReleased ? (
              <motion.div
                key="input-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                className="space-y-8"
              >
                <div className="min-h-[60px]">
                  <AnimatePresence mode="wait">
                    {activeEmotion && (
                      <motion.p
                        key={activeEmotion}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="italic text-xl opacity-40"
                      >
                        {emotions.find(e => e.id === activeEmotion)?.prompt}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <RichTextEditor 
                  content={story}
                  onChange={setStory}
                  placeholder="START POURING YOUR HEART OUT HERE..."
                />

                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] opacity-35">
                  <span>Customize with expanded color families</span>
                  <span className="hidden md:inline">/</span>
                  <span>Use code, strike, justify, and clear formatting</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-foreground/5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 opacity-30">
                      <Heart className="w-4 h-4" />
                      <span className="font-mono text-[10px] uppercase tracking-widest">Your words are safe here</span>
                    </div>
                    
                    <button 
                      onClick={() => setIsPublic(!isPublic)}
                      className="flex items-center gap-3 group"
                    >
                      <div className={`w-10 h-10 flex items-center justify-center transition-all duration-500 ${isPublic ? 'bg-foreground text-background' : 'bg-foreground/5 opacity-40'}`}>
                        {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <span className="font-mono text-[10px] uppercase tracking-widest block mb-0.5">
                          {isPublic ? "Public Echo" : "Private Dissolve"}
                        </span>
                        <span className="text-[10px] opacity-30">
                          {isPublic ? "Will be shared with the community" : "Will vanish into the void"}
                        </span>
                      </div>
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleRelease}
                    disabled={(!story || story === '<p></p>' || story.trim() === '') || isSubmitting}
                    className="w-full md:w-auto h-14 px-10 bg-foreground text-background font-mono tracking-[0.3em] text-xs hover:bg-foreground/90 disabled:opacity-20 transition-all"
                  >
                    {isSubmitting ? "DISSOLVING..." : "RELEASE TO THE VOID"}
                    {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="released"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 rounded-full border border-foreground/10 flex items-center justify-center mb-8"
                >
                  <Ghost className="w-8 h-8 opacity-40" />
                </motion.div>
                <h3 className="text-3xl md:text-4xl mb-4 font-light">It has been heard.</h3>
                <p className="font-mono text-xs opacity-40 uppercase tracking-[0.4em] max-w-xs leading-loose">
                  Your story has been released. <br />
                  The weight is no longer yours to carry alone.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative overlay */}
          <div className="absolute inset-0 pointer-events-none dot-matrix opacity-[0.02]" />
        </Card>

        <div className="mt-20 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">01 / The Purge</h4>
            <p className="text-sm opacity-60 leading-relaxed">
              Writing is the first step of healing. By externalizing the internal, you begin the process of detachment.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">02 / The Silence</h4>
            <p className="text-sm opacity-60 leading-relaxed">
              Once released, your words are not stored. They exist only in the moment of their creation, then vanish.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">03 / The Peace</h4>
            <p className="text-sm opacity-60 leading-relaxed">
              Return as often as you need. The void is always open, always listening, and always silent.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShareStory;
