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
            Workflow.sg
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
            AI automation that pays for itself within weeks
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Workflow.sg helps SMEs in Singapore save time, cut costs, and boost productivity with AI-powered automation, custom web apps, and smart process design. We integrate with the tools you already use so results show up in days—not quarters.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              Book a free workflow audit
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400/60 hover:text-sky-600 dark:border-white/10 dark:text-slate-100 dark:hover:border-sky-400/60 dark:hover:text-sky-300"
            >
              Explore what we automate
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
              <p className="text-sm font-semibold text-sky-600 dark:text-sky-300">Automation built around your business</p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">From triaging emails to guiding your team</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                We remove repetitive tasks across email, WhatsApp, forms, and back-office systems. Every workflow is mapped first, then automated with AI that cites sources for accuracy and keeps your team in control.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /><span>Custom web apps built on React and Node.js that fit seamlessly into existing operations.</span></li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /><span>Policy-aware chatbots with retrieval-augmented generation and citations.</span></li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /><span>WhatsApp journeys that capture, qualify, and hand over leads instantly.</span></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative w-full overflow-hidden rounded-2xl border border-sky-200 bg-sky-50/70 p-6 text-slate-700 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">Real outcomes</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-sky-500" /><span>Lead capture to instant reply to sales handover in a single flow.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-sky-500" /><span>Policy-aware Q&amp;A from PDFs and Word docs with source citations.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-sky-500" /><span>Operations updates that keep projects on track with fewer reminders.</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/60">
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Our 5-step playbook</div>
                <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <p>1. Discovery – identify bottlenecks and success metrics.</p>
                  <p>2. Design – map workflows and integrations.</p>
                  <p>3. Build – rapid prototyping with your data.</p>
                  <p>4. Launch – go live with training and monitoring.</p>
                  <p>5. Scale – expand automation once ROI is proven.</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                    Typical payback: weeks, not months
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
