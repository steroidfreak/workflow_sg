import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import ChatPanel from './components/ChatPanel';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import FloatingChatWidget from './components/FloatingChatWidget';
import UseCaseLauncher from './components/UseCaseLauncher';
import ThemeToggle from './components/ThemeToggle';
import Component from './components/Component';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <UseCaseLauncher />
      <header className="flex items-center justify-between px-6 pt-6">
        <a
          href="#top"
          className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:text-sky-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-200"
        >
          {/* <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 transition group-hover:border-sky-400 group-hover:text-sky-600 dark:border-white/20 dark:bg-slate-900/40 dark:text-slate-400 dark:group-hover:border-sky-400 dark:group-hover:text-sky-200">
            
          </span> */}
          <span className="leading-tight">
            <img
    src="/logo.png"
    alt="Your Brand Logo"
    className="h-8 w-auto block"
  />
            {/* <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">(replace this badge with your brand mark)</span> */}
          </span>
        </a>
        <ThemeToggle />
      </header>
      <Hero />
      <main className="space-y-24 pb-24">
        <Component />
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



