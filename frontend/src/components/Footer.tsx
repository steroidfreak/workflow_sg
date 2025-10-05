import React from 'react';
import { useDesign } from '../lib/design';

const Footer: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const footerClass = isModern
    ? 'border-t border-cyan-500/30 bg-slate-950/80 backdrop-blur'
    : 'border-t border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950/80';
  const brandClass = isModern ? 'text-sm font-semibold tracking-tight text-cyan-100' : 'text-sm font-semibold tracking-tight text-slate-900 dark:text-white';
  const descriptionClass = isModern ? 'text-xs text-slate-400' : 'text-xs text-slate-600 dark:text-slate-400';
  const linkClass = isModern
    ? 'transition hover:text-cyan-200 text-xs text-slate-400'
    : 'transition hover:text-sky-600 text-xs text-slate-500 dark:text-slate-400 dark:hover:text-sky-300';
  const copyrightClass = isModern ? 'text-xs text-slate-500' : 'text-xs text-slate-500 dark:text-slate-500';

  return (
    <footer className={footerClass}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={brandClass}>Workflow.sg</p>
          <p className={descriptionClass}>AI automation, custom web apps, and process design for SMEs in Singapore.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a className={linkClass} href="#features">
            Capabilities
          </a>
          <a className={linkClass} href="#showcase">
            Use case
          </a>
          <a className={linkClass} href="#testimonials">
            Outcomes
          </a>
          <a className={linkClass} href="#cta">
            Free audit
          </a>
        </div>
        <p className={copyrightClass}>© {new Date().getFullYear()} Workflow.sg. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
