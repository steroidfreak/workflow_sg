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
import DesignSelector from './components/DesignSelector';
import { useDesign } from './lib/design';

const App: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const containerClassName = isModern
    ? 'relative min-h-screen bg-slate-950 text-slate-100 font-mono transition-colors duration-300'
    : 'min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100';

  const headerClassName = isModern
    ? 'flex items-center justify-between px-6 pt-8'
    : 'flex items-center justify-between px-6 pt-6';

  const controlsWrapperClassName = isModern
    ? 'flex items-center gap-3 rounded-full border border-cyan-500/40 bg-slate-900/70 px-3 py-2 shadow-lg shadow-cyan-500/20 backdrop-blur'
    : 'flex items-center gap-3';

  const brandLinkClass = isModern
    ? 'group flex items-center gap-3 rounded-full border border-cyan-500/40 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-500/20 transition hover:border-cyan-300 hover:text-cyan-50'
    : 'group flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:text-sky-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-200';

  return (
    <div className={containerClassName}>
      {isModern && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-20 bg-slate-950" />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.45),_transparent_65%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.35),_transparent_70%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(8,47,73,0.55)_0%,rgba(15,23,42,0.4)_40%,rgba(6,78,59,0.45)_100%)]" />
        </>
      )}
      <UseCaseLauncher />
      <header className={headerClassName}>
        <a href="#top" className={brandLinkClass}>
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
        <div className={controlsWrapperClassName}>
          <DesignSelector />
          <ThemeToggle />
        </div>
      </header>
      <Hero />
      <main className={isModern ? 'space-y-28 pb-32' : 'space-y-24 pb-24'}>
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



