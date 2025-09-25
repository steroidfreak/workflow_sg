import React from 'react';
import { motion, type Variants } from 'framer-motion';
import AdminButton from './AdminButton';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-sky-200/40 via-white to-slate-100 blur-3xl dark:from-sky-500/20 dark:via-slate-900 dark:to-slate-950" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pt-6 sm:pt-10">
        <div className="flex w-full justify-end">
          <AdminButton />
        </div>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 text-center">
          <span className="inline-flex items-center rounded-full border border-sky-300/50 bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400">
            adaptive workflows
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
            Build delightful AI experiences faster than ever
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            A modern front-end scaffold for AI-first products. Responsive layouts, animation-ready sections, and integrated chat all wired up so you can launch with confidence.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#showcase"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              Explore the demo
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400/60 hover:text-sky-600 dark:border-white/10 dark:text-slate-100 dark:hover:border-sky-400/60 dark:hover:text-sky-300"
            >
              See what's inside
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-sky-500/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_60%)]" />
          <div className="relative grid gap-6 p-8 text-left sm:grid-cols-2 sm:p-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-sky-600 dark:text-sky-300">Realtime co-pilot</p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Context-aware assistance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Seamlessly combines your product docs and user activity to deliver answers with linked citations so your users feel grounded and in control.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/70 text-slate-600 dark:border-white/20 dark:bg-slate-900/40 dark:text-slate-300">
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                    image placeholder
                  </span>
                  <p className="text-sm">
                    Replace this block with your hero screenshot or product artwork to tailor the page.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Suggested size: 1280 × 960 PNG (remember to update the alt text when you replace this).
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Session ready
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <p>- Auto-chunk documents</p>
                  <p>- Citation modals out of the box</p>
                  <p>- Framer Motion transitions pre-configured</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                    Deploy in minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
