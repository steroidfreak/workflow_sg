import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const mockSteps = [
  {
    label: 'Ask a question',
    content: '"How do I configure staging with feature flags?"',
  },
  {
    label: 'System retrieves docs',
    content: 'Source: deployment.md - section 4.2',
  },
  {
    label: 'Assistant replies with citations',
    content: 'Includes inline links and a modal preview of the exact doc chunk.',
  },
];

const Showcase: React.FC = () => {
  return (
    <section id="showcase" className="mx-auto max-w-6xl px-6">
      <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-2xl shadow-slate-200/60 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:shadow-sky-500/20">
        <div className="grid gap-10 p-8 sm:grid-cols-2 sm:p-12">
          <div className="space-y-8">
            <SectionHeader
              align="left"
              eyebrow="demo preview"
              title="Bring your AI workflows to life"
              description="Highly-polished cards, callouts, and timelines make it easy to tell your product story without custom builds."
            />
            <div className="space-y-4">
              {mockSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                    {step.label}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-100">{step.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/30">
              <div className="grid gap-4">
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/60">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">assistant</p>
                  <p className="text-sm text-slate-700 dark:text-slate-100">
                    Great news-staging supports feature flags via environment keys. Toggle them in your dashboard and our SDK will mirror the changes instantly.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-sky-700 dark:text-sky-300">
                    <span className="rounded-full border border-sky-300 bg-sky-100 px-2 py-1 dark:border-sky-500/40 dark:bg-sky-500/10">deployment.md</span>
                    <span className="rounded-full border border-sky-300 bg-sky-100 px-2 py-1 dark:border-sky-500/40 dark:bg-sky-500/10">feature-flags.mdx</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-400">
                  <p className="font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">confidence</p>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '86%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100">
                  <p className="font-semibold uppercase tracking-[0.3em]">up next</p>
                  <p className="mt-2">Summarise staging rollout steps, generate release notes, push to Notion.</p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-16 -z-10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.35),transparent_65%)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
