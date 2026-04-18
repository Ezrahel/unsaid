import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Shield, 
  Trash2, 
  Ghost,
  Lock,
  EyeOff,
  Zap,
  Activity,
  Cpu,
  Globe,
  Waves,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getCalApi } from "@calcom/embed-react";

const Home = () => {
  const [thought, setThought] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotten, setIsForgotten] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const calLink = import.meta.env.VITE_CAL_LINK || "username/60min";
  
  // Use a stable URL for Spline to prevent buffer errors on re-renders
  const splineScene = "https://prod.spline.design/6Wq1Q7YInESZgap9/scene.splinecode";

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace": "sessions"});
      cal("ui", {
        "theme": "dark",
        "styles": {
          "branding": {
            "brandColor": "#000000"
          }
        },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });
    })();
  }, []);

  const tickerMessages = [
    "A regret from London dissolved.",
    "A secret from Tokyo vaporized.",
    "A weight from New York lifted.",
    "A whisper from Berlin erased.",
    "A thought from Sydney forgotten."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUnburden = () => {
    if (!thought.trim()) return;
    setIsSubmitting(true);
    
    // Simulate the "unburdening" process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsForgotten(true);
      setThought('');
      
      // Reset after animation
      setTimeout(() => setIsForgotten(false), 3000);
    }, 2000);
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-40">
          <ErrorBoundary fallback={
            <div className="w-full h-full bg-background flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 dot-matrix opacity-[0.05]" />
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="w-[800px] h-[800px] rounded-full bg-foreground/5 blur-3xl"
              />
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest opacity-20">
                Visualizer Offline
              </div>
            </div>
          }>
            <Suspense fallback={
              <div className="w-full h-full bg-background/5 flex items-center justify-center">
                <div className="w-1 h-1 bg-foreground animate-ping" />
              </div>
            }>
              <Spline 
                key="spline-hero"
                scene={splineScene} 
                onLoad={() => setSplineLoaded(true)}
                onError={() => console.error("Spline failed to load")}
                style={{ width: '100%', height: '100%' }}
              />
            </Suspense>
          </ErrorBoundary>
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-foreground animate-ping" />
            </div>
          )}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Human Listener Active</span>
            </div>
            <h1 className="text-6xl md:text-9xl mb-6 leading-none">
              HEAL YOUR <br />
              <span className="opacity-30 italic">SOUL.</span>
            </h1>
            <p className="font-mono text-sm md:text-base uppercase tracking-[0.3em] opacity-60 max-w-2xl mx-auto mb-12">
              Pour out your mind. Share your secrets. Receive logical counsel.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 px-8 text-sm font-mono tracking-widest bg-foreground text-background hover:bg-foreground/90 group"
                data-cal-link={calLink}
                data-cal-namespace="sessions"
                data-cal-config='{"layout":"month_view"}'
              >
                BOOK A CALL NOW
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="h-14 px-8 text-sm font-mono tracking-widest nothing-border">
                LEARN THE ETHOS
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest opacity-40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to descend
        </motion.div>
      </section>

      {/* Live Ticker Bar */}
      <div className="w-full bg-foreground text-background py-3 overflow-hidden border-y border-background/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">System Status: Nominal</span>
              <Activity className="w-3 h-3 opacity-40" />
              <AnimatePresence mode="wait">
                <motion.span 
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-mono text-[10px] uppercase tracking-widest"
                >
                  {tickerMessages[tickerIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid: Anatomy of a Whisper */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4 block">The Protocol</span>
            <h2 className="text-5xl md:text-7xl mb-8">The Healing <br /><span className="opacity-30">Protocol.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 auto-rows-[300px]">
            <Card className="md:col-span-2 nothing-border glass p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-3xl mb-4">The Rant Protocol</h3>
                <p className="max-w-md opacity-60 leading-relaxed">
                  A high-velocity purge for immediate emotional friction. Pour out your mind without filters. I am your dedicated, non-judgmental witness.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-full h-full bg-[url('https://picsum.photos/seed/rant/800/800')] bg-cover grayscale" />
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest opacity-40">
                <Zap className="w-3 h-3" />
                <span>Active Listening Protocol</span>
              </div>
            </Card>

            <Card className="nothing-border bg-foreground text-background p-8 flex flex-col justify-between">
              <Lock className="w-8 h-8 opacity-40" />
              <div>
                <h3 className="text-2xl mb-2">Darkest Secrets</h3>
                <p className="text-xs opacity-60 leading-relaxed">
                  Share what you dread saying to anyone else. A safe, ephemeral vessel for your deepest truths and hidden narratives.
                </p>
              </div>
            </Card>

            <Card className="nothing-border glass p-8 flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <Globe className="w-6 h-6 opacity-40" />
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">Logical Counsel</span>
              </div>
              <div>
                <h3 className="text-2xl mb-2">Objective Advice</h3>
                <p className="text-xs opacity-60 leading-relaxed">
                  Receive logical, unbiased counsel on matters that weigh heavy. No judgment, just clarity and strategic perspective.
                </p>
              </div>
            </Card>

            <Card className="md:col-span-2 nothing-border glass p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex gap-12 items-center">
                <div className="space-y-4">
                  <h3 className="text-3xl">The Human Listener</h3>
                  <p className="max-w-sm opacity-60 leading-relaxed">
                    A trained, empathetic witness to your narrative. Not a judge, not a therapist—just a vessel for your soul's healing.
                  </p>
                </div>
                <div className="hidden md:block flex-1 h-32 bg-foreground/5 nothing-border relative overflow-hidden">
                  <div className="absolute inset-0 dot-matrix opacity-20" />
                  <motion.div 
                    className="absolute inset-0 bg-foreground/10"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="nothing-border h-10 px-6 font-mono text-[10px] tracking-widest"
                  data-cal-link={calLink}
                  data-cal-namespace="sessions"
                  data-cal-config='{"layout":"month_view"}'
                >
                  BOOK A SESSION
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sanctuary Section */}
      <section id="sanctuary" className="py-20 md:py-32 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-[1px] bg-foreground/20" />
            <span className="font-mono text-xs uppercase tracking-widest opacity-40">The Sanctuary</span>
          </div>

          <Card className="nothing-border p-6 md:p-12 glass relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isForgotten ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-5xl mb-8">Ready for <br /><span className="opacity-30">soul healing?</span></h2>
                  <p className="text-lg opacity-60 mb-8 leading-relaxed">
                    Sometimes typing isn't enough. Book a private call to pour out your mind, get logical advice, or share your darkest secrets with a dedicated listener.
                  </p>

                  <div className="space-y-6">
                    <Textarea 
                      placeholder="POUR OUT YOUR MIND HERE..."
                      className="min-h-[200px] bg-foreground/5 nothing-border focus:ring-0 text-lg font-mono placeholder:opacity-20 resize-none p-6"
                      value={thought}
                      onChange={(e) => setThought(e.target.value)}
                    />
                    
                    <Button 
                      onClick={handleUnburden}
                      disabled={!thought.trim() || isSubmitting}
                      className="w-full h-16 bg-foreground text-background font-mono tracking-[0.3em] text-sm hover:bg-foreground/90 disabled:opacity-20"
                    >
                      {isSubmitting ? "PURGING..." : "UNBURDEN"}
                    </Button>
                  </div>
                  
                  <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 opacity-40">
                        <Lock className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase tracking-tighter">100% Private Calls</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full md:w-auto h-12 px-6 bg-foreground text-background font-mono text-xs tracking-widest"
                      data-cal-link={calLink}
                      data-cal-namespace="sessions"
                      data-cal-config='{"layout":"month_view"}'
                    >
                      BOOK A CALL NOW
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="forgotten"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 md:py-20 text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-foreground/10 flex items-center justify-center mb-8"
                  >
                    <Ghost className="w-6 h-6 md:w-8 md:h-8 opacity-40" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl mb-4">It is gone.</h3>
                  <p className="font-mono text-[10px] md:text-xs opacity-40 uppercase tracking-widest">
                    Your thought has dissolved into the digital ether.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot matrix overlay */}
            <div className="absolute inset-0 pointer-events-none dot-matrix opacity-[0.03]" />
          </Card>
        </div>
      </section>

      {/* Whispers from the Void */}
      <section className="py-20 md:py-32 overflow-hidden bg-foreground/5">
        <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-6xl mb-4">Whispers from <br /><span className="opacity-30">the void.</span></h2>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40">Anonymous echoes of those who came before.</p>
        </div>
        
        <div className="flex gap-4 md:gap-8 px-6 animate-scroll-x">
          {[
            "I finally said it out loud, even if only to a screen.",
            "The weight is gone. I don't need to carry it anymore.",
            "A secret I've kept for 10 years, dissolved in seconds.",
            "I feel lighter. The silence is finally comfortable.",
            "No logs. No trace. Just peace.",
            "I finally said it out loud, even if only to a screen.",
            "The weight is gone. I don't need to carry it anymore.",
            "A secret I've kept for 10 years, dissolved in seconds.",
          ].map((whisper, i) => (
            <Card key={i} className="min-w-[260px] md:min-w-[300px] p-6 md:p-8 nothing-border glass italic text-base md:text-lg opacity-60 hover:opacity-100 transition-opacity">
              "{whisper}"
            </Card>
          ))}
        </div>
      </section>

      {/* The Unsaid Experience Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden group order-2 md:order-1">
              <img 
                src="https://picsum.photos/seed/sanctuary/1200/1500" 
                alt="Sanctuary" 
                className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-foreground/10 mix-blend-overlay" />
              <div className="absolute inset-0 border border-foreground/5" />
            </div>
            
            <div className="space-y-8 md:space-y-12 order-1 md:order-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4 block">The Experience</span>
                <h2 className="text-4xl md:text-7xl mb-6 md:mb-8 leading-tight">A ritual for the <br /><span className="opacity-30">modern soul.</span></h2>
                <p className="text-base md:text-lg opacity-60 leading-relaxed max-w-md">
                  I offer a clean, clinical yet warm space to confront your thoughts. No judgment, no logs, just a dedicated human listener for your deepest rants and secrets.
                </p>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { title: "The Rant Protocol", desc: "A high-velocity purge for immediate emotional friction. Scream, vent, and release." },
                  { title: "Logical Counsel", desc: "Objective feedback on complex life matters. We dive deep into the logic of your narrative." },
                  { title: "The Darkest Secret", desc: "A safe vessel for what you dread saying. Shared with me, then forgotten by the world." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6">
                    <div className="font-mono text-xs opacity-20">0{i+1}</div>
                    <div>
                      <h4 className="text-lg md:text-xl mb-2">{item.title}</h4>
                      <p className="text-xs md:text-sm opacity-40 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20">
          <div>
            <h2 className="text-5xl md:text-8xl leading-none mb-8">HEAL <br />YOUR SOUL.</h2>
            <div className="w-16 md:w-20 h-1 bg-background mb-8" />
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40 leading-loose">
              I believe in the power of being heard. In a world that judges everything, I offer the luxury of being understood without consequence.
            </p>
          </div>
          
          <div className="space-y-8 md:space-y-12">
            <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">01 / Catharsis</span>
                <h4 className="text-xl md:text-2xl">The power of the rant.</h4>
                <p className="text-sm md:text-base text-background/60 leading-relaxed">
                  Holding it in is toxic. Pouring it out is healing. I provide the vessel for your most intense emotional purges.
                </p>
              </div>
              <div className="space-y-4">
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">02 / Logic</span>
                <h4 className="text-xl md:text-2xl">Objective Counsel.</h4>
                <p className="text-sm md:text-base text-background/60 leading-relaxed">
                  When emotions cloud judgment, I offer a logical, unbiased perspective to help you navigate your darkest secrets.
                </p>
              </div>
            </div>

            <Separator className="bg-background/10" />

            <div className="grid grid-cols-2 md:flex md:flex-row gap-8 md:gap-12 items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl font-heading">99.9%</div>
                <div className="font-mono text-[8px] md:text-[10px] opacity-40 uppercase tracking-widest leading-tight">
                  Thoughts <br />Forgotten
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl font-heading">0.0%</div>
                <div className="font-mono text-[8px] md:text-[10px] opacity-40 uppercase tracking-widest leading-tight">
                  Data <br />Stored
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6 col-span-2 md:col-span-1 justify-center md:justify-start">
                <div className="text-3xl md:text-4xl font-heading">∞</div>
                <div className="font-mono text-[8px] md:text-[10px] opacity-40 uppercase tracking-widest leading-tight">
                  Peace of <br />Mind
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Protocol Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-7xl mb-6 md:mb-8">The Protocol.</h2>
            <p className="max-w-2xl mx-auto md:mx-0 opacity-60 font-mono text-xs md:text-sm uppercase tracking-widest">Technical specifications of the digital sanctuary.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
            {[
              { icon: Cpu, label: "Encryption", value: "AES-256-GCM", desc: "Military grade ephemeral keys." },
              { icon: Globe, label: "Network", value: "Decentralized", desc: "No central server storage points." },
              { icon: Zap, label: "Purge Speed", value: "< 2.0s", desc: "Instant memory wipe on submission." },
              { icon: Waves, label: "Frequency", value: "432Hz", desc: "Optimized for emotional resonance." }
            ].map((item, i) => (
              <div key={i} className="bg-background p-6 md:p-8 space-y-4 md:space-y-6">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 opacity-40" />
                <div>
                  <span className="block font-mono text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-2">{item.label}</span>
                  <span className="text-xl md:text-2xl font-heading">{item.value}</span>
                </div>
                <p className="text-[10px] md:text-xs opacity-60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 md:py-32 px-6 bg-foreground/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Shield, title: "Zero-Knowledge", desc: "No databases. No logs. No tracking. We literally cannot see what you write." },
              { icon: EyeOff, title: "Incognito by Design", desc: "Your session is isolated and wiped on refresh. No cookies, no local storage." },
              { icon: Trash2, title: "Auto-Dissolve", desc: "Thoughts vanish instantly after submission. The code itself deletes the variable." }
            ].map((item, i) => (
              <Card key={i} className="nothing-border p-6 md:p-8 glass group hover:bg-foreground hover:text-background transition-all duration-500">
                <item.icon className="w-6 h-6 md:w-8 md:h-8 mb-4 md:mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-lg md:text-xl mb-4 font-heading">{item.title}</h4>
                <p className="text-xs md:text-sm opacity-60 group-hover:opacity-80 leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 md:py-32 px-6 border-y border-foreground/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-20">
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-heading mb-2 md:mb-4">1.2M+</div>
              <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Thoughts Purged Globally</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-heading mb-2 md:mb-4 text-green-500">0.00</div>
              <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Data Leaks Recorded</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-heading mb-2 md:mb-4">14</div>
              <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Secure Global Nodes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 md:mb-20 text-center">
            <h2 className="text-3xl md:text-6xl mb-4">Common Inquiries.</h2>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40">Addressing the mechanics of silence.</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {[
              { q: "Is the data really gone?", a: "Yes. We utilize volatile memory processing. Once the submission is complete or the session ends, the memory addresses are overwritten." },
              { q: "Can law enforcement request my data?", a: "They can request it, but we have nothing to provide. We do not store logs, IPs, or content. You cannot subpoena a ghost." },
              { q: "How do you fund the platform?", a: "Through our premium 'Deep Unburdening' sessions and private institutional grants focused on digital privacy research." },
              { q: "Is there a mobile app?", a: "UNSAID is a web-first protocol. We believe the browser's incognito mode provides the best environment for ephemeral sessions." }
            ].map((item, i) => (
              <div key={i} className="group cursor-help">
                <div className="flex items-center justify-between py-4 md:py-6 border-b border-foreground/10 group-hover:border-foreground/30 transition-colors">
                  <h4 className="text-lg md:text-2xl pr-8">{item.q}</h4>
                  <Plus className="w-4 h-4 md:w-5 md:h-5 opacity-20 group-hover:rotate-45 transition-transform shrink-0" />
                </div>
                <p className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 text-xs md:text-sm opacity-60 leading-relaxed pt-0 group-hover:pt-4">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-6 md:mb-8">Join the Protocol.</h2>
          <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-8 md:mb-12 leading-loose">
            Receive updates on new security nodes and ephemeral features. <br className="hidden md:block" />We will never spam. We only whisper.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="EMAIL_ADDRESS" 
              className="flex-1 bg-transparent border-b border-background/20 focus:border-background outline-none font-mono text-[10px] md:text-xs uppercase tracking-widest py-2"
            />
            <Button variant="outline" className="nothing-border border-background/20 hover:bg-background hover:text-foreground h-10 px-8 font-mono text-[10px] tracking-widest w-full sm:w-auto">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-40 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-9xl mb-8 md:mb-12 leading-none">START <br /><span className="opacity-30">HEALING.</span></h2>
          <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-60 mb-12 md:mb-16 max-w-2xl mx-auto">
            The listener is waiting. Your secrets are safe with me.
          </p>
          <Button 
            className="h-16 md:h-20 px-10 md:px-16 text-base md:text-lg font-mono tracking-widest bg-foreground text-background hover:bg-foreground/90"
            data-cal-link={calLink}
            data-cal-namespace="sessions"
            data-cal-config='{"layout":"month_view"}'
          >
            BOOK YOUR CALL
          </Button>
        </div>
        
        {/* Decorative background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
          <span className="text-[30vw] md:text-[40vw] font-heading leading-none">VOID</span>
        </div>
      </section>
    </main>
  );
};

export default Home;
