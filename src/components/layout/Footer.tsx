import React from 'react';

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-foreground/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground flex items-center justify-center">
              <span className="text-background font-heading text-[10px]">U</span>
            </div>
            <span className="font-heading text-lg tracking-tighter">UNSAID</span>
          </div>
          <p className="font-mono text-[10px] opacity-40 uppercase tracking-widest">
            © 2024 UNSAID PLATFORM. SOUL HEALING THROUGH CONFIDENTIALITY.
          </p>
        </div>
        
        <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Safety</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
