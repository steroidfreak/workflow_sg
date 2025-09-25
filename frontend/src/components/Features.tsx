import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const features = [
  {
    title: 'AI automation across every channel',
    description:
      'Replace manual email replies, WhatsApp follow ups, form triage, and back-office updates with dependable AI flows that stay on brand.',
    icon: 'AI',
  },
  {
    title: 'Custom web apps that fit your stack',
    description:
      'React + Node.js builds that integrate with the tools you already use, extending operations without bloated platforms or licensing surprises.',
    icon: '<>',
  },
  {
    title: 'Policy-aware chatbots with citations',
    description:
      'RAG pipelines grounded in your PDFs, SOPs, and knowledge bases so every answer is accurate, referenced, and easy to trust.',
    icon: 'Q&A',
  },
  {
    title: 'WhatsApp-first customer journeys',
    description:
      'Capture leads, qualify prospects, and hand over to sales with seamless automation that keeps conversations human-ready.',
    icon: 'WA',
  },
  {
    title: 'Process design before automation',
    description:
      'We map workflows, surface bottlenecks, and agree on success metrics so every build targets measurable ROI from day one.',
    icon: 'MAP',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6">
      <div className="space-y-12">
        <SectionHeader
          eyebrow="capabilities"
          title="Practical automation that scales with your SME"
          description="Every engagement starts with your existing workflow. We slot in AI, custom apps, and integrations where they save hours, not create new busywork."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20"
            >
              <div className="absolute inset-px rounded-[22px] border border-white/60 dark:border-white/5" />
              <div className="relative flex h-full flex-col gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sm font-semibold tracking-[0.1em] text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                  {feature.icon}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
