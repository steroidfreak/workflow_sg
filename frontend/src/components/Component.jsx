import { useMemo, useState } from 'react';

const workflowSteps = [
  {
    title: 'WhatsApp',
    description: 'A customer sends a new inbound WhatsApp message to your business number.',
    accent: 'from-sky-400 to-sky-600',
  },
  {
    title: 'AI Agent',
    description: 'The message is routed to the Workflow SG AI agent which interprets intent and fetches context.',
    accent: 'from-emerald-400 to-emerald-600',
  },
  {
    title: 'WhatsApp',
    description: 'The AI-crafted reply is pushed back to the same WhatsApp chat for a seamless experience.',
    accent: 'from-violet-400 to-violet-600',
  },
];

const Component = () => {
  const [expanded, setExpanded] = useState(false);
  const timeline = useMemo(
    () =>
      workflowSteps.map((step, index) => ({
        ...step,
        id: `${index}-${step.title.toLowerCase()}`,
        position: index + 1,
      })),
    [],
  );

  return (
    <section className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm transition hover:border-sky-300 dark:border-white/10 dark:bg-slate-900/70">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center justify-between gap-6 rounded-3xl px-8 py-6 text-left text-slate-900 transition hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900/40"
        aria-expanded={expanded}
        aria-controls="agent-workflow-diagram"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Agent Workflow 1</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            WhatsApp → AI Agent → WhatsApp
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Click to explore how inbound conversations are captured, processed by the agent, and returned to the customer without
            leaving WhatsApp.
          </p>
        </div>
        <span
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-transform duration-300 dark:border-white/10 dark:bg-slate-900 dark:text-white ${
            expanded ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {expanded && (
        <div
          id="agent-workflow-diagram"
          className="space-y-8 border-t border-slate-200 px-8 pb-10 pt-8 transition dark:border-white/10"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {timeline.map((step, index) => (
              <div
                key={step.id}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-white shadow-inner ${step.accent}`}
                  aria-hidden="true"
                >
                  {step.position}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                  {step.description}
                </p>
                {index < timeline.length - 1 && (
                  <div className="absolute inset-y-1/2 -right-8 hidden w-16 -translate-y-1/2 items-center justify-center md:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-6 w-6 text-slate-400"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14m0 0l-5-5m5 5l-5 5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300">
            Hover on each step to highlight its purpose. Pair this diagram with live demos or copy updates to show how Workflow SG
            orchestrates every handoff between channels.
          </div>
        </div>
      )}
    </section>
  );
};

export default Component;
