import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mic, 
  MessageSquare, 
  ShieldCheck, 
  VideoOff, 
  AudioLines, 
  Fingerprint,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCalApi } from "@calcom/embed-react";

const Sessions = () => {
  const calLink = import.meta.env.VITE_CAL_LINK || "username/60min";

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

  const sessions = [
    {
      id: '01',
      title: 'The Rant',
      duration: '30 MINS',
      desc: 'A high-velocity purge for immediate emotional friction. For when you just need to scream and be heard without judgment.',
      features: ['Unfiltered Listening', 'Emotional Catharsis'],
      highlight: false
    },
    {
      id: '02',
      title: 'Logical Counsel',
      duration: '60 MINS',
      desc: 'A surgical deep dive into complex narratives. Combine raw honesty with objective feedback and logical strategic perspective.',
      features: ['Objective Advice', 'Strategic Clarity'],
      highlight: true,
      tag: 'MOST SELECTED'
    },
    {
      id: '03',
      title: 'The Full Confession',
      duration: '90 MINS',
      desc: 'A safe vessel for your darkest secrets. A structured 90-minute journey to share what you dread saying to anyone else.',
      features: ['Absolute Confidentiality', 'Soul Healing'],
      highlight: false,
      fullWidth: true
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="inline-block bg-yellow-400 text-black px-2 py-1 text-[10px] font-mono mb-4 uppercase tracking-widest">
            Service Menu
          </div>
          <h1 className="text-6xl md:text-8xl mb-8">Session Types.</h1>
          <p className="max-w-2xl text-lg opacity-60 leading-relaxed">
            Select your medium of release. Every session is protected by our triple-layer anonymity protocol. 
            What is said here, stays here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {sessions.slice(0, 2).map((session) => (
            <Card key={session.id} className={`nothing-border p-8 md:p-12 relative overflow-hidden flex flex-col justify-between ${session.highlight ? 'bg-foreground text-background' : 'glass'}`}>
              {session.tag && (
                <div className="absolute top-8 right-8 bg-yellow-400 text-black px-2 py-1 text-[10px] font-mono uppercase tracking-widest">
                  {session.tag}
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-start mb-12">
                  <span className="font-mono text-xs opacity-40">{session.id}</span>
                  <span className="font-mono text-xs opacity-40">{session.duration}</span>
                </div>
                <h3 className="text-4xl md:text-5xl mb-6">{session.title}</h3>
                <p className={`mb-12 leading-relaxed ${session.highlight ? 'text-background/60' : 'opacity-60'}`}>
                  {session.desc}
                </p>
              </div>

              <div className="space-y-4">
                {session.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 opacity-60">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{f}</span>
                  </div>
                ))}
                <Button 
                  variant={session.highlight ? 'secondary' : 'outline'} 
                  className="w-full mt-8 nothing-border h-12 font-mono text-[10px] tracking-widest"
                  data-cal-link={calLink}
                  data-cal-namespace="sessions"
                  data-cal-config='{"layout":"month_view"}'
                >
                  RESERVE SLOT
                </Button>
              </div>

              {session.highlight && (
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/seed/abstract/800/600')] bg-cover mix-blend-overlay" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Full Width Card */}
        <Card className="nothing-border p-8 md:p-12 glass mb-32 relative overflow-hidden">
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <span className="font-mono text-xs opacity-40">03</span>
                <div className="w-12 h-[1px] bg-foreground/20" />
                <span className="font-mono text-xs opacity-40 uppercase tracking-widest">The Full Confession</span>
              </div>
              <h3 className="text-5xl md:text-7xl mb-8">Complete <br />Unburdening.</h3>
              
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div>
                  <span className="block font-mono text-[10px] opacity-40 uppercase tracking-widest mb-2">Length</span>
                  <span className="text-xl">90 Minutes</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] opacity-40 uppercase tracking-widest mb-2">Privacy</span>
                  <span className="text-xl">Biometric-Free</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] opacity-40 uppercase tracking-widest mb-2">Medium</span>
                  <span className="text-xl">Hybrid Protocol</span>
                </div>
              </div>

              <p className="opacity-60 leading-relaxed mb-12 max-w-xl">
                Our most immersive offering. A structured 90-minute journey that includes a pre-session meditation 
                and a post-session resolution summary. Designed for life-altering shifts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="h-12 px-8 bg-foreground text-background font-mono text-[10px] tracking-widest"
                  data-cal-link={calLink}
                  data-cal-namespace="sessions"
                  data-cal-config='{"layout":"month_view"}'
                >
                  BOOK THE EXPERIENCE
                </Button>
                <Button variant="outline" className="h-12 px-8 nothing-border font-mono text-[10px] tracking-widest">
                  VIEW SYLLABUS
                </Button>
              </div>
            </div>
            
            <div className="relative aspect-square">
              <img 
                src="https://picsum.photos/seed/monolith/800/800" 
                alt="Monolith" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-foreground/10" />
            </div>
          </div>
        </Card>

        {/* Bottom Section */}
        <div className="pt-20 border-t border-foreground/5">
          <h2 className="text-4xl mb-16">Privacy as a Luxury Standard</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: VideoOff, title: 'Video-Off Logic', desc: 'By default, all sessions are audio or text-only. We believe the eye distracts from the ear. Focus entirely on the frequency of your own truth.' },
              { icon: AudioLines, title: 'Voice Synthesis', desc: 'Optionally apply a real-time vocal filter to mask identity. Our AI maintains emotional cadence while stripping biometric markers from the signal.' },
              { icon: Fingerprint, title: 'Zero Trace Data', desc: 'We do not log IPs or session metadata. Once your window closes, the encryption keys are destroyed. Your session never existed.' }
            ].map((item, i) => (
              <div key={i} className="space-y-6">
                <div className="w-12 h-12 bg-foreground/5 flex items-center justify-center">
                  <item.icon className="w-6 h-6 opacity-60" />
                </div>
                <h4 className="text-xl font-heading">{item.title}</h4>
                <p className="text-sm opacity-60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sessions;
