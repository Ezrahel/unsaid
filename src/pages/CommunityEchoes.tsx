import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getStories,
  updateReaction
} from '@/lib/database';
import { 
  CloudRain, 
  HelpCircle, 
  RotateCcw, 
  AlertCircle, 
  CircleDashed,
  Search,
  MessageSquare,
  Clock,
  Ghost,
  Plus,
  Heart,
  HandHelping,
  Frown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Story {
  id: number;
  content: string;
  emotion: string;
  createdAt: Date;
  reactions?: {
    like: number;
    support: number;
    sad: number;
  };
}

const StoryCard = ({ story, userReactions, onReact, formatDate, getEmotionIcon }: { 
  story: Story, 
  userReactions: Record<string, string[]>, 
  onReact: (id: string, type: 'like' | 'support' | 'sad') => void,
  formatDate: (ts: any) => string,
  getEmotionIcon: (id: string) => React.ReactNode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsLong(contentRef.current.scrollHeight > 200);
    }
  }, [story.content]);

  return (
    <Card className="nothing-border glass p-6 md:p-8 h-full flex flex-col justify-between group hover:border-foreground/20 transition-all duration-500">
      <div className="flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 opacity-40">
            {getEmotionIcon(story.emotion)}
            <span className="font-mono text-[8px] uppercase tracking-widest">{story.emotion}</span>
          </div>
          <div className="flex items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-[8px] uppercase tracking-widest">{formatDate(story.createdAt)}</span>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={contentRef}
            className={`prose prose-invert max-w-none opacity-70 group-hover:opacity-100 transition-all duration-500 italic font-light leading-relaxed overflow-hidden ${
              !isExpanded && isLong ? 'max-h-[200px]' : 'max-h-[2000px]'
            }`}
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
          {!isExpanded && isLong && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>

        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity text-left underline underline-offset-4"
          >
            {isExpanded ? "Show Less" : "Continue Reading"}
          </button>
        )}
      </div>
      
      <div className="pt-6 mt-6 border-t border-foreground/5 flex items-center justify-between">
        <div className="flex items-center flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReact(story.id.toString(), 'like')}
            className={`h-8 px-2 gap-1.5 font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
              userReactions[story.id.toString()]?.includes('like') 
                ? 'text-red-400 bg-red-400/5' 
                : 'opacity-30 hover:opacity-100 hover:bg-foreground/5'
            }`}
          >
            <Heart className={`w-3 h-3 ${userReactions[story.id.toString()]?.includes('like') ? 'fill-current' : ''}`} />
            <span>{story.reactions?.like || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReact(story.id.toString(), 'support')}
            className={`h-8 px-2 gap-1.5 font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
              userReactions[story.id.toString()]?.includes('support') 
                ? 'text-blue-400 bg-blue-400/5' 
                : 'opacity-30 hover:opacity-100 hover:bg-foreground/5'
            }`}
          >
            <HandHelping className="w-3 h-3" />
            <span>{story.reactions?.support || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReact(story.id.toString(), 'sad')}
            className={`h-8 px-2 gap-1.5 font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
              userReactions[story.id.toString()]?.includes('sad') 
                ? 'text-indigo-400 bg-indigo-400/5' 
                : 'opacity-30 hover:opacity-100 hover:bg-foreground/5'
            }`}
          >
            <Frown className="w-3 h-3" />
            <span>{story.reactions?.sad || 0}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 opacity-20 hidden min-[400px]:flex group-hover:opacity-40 transition-opacity">
          <Ghost className="w-3 h-3" />
          <span className="font-mono text-[7px] uppercase tracking-widest hidden sm:inline">Anonymous</span>
        </div>
      </div>
    </Card>
  );
};

const CommunityEchoes = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});

  const PAGE_SIZE = 12;

  const emotions = [
    { id: 'sad', icon: CloudRain, label: 'Sad' },
    { id: 'confused', icon: HelpCircle, label: 'Confused' },
    { id: 'regret', icon: RotateCcw, label: 'Regret' },
    { id: 'worried', icon: AlertCircle, label: 'Worried' },
    { id: 'empty', icon: CircleDashed, label: 'Empty' },
  ];

  useEffect(() => {
    const storedReactions = localStorage.getItem('unsaid_reactions');
    if (storedReactions) {
      setUserReactions(JSON.parse(storedReactions));
    }
  }, []);

  const handleReact = async (storyId: string, reactionType: 'like' | 'support' | 'sad') => {
    // Check if user already gave this specific reaction to this story
    const storyUserReactions = userReactions[storyId] || [];
    if (storyUserReactions.includes(reactionType)) {
      toast.info("You already shared this sentiment.");
      return;
    }

    try {
      await updateReaction(parseInt(storyId), reactionType);

      // Update local state for immediate feedback
      setStories(prev => prev.map(s => {
        if (s.id.toString() === storyId) {
          const currentReactions = s.reactions || { like: 0, support: 0, sad: 0 };
          return {
            ...s,
            reactions: {
              ...currentReactions,
              [reactionType]: currentReactions[reactionType] + 1
            }
          };
        }
        return s;
      }));

      // Persist user reaction locally
      const updatedUserReactions = {
        ...userReactions,
        [storyId]: [...storyUserReactions, reactionType]
      };
      setUserReactions(updatedUserReactions);
      localStorage.setItem('unsaid_reactions', JSON.stringify(updatedUserReactions));
      
      toast.success("Echo received.");
    } catch (error) {
      console.error("Error reacting:", error);
      toast.error("The void failed to receive your echo.");
    }
  };

  const fetchStories = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLoadError(null);
    }

    try {
      const currentOffset = isLoadMore ? offset : 0;
      const fetchedStories = await getStories(PAGE_SIZE, currentOffset, filter ?? undefined);
      
      if (isLoadMore) {
        setStories(prev => [...prev, ...fetchedStories]);
        setOffset(currentOffset + fetchedStories.length);
        setHasMore(fetchedStories.length === PAGE_SIZE);
        setLoadingMore(false);
      } else {
        setStories(fetchedStories);
        setOffset(fetchedStories.length);
        setHasMore(fetchedStories.length === PAGE_SIZE);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      setLoadError(error instanceof Error ? error.message : 'Failed to fetch stories');
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [filter]);

  const formatDate = (date: Date) => {
    if (!date) return 'Just now';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEmotionIcon = (emotionId: string) => {
    const emotion = emotions.find(e => e.id === emotionId);
    if (!emotion) return null;
    const Icon = emotion.icon;
    return <Icon className="w-3 h-3" />;
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.02)_100%)]" />
        <div className="absolute inset-0 dot-matrix opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 mb-3 md:mb-4 block">The Community</span>
          <h1 className="text-4xl md:text-7xl mb-4 md:mb-6 leading-tight">Echoes of <br /><span className="opacity-30 italic">the unspoken.</span></h1>
          <p className="text-base md:text-lg opacity-60 max-w-2xl mx-auto leading-relaxed px-4">
            Shared stories from those who found the courage to whisper. 
            Read, reflect, and realize you are never alone in your silence.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap items-center justify-start md:justify-center gap-2 mb-8 md:mb-12 scrollbar-none px-4 -mx-4 md:px-0 md:mx-0">
          <button
            onClick={() => setFilter(null)}
            className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
              filter === null ? 'bg-foreground text-background' : 'bg-foreground/5 opacity-40 hover:opacity-100'
            }`}
          >
            All Whispers
          </button>
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => setFilter(emotion.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                filter === emotion.id ? 'bg-foreground text-background' : 'bg-foreground/5 opacity-40 hover:opacity-100'
              }`}
            >
              <emotion.icon className="w-3 h-3" />
              {emotion.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <div className="w-1 h-1 bg-foreground animate-ping mb-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Gathering echoes...</span>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 mb-4 text-red-400 opacity-40" />
            <h3 className="text-xl mb-2 font-mono uppercase tracking-widest">Unable to Gather Echoes</h3>
            <p className="text-xs opacity-60 leading-relaxed font-mono">
              {loadError}
            </p>
          </div>
        ) : stories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-0 md:px-0">
            <AnimatePresence mode="popLayout">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <StoryCard 
                    story={story}
                    userReactions={userReactions}
                    onReact={handleReact}
                    formatDate={formatDate}
                    getEmotionIcon={getEmotionIcon}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="mt-16 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchStories(true)}
                disabled={loadingMore}
                className="nothing-border h-14 px-10 bg-foreground/5 hover:bg-foreground/10 text-xs font-mono tracking-[0.3em] uppercase transition-all"
              >
                {loadingMore ? (
                  <>
                    <div className="w-1 h-1 bg-foreground animate-ping mr-3" />
                    Gathering More...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Hear More Echoes
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <MessageSquare className="w-8 h-8 mb-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-center">
              The void is silent for this emotion.<br />
              Be the first to whisper.
            </span>
          </div>
        )}
      </div>
    </main>
  );
};

export default CommunityEchoes;
