import React from 'react';
import { useTheme } from '../lib/theme';
import { useDesign } from '../lib/design';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const buttonClass = isModern
    ? 'inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-cyan-100 shadow-lg shadow-cyan-500/20 transition hover:border-cyan-300 hover:text-cyan-50 focus:outline-none focus:ring focus:ring-cyan-500/40'
    : 'inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus:ring focus:ring-sky-500/30 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-200';

  return (
    <button type="button" onClick={toggleTheme} className={buttonClass}>
      <span className="sr-only">Toggle theme</span>
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
    </button>
  );
};

const SunIcon: React.FC = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
  </svg>
);

export default ThemeToggle;
