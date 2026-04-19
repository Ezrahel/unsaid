import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackModal } from '@/components/FeedbackModal';
import { getCalApi } from "@calcom/embed-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const calLink = import.meta.env.VITE_CAL_LINK || "username/60min";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'The Journey', path: '/journey' },
    { name: 'Share Your Story', path: '/share-story' },
    { name: 'Echoes', path: '/echoes' },
  ];

  const NavItem = ({ link, onClick }: { link: typeof navLinks[0], onClick?: () => void }) => (
    <Link 
      to={link.path} 
      onClick={onClick}
      className={`transition-all hover:opacity-100 relative py-1 ${
        location.pathname === link.path 
          ? 'opacity-100 font-medium' 
          : 'opacity-60'
      }`}
    >
      {link.name}
      {location.pathname === link.path && (
        <span className="absolute bottom-0 left-0 w-full h-px bg-foreground" />
      )}
    </Link>
  );

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-foreground flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-background font-heading text-xs">U</span>
          </div>
          <span className="font-heading text-xl tracking-tighter">UNSAID</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
          {navLinks.map((link) => (
            <NavItem key={link.name} link={link} />
          ))}
          <div className="flex items-center gap-6 ml-4">
            <FeedbackModal />
            <Button 
              variant="outline" 
              className="nothing-border h-9 px-6 text-[10px] bg-foreground text-background hover:bg-foreground/90 transition-all font-mono tracking-widest"
              data-cal-link={calLink}
              data-cal-namespace="sessions"
              data-cal-config='{"layout":"month_view"}'
            >
              BOOK NOW
            </Button>
          </div>
        </div>
        
        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-4">
          <Link
            to="/share-story"
            className="font-mono text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            Share Your Story
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger render={
                <Button variant="ghost" size="icon" className="nothing-border">
                  <Menu className="w-5 h-5" />
                </Button>
              } 
            />
            <SheetContent side="right" className="nothing-border glass w-[280px] pl-6 pr-4 sm:w-[350px] sm:px-6">
              <SheetHeader className="text-left mb-12 px-0">
                <SheetTitle className="font-heading text-3xl tracking-tighter">UNSAID</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8 text-xs font-mono uppercase tracking-widest mt-8">
                {navLinks.map((link) => (
                  <NavItem key={link.name} link={link} onClick={() => setMobileMenuOpen(false)} />
                ))}
                
                <div className="pt-8 border-t border-foreground/5 space-y-6">
                  <Button 
                    variant="outline" 
                    className="nothing-border w-full py-6 text-[10px] bg-foreground text-background hover:bg-foreground/90 transition-all font-mono tracking-widest uppercase"
                    data-cal-link={calLink}
                    data-cal-namespace="sessions"
                    data-cal-config='{"layout":"month_view"}'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book Your Call
                  </Button>
                  <p className="font-mono text-[9px] opacity-40 leading-relaxed uppercase">
                    The listener is waiting. Your secrets are safe.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
