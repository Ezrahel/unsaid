import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Trash2, 
  Ghost, 
  Zap, 
  Flame,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCalApi } from "@calcom/embed-react";

const Journey = () => {
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

  const steps = [
    {
      id: '01',
      title: 'The Invitation',
      desc: 'Book your private session. Choose the medium that suits your soul—The Rant, Logical Counsel, or The Full Confession. Define your boundaries and prepare for release.',
      features: ['Private Booking System', 'Flexible Session Rhythms'],
      img: 'https://picsum.photos/seed/invitation/600/600'
    },
    {
      id: '02',
      title: 'The Connection',
      desc: 'Join the private call. A secure, end-to-end encrypted channel is established for your session. It is a direct bridge between your heavy heart and my empathetic ear.',
      features: ['Secure Private Call', 'Absolute Privacy'],
      img: 'https://picsum.photos/seed/connection/600/600',
      reverse: true
    },
    {
      id: '03',
      title: 'The Release',
      desc: 'This is your sanctuary. Pour out your mind, share your secrets, or seek logical advice. I am your dedicated witness, providing a weightless vessel for your unburdening.',
      features: ['Empathetic Witness', 'Non-Judgmental Space'],
      img: 'https://picsum.photos/seed/release/600/600'
    },
    {
      id: '04',
      title: 'The Healing',
      desc: 'What was shared is held in sacred trust. You leave the session lighter, with newfound clarity and a soul that has finally been heard. The healing begins here.',
      features: ['Soul Catharsis', 'Logical Clarity'],
      img: 'https://picsum.photos/seed/healing/600/600',
      reverse: true
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <h1 className="text-6xl md:text-9xl mb-8 leading-none">A Journey to <br /><span className="opacity-30">Total Silence.</span></h1>
          <p className="max-w-2xl mx-auto font-mono text-sm uppercase tracking-[0.2em] opacity-60">
            A digital ritual designed for the unburdening of the soul. No logs. No judgment. No trace.
          </p>
        </div>

        <div className="space-y-40">
          {steps.map((step, index) => (
            <div key={step.id} className={`grid md:grid-cols-2 gap-20 items-center ${step.reverse ? 'md:flex-row-reverse' : ''}`}>
              <div className={step.reverse ? 'md:order-2' : ''}>
                <div className="mb-8">
                  <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">Step {step.id}</span>
                  <h2 className="text-5xl md:text-6xl mt-2 mb-8">{step.title}</h2>
                  <p className="text-lg opacity-60 leading-relaxed mb-12">
                    {step.desc}
                  </p>
                  
                  <div className="space-y-4">
                    {step.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-foreground/5 nothing-border">
                        {step.id === '02' ? <Lock className="w-4 h-4 opacity-40" /> : <Shield className="w-4 h-4 opacity-40" />}
                        <span className="font-mono text-[10px] uppercase tracking-widest">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`relative aspect-square ${step.reverse ? 'md:order-1' : ''}`}>
                <div className="w-full h-full glass nothing-border p-4">
                  <img 
                    src={step.img} 
                    alt={step.title} 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-foreground/20" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-foreground/20" />
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <section className="mt-60 py-40 bg-foreground text-background text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-6xl md:text-8xl mb-12">Ready to unburden?</h2>
            <p className="max-w-xl mx-auto font-mono text-xs uppercase tracking-[0.3em] opacity-60 mb-12">
              The listeners are waiting. Your anonymity is guaranteed by our protocol.
            </p>
            <Button 
              className="h-16 px-12 bg-background text-foreground hover:bg-background/90 font-mono text-xs tracking-widest"
              data-cal-link={calLink}
              data-cal-namespace="sessions"
              data-cal-config='{"layout":"month_view"}'
            >
              BEGIN YOUR JOURNEY
            </Button>
          </div>
          
          {/* Abstract background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-heading leading-none">
              UNSAID
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Journey;
