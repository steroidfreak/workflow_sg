import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useDesign } from '../lib/design';

const testimonials = [
  {
    quote:
      'Our WhatsApp enquiries now route themselves. Leads get instant answers with citations, and my sales team only steps in when the customer is ready to book. Response time went from hours to seconds.',
    name: 'Clara Lim',
    role: 'Operations Manager, Logistics SME',
  },
  {
    quote:
      'Workflow.sg mapped our onboarding process before writing a single line of code. The custom app they built on React and n8n now saves us 70 man-hours every month.',
    name: 'Hanif Rahman',
    role: 'COO, Regional Maintenance Services',
  },
  {
    quote:
      'Policy-aware Q&A means our team finally trusts the assistant. New hires use it to find SOP answers with citations, and interruptions to senior staff have dropped dramatically.',
    name: 'Vanessa Teo',
    role: 'HR Lead, Healthcare Group',
  },
];

const Testimonials: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const cardClass = isModern
    ? 'flex h-full flex-col justify-between rounded-3xl border border-cyan-500/40 bg-slate-900/70 p-6 text-left text-slate-100 shadow-lg shadow-cyan-500/20 backdrop-blur'
    : 'flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20';
  const quoteClass = isModern ? 'text-sm leading-relaxed text-slate-200/80' : 'text-sm leading-relaxed text-slate-700 dark:text-slate-200';
  const nameClass = isModern ? 'font-semibold text-cyan-100' : 'font-semibold text-slate-900 dark:text-slate-100';
  const roleClass = isModern ? 'text-xs text-slate-400' : 'text-xs text-slate-500 dark:text-slate-400';

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6">
      <div className="space-y-12">
        <SectionHeader
          eyebrow="client outcomes"
          title="Built for SMEs that need progress fast"
          description="Leaders across operations, HR, and sales trust Workflow.sg to remove manual work, surface reliable answers, and prove ROI within weeks."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
              className={cardClass}
            >
              <p className={quoteClass}>"{testimonial.quote}"</p>
              <footer className="mt-6 text-sm">
                <p className={nameClass}>{testimonial.name}</p>
                <p className={roleClass}>{testimonial.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
