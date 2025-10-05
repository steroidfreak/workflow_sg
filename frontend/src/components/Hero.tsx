import React from 'react';
import { motion, type Variants } from 'framer-motion';
import AdminButton from './AdminButton';
import { useDesign } from '../lib/design';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const Hero: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const backgroundGlowClass = isModern
    ? 'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.45),_transparent_70%)]'
    : 'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-sky-200/40 via-white to-slate-100 blur-3xl dark:from-sky-500/20 dark:via-slate-900 dark:to-slate-950';
  const badgeClass = isModern
    ? 'inline-flex items-center rounded-full border border-cyan-400/60 bg-slate-900/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200 shadow-lg shadow-cyan-500/20 backdrop-blur'
    : 'inline-flex items-center rounded-full border border-sky-300/50 bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400';
  const headingClass = isModern
    ? 'bg-gradient-to-r from-cyan-200 via-emerald-200 to-cyan-100 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl'
    : 'text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white';
  const descriptionClass = isModern
    ? 'mx-auto max-w-2xl text-base text-slate-300/80 sm:text-lg'
    : 'mx-auto max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300';
  const primaryCtaClass = isModern
    ? 'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:from-cyan-300 hover:to-emerald-400'
    : 'inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400';
  const secondaryCtaClass = isModern
    ? 'inline-flex items-center justify-center rounded-full border border-cyan-500/60 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400 hover:text-cyan-200'
    : 'inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400/60 hover:text-sky-600 dark:border-white/10 dark:text-slate-100 dark:hover:border-sky-400/60 dark:hover:text-sky-300';
  const featureCardClass = isModern
    ? 'relative w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-500/40 bg-slate-900/70 shadow-2xl shadow-cyan-500/20 backdrop-blur'
    : 'relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-sky-500/20';
  const featureHighlightClass = isModern
    ? 'absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_65%)]'
    : 'absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_60%)]';
  const insightCardClass = isModern
    ? 'relative w-full overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900/60 p-6 text-cyan-100 shadow-lg shadow-cyan-500/20'
    : 'relative w-full overflow-hidden rounded-2xl border border-sky-200 bg-sky-50/70 p-6 text-slate-700 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-slate-100';
  const listAccentClass = isModern ? 'bg-emerald-400' : 'bg-emerald-500';
  const statsCardClass = isModern
    ? 'rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-4'
    : 'rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/60';
  const statsLabelClass = isModern
    ? 'text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200'
    : 'text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300';
  const statsBodyClass = isModern
    ? 'mt-4 space-y-2 text-xs text-slate-300/80'
    : 'mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400';
  const statsPillClass = isModern
    ? 'rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 px-3 py-1 text-xs font-medium text-cyan-100'
    : 'rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/20 dark:text-sky-300';

  return (
    <section className="relative overflow-hidden">
      <div className={backgroundGlowClass} />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pt-6 sm:pt-10">
        <div className="flex w-full justify-end">
          <AdminButton />
        </div>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 text-center">
          <span className={badgeClass}>Workflow.sg</span>
          <h1 className={headingClass}>AI automation that pays for itself within weeks</h1>
          <p className={descriptionClass}>
            Workflow.sg helps SMEs in Singapore save time, cut costs, and boost productivity with AI-powered automation, custom web apps, and smart process design. We integrate with the tools you already use so results show up in days—not quarters.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#cta" className={primaryCtaClass}>
              Book a free workflow audit
            </a>
            <a href="#features" className={secondaryCtaClass}>
              Explore what we automate
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          className={featureCardClass}
        >
          <div className={featureHighlightClass} />
          <div className="relative grid gap-6 p-8 text-left sm:grid-cols-2 sm:p-10">
            <div className="space-y-3">
              <p className={isModern ? 'text-sm font-semibold text-cyan-200' : 'text-sm font-semibold text-sky-600 dark:text-sky-300'}>Automation built around your business</p>
              <h3 className={isModern ? 'text-xl font-semibold text-cyan-100' : 'text-xl font-semibold text-slate-900 dark:text-white'}>From triaging emails to guiding your team</h3>
              <p className={isModern ? 'text-sm text-slate-300/80' : 'text-sm text-slate-600 dark:text-slate-300'}>
                We remove repetitive tasks across email, WhatsApp, forms, and back-office systems. Every workflow is mapped first, then automated with AI that cites sources for accuracy and keeps your team in control.
              </p>
              <ul className={isModern ? 'space-y-2 text-sm text-slate-300/80' : 'space-y-2 text-sm text-slate-600 dark:text-slate-300'}>
                <li className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${listAccentClass}`} /><span>Custom web apps built on React and Node.js that fit seamlessly into existing operations.</span></li>
                <li className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${listAccentClass}`} /><span>Policy-aware chatbots with retrieval-augmented generation and citations.</span></li>
                <li className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${listAccentClass}`} /><span>WhatsApp journeys that capture, qualify, and hand over leads instantly.</span></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <div className={insightCardClass}>
                <p className={isModern ? 'text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200' : 'text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300'}>Real outcomes</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${isModern ? 'bg-cyan-400' : 'bg-sky-500'}`} /><span>Lead capture to instant reply to sales handover in a single flow.</span></li>
                  <li className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${isModern ? 'bg-cyan-400' : 'bg-sky-500'}`} /><span>Policy-aware Q&amp;A from PDFs and Word docs with source citations.</span></li>
                  <li className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${isModern ? 'bg-cyan-400' : 'bg-sky-500'}`} /><span>Operations updates that keep projects on track with fewer reminders.</span></li>
                </ul>
              </div>
              <div className={statsCardClass}>
                <div className={statsLabelClass}>Our 5-step playbook</div>
                <div className={statsBodyClass}>
                  <p>1. Discovery – identify bottlenecks and success metrics.</p>
                  <p>2. Design – map workflows and integrations.</p>
                  <p>3. Build – rapid prototyping with your data.</p>
                  <p>4. Launch – go live with training and monitoring.</p>
                  <p>5. Scale – expand automation once ROI is proven.</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className={statsPillClass}>Typical payback: weeks, not months</span>
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
