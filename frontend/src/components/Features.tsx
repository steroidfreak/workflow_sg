import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const features = [
  {
    title: 'Composable UI blocks',
    description:
      'Pre-built sections with sensible defaults. Mix, match, and ship polished experiences without fiddling with boilerplate.',
    icon: '??',
  },
  {
    title: 'Crafted for AI products',
    description:
      'Chat-ready layout, citation modals, and loading states designed to support LLM-powered features from day one.',
    icon: '??',
  },
  {
    title: 'Motion-first architecture',
    description:
      'Framer Motion orchestrations drive cohesive entrances and subtle micro-interactions so everything feels alive.',
    icon: '?',
  },
  {
    title: 'Production minded',
    description:
      'Responsive by default, accessible color contrast, and sensible tokens make the hand-off to engineering seamless.',
    icon: '??',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6">
      <div className="space-y-12">
        <SectionHeader
          eyebrow="why it works"
          title="Launch with structure, iterate with confidence"
          description="Every section is responsive, themeable, and animation-ready so your team can focus on the core product experience."
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
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-500/20">
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
