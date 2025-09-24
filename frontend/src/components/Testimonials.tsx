import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const testimonials = [
  {
    quote:
      'We shipped our new onboarding flow in half the time. The animations feel premium and the responsive defaults saved us countless QA cycles.',
    name: 'Mila Hart',
    role: 'Head of Design, RelayOps',
  },
  {
    quote:
      'Our engineers can now focus on business logic instead of rebuilding marketing sections. The chat panel scaffolding was an unexpected gift.',
    name: 'Oscar Jimenez',
    role: 'CTO, NovaForge',
  },
  {
    quote:
      'The built-in citation UX means our customers trust the responses from day one. We dropped in our API keys and demoed it the same afternoon.',
    name: 'Harper Lee',
    role: 'Product Lead, AtlasAI',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6">
      <div className="space-y-12">
        <SectionHeader
          eyebrow="people are talking"
          title="Designed with teams in mind"
          description="Product design, engineering, and GTM teams use this scaffold to prototype confidently and iterate on AI-first experiences."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
              className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20"
            >
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">"{testimonial.quote}"</p>
              <footer className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
