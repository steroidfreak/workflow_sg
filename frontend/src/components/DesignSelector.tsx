import React from 'react';
import { useDesign } from '../lib/design';

const options = [
  {
    value: 'classic' as const,
    label: 'Classic',
    description: 'Original Workflow.sg aesthetic',
  },
  {
    value: 'modern-programmer' as const,
    label: 'Modern programmer',
    description: 'Neon terminal-inspired look',
  },
];

const DesignSelector: React.FC = () => {
  const { design, setDesign } = useDesign();

  const containerClassName =
    design === 'modern-programmer'
      ? 'rounded-2xl border border-cyan-500/40 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 shadow-lg shadow-cyan-500/10 backdrop-blur'
      : 'rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-sm backdrop-blur';

  return (
    <div className={containerClassName} role="group" aria-label="Select design style">
      <div className="flex items-center gap-2">
        {options.map((option) => {
          const isActive = option.value === design;
          const baseButtonClass =
            design === 'modern-programmer'
              ? 'rounded-xl border border-cyan-500/20 bg-slate-900/40 px-3 py-1 font-semibold transition focus:outline-none focus-visible:ring focus-visible:ring-cyan-400/40'
              : 'rounded-xl border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 transition focus:outline-none focus-visible:ring focus-visible:ring-sky-400/30';

          const activeClass = isActive
            ? design === 'modern-programmer'
              ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-400/40 via-emerald-400/30 to-cyan-500/30 text-cyan-100 shadow-cyan-500/30'
              : 'border-sky-400 bg-sky-100 text-sky-700 shadow-sm'
            : design === 'modern-programmer'
              ? 'text-slate-300 hover:text-cyan-200'
              : 'text-slate-500 hover:text-slate-700';

          return (
            <button
              key={option.value}
              type="button"
              className={`${baseButtonClass} ${activeClass}`}
              onClick={() => setDesign(option.value)}
              aria-pressed={isActive}
            >
              <span className="block text-[11px] uppercase tracking-[0.25em]">{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed opacity-80">
        {options.find((option) => option.value === design)?.description}
      </p>
    </div>
  );
};

export default DesignSelector;
