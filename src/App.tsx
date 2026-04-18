import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Sessions from '@/pages/Sessions';
import Journey from '@/pages/Journey';
import ShareStory from '@/pages/ShareStory';
import CommunityEchoes from '@/pages/CommunityEchoes';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/share-story" element={<ShareStory />} />
            <Route path="/echoes" element={<CommunityEchoes />} />
          </Routes>
        </div>
        <Footer />
        <Toaster position="bottom-right" expand={false} richColors />
      </div>
    </Router>
  );
};

export default App;
