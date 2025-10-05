import React from 'react';
import { motion } from 'framer-motion';
import { useDesign } from '../lib/design';

const CTA: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const containerClass = isModern
    ? 'overflow-hidden rounded-[32px] border border-cyan-500/40 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/20 backdrop-blur sm:p-12'
    : 'overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-sky-200/30 via-white to-slate-50 p-8 shadow-2xl shadow-slate-200/60 dark:border-white/10 dark:bg-gradient-to-br dark:from-sky-500/20 dark:via-slate-900 dark:to-slate-950 dark:shadow-sky-500/30 sm:p-12';
  const badgeClass = isModern
    ? 'text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200'
    : 'text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-200';
  const headingClass = isModern ? 'text-3xl font-semibold text-cyan-100 sm:text-4xl' : 'text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl';
  const descriptionClass = isModern ? 'max-w-lg text-sm text-slate-300/80' : 'max-w-lg text-sm text-slate-600 dark:text-slate-100/80';
  const buttonClass = isModern
    ? 'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:from-cyan-300 hover:to-emerald-400'
    : 'inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';
  const subTextClass = isModern ? 'text-xs text-slate-400' : 'text-xs text-slate-500 dark:text-slate-200/60';

  return (
    <section id="cta" className="mx-auto max-w-5xl px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={containerClass}
      >
        <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="space-y-2">
            <p className={badgeClass}>ready to automate</p>
            <h3 className={headingClass}>Start with a free workflow audit</h3>
            <p className={descriptionClass}>
              Desmond Chua will review your current processes, map the quick wins, and outline how AI, custom apps, and integrations can save hours within weeks.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <a href="mailto:desmond@workflow.sg?subject=Free%20Workflow%20Audit" className={buttonClass}>
              Book your session
            </a>
            <span className={subTextClass}>No obligation | Typical prep in under 30 minutes</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
