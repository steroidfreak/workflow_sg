import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">Workflow SG</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Ship AI product marketing pages in days, not weeks.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <a className="transition hover:text-sky-600 dark:hover:text-sky-300" href="#features">
            Features
          </a>
          <a className="transition hover:text-sky-600 dark:hover:text-sky-300" href="#showcase">
            Showcase
          </a>
          <a className="transition hover:text-sky-600 dark:hover:text-sky-300" href="#testimonials">
            Testimonials
          </a>
          <a className="transition hover:text-sky-600 dark:hover:text-sky-300" href="#">
            Docs
          </a>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500">(c) {new Date().getFullYear()} Workflow SG. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
