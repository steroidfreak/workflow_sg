import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import ChatPanel from './components/ChatPanel';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import FloatingChatWidget from './components/FloatingChatWidget';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex justify-end px-6 pt-6">
        <ThemeToggle />
      </header>
      <Hero />
      <main className="space-y-24 pb-24">
        <Features />
        <Showcase />
        <ChatPanel />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
};

export default App;
