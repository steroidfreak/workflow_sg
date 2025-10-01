import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface UseCaseItem {
  component: string;
  title: string;
  description: string;
  ctaLabel: string;
  action: () => void;
}

const openExternal = (url: string) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener');
  }
};

const scrollToSelector = (selector: string) => {
  if (typeof window === 'undefined') return;
  const target = document.querySelector(selector);
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const useCases: UseCaseItem[] = [
  {
    component: 'NanoBananaExperience',
    title: 'NanoBanana Automation Microsite',
    description:
      'nanobanana.workflow.sg: Unleash AI-powered creativity. Effortlessly combine and transform images with unparalleled precision.',
    ctaLabel: 'Open nanobanana.workflow.sg',
    action: () => openExternal('https://nanobanana.workflow.sg'),
  },
  {
    component: 'PixsnapExperience',
    title: 'Pixsnap Outfit Composer',
    description:
      'pixsnap.workflow.sg: Outfit product photography on demand. Merge references into clean hero shots in minutes.',
    ctaLabel: 'Open pixsnap.workflow.sg',
    action: () => openExternal('https://pixsnap.workflow.sg'),
  },

  {
    component: 'WhatsAppTriggerButton',
    title: 'WhatsApp Trigger Button',
    description:
      'Kick off a WhatsApp automation via n8n. Messages route through Pinecone for retrieval and answer with OpenAI in seconds.',
    ctaLabel: 'Preview trigger placeholder',
    action: () => openExternal('https://wa.me/6583695756'),
  },
  {
    component: 'DocumentAwareChatbot',
    title: 'Document-Aware Chatbot',
    description:
      'View the Workflow.sg assistant grounded in your documents or Pinecone/Qdrant vector stores for cited, policy-aware responses.',
    ctaLabel: 'Jump to chatbot',
    action: () => scrollToSelector('#chatbot'),
  },
];

const UseCaseLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const closePanel = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closePanel]);

  const handleCaseClick = useCallback(
    (caseAction: () => void) => {
      caseAction();
      closePanel();
    },
    [closePanel],
  );

  return (
    <div className="pointer-events-none fixed top-6 inset-x-0 z-50 flex flex-col items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="use-case-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex w-[320px] flex-col rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-800 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 dark:text-slate-100"
          >
            <div className="mb-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">Use cases</p>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Explore packaged components</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a component to open its experience. Add or edit entries in <code>UseCaseLauncher.tsx</code> as your library grows.
              </p>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 max-h-[56vh]">
              {useCases.map((useCase) => (
                <button
                  key={useCase.component}
                  type="button"
                  onClick={() => handleCaseClick(useCase.action)}
                  className="group w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-sky-400 hover:bg-sky-50/60 dark:border-white/10 dark:bg-slate-900/80 dark:hover:border-sky-400/60 dark:hover:bg-slate-900"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    {useCase.component}
                  </span>
                  <p className="mt-1 text-base font-semibold text-slate-900 transition group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
                    {useCase.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                    {useCase.description}
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-sky-600 transition group-hover:text-sky-500 dark:text-sky-300 dark:group-hover:text-sky-200">
                    {useCase.ctaLabel}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-500/30 transition hover:bg-slate-800 focus:outline-none focus:ring focus:ring-slate-500/30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        {isOpen ? 'Hide use cases' : 'Use case launcher'}
      </button>
    </div>
  );
};

export default UseCaseLauncher;




