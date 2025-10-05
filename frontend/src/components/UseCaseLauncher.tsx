import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDesign } from '../lib/design';

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
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

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

  const panelClass = isModern
    ? 'pointer-events-auto flex w-[320px] flex-col rounded-3xl border border-cyan-500/40 bg-slate-950/90 p-5 text-sm text-slate-100 shadow-2xl shadow-cyan-500/30 backdrop-blur'
    : 'pointer-events-auto flex w-[320px] flex-col rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-800 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 dark:text-slate-100';
  const toggleClass = isModern
    ? 'pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:from-cyan-300 hover:to-emerald-400 focus:outline-none focus:ring focus:ring-cyan-500/40'
    : 'pointer-events-auto inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-500/30 transition hover:bg-slate-800 focus:outline-none focus:ring focus:ring-slate-500/30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';
  const cardClass = isModern
    ? 'group w-full rounded-2xl border border-cyan-500/30 bg-slate-950/60 px-4 py-3 text-left transition hover:border-cyan-400 hover:bg-slate-950/80'
    : 'group w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-sky-400 hover:bg-sky-50/60 dark:border-white/10 dark:bg-slate-900/80 dark:hover:border-sky-400/60 dark:hover:bg-slate-900';
  const componentLabelClass = isModern
    ? 'text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200'
    : 'text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400';
  const titleClass = isModern
    ? 'mt-1 text-base font-semibold text-cyan-100 transition group-hover:text-cyan-200'
    : 'mt-1 text-base font-semibold text-slate-900 transition group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300';
  const descriptionClass = isModern
    ? 'mt-2 text-xs text-slate-400 transition group-hover:text-slate-300'
    : 'mt-2 text-xs text-slate-600 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200';
  const ctaClass = isModern
    ? 'mt-3 inline-flex items-center text-xs font-semibold text-cyan-200 transition group-hover:text-cyan-100'
    : 'mt-3 inline-flex items-center text-xs font-semibold text-sky-600 transition group-hover:text-sky-500 dark:text-sky-300 dark:group-hover:text-sky-200';

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex flex-col items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="use-case-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={panelClass}
          >
            <div className="mb-4 space-y-1">
              <p className={componentLabelClass}>Use cases</p>
              <h4 className={isModern ? 'text-lg font-semibold text-cyan-100' : 'text-lg font-semibold text-slate-900 dark:text-white'}>Explore packaged components</h4>
              <p className={isModern ? 'text-xs text-slate-400' : 'text-xs text-slate-500 dark:text-slate-400'}>
                Pick a component to open its experience. Add or edit entries in <code>UseCaseLauncher.tsx</code> as your library grows.
              </p>
            </div>
            <div className="max-h-[56vh] space-y-3 overflow-y-auto pr-1">
              {useCases.map((useCase) => (
                <button key={useCase.component} type="button" onClick={() => handleCaseClick(useCase.action)} className={cardClass}>
                  <span className={componentLabelClass}>{useCase.component}</span>
                  <p className={titleClass}>{useCase.title}</p>
                  <p className={descriptionClass}>{useCase.description}</p>
                  <span className={ctaClass}>{useCase.ctaLabel}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)} className={toggleClass}>
        {isOpen ? 'Hide use cases' : 'Use case launcher'}
      </button>
    </div>
  );
};

export default UseCaseLauncher;
