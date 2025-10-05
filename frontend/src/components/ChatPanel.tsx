import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendChatMessage, type ChatMessage } from '../lib/chatApi';
import { useDesign } from '../lib/design';

interface Citation {
  id: string;
  label?: string;
  url?: string;
  chunk: string;
}

const ChatPanel: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isSubmitting) return;

      const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
      setMessages(nextMessages);
      setIsSubmitting(true);
      setError(null);

      try {
        const data = await sendChatMessage({ message: trimmed, messages: nextMessages });
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
        setCitations(data.citations ?? []);
        setInput('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [input, isSubmitting, messages],
  );

  const latestAssistantMessage = useMemo(
    () => messages.filter((msg) => msg.role === 'assistant').slice(-1)[0]?.content ?? '',
    [messages],
  );

  const containerClass = isModern
    ? 'overflow-hidden rounded-[32px] border border-cyan-500/40 bg-slate-950/70 shadow-xl shadow-cyan-500/20 backdrop-blur'
    : 'overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-sky-500/20';
  const transcriptClass = isModern
    ? 'space-y-4 rounded-3xl border border-cyan-500/40 bg-slate-900/70 p-4 text-slate-100 shadow-inner shadow-cyan-500/20'
    : 'space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70';
  const assistantBubbleClass = isModern
    ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-none border border-cyan-500/30 bg-gradient-to-br from-cyan-500/30 via-emerald-400/20 to-cyan-500/30 px-4 py-3 text-cyan-100 shadow-cyan-500/20'
    : 'ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-sky-100 px-4 py-3 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100';
  const userBubbleClass = isModern
    ? 'max-w-[85%] rounded-2xl rounded-tl-none border border-cyan-500/30 bg-slate-950/70 px-4 py-3 text-slate-100 shadow-inner shadow-cyan-500/10'
    : 'max-w-[85%] rounded-2xl rounded-tl-none bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-100';
  const promptLabelClass = isModern
    ? 'text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200'
    : 'text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400';
  const inputClass = isModern
    ? 'flex-1 rounded-full border border-cyan-500/40 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring focus:ring-cyan-400/30'
    : 'flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500';
  const submitClass = isModern
    ? 'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:from-cyan-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60';
  const responsePanelClass = isModern
    ? 'space-y-4 rounded-3xl border border-cyan-500/40 bg-slate-900/70 p-6 text-sm text-slate-100 shadow-inner shadow-cyan-500/20'
    : 'space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200';
  const citationButtonClass = isModern
    ? 'rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100 transition hover:border-cyan-300 hover:text-cyan-200'
    : 'rounded-full border border-sky-300 bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100';
  const modalBackdropClass = isModern
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-6 py-12 backdrop-blur'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6 py-12 backdrop-blur dark:bg-slate-950/80';
  const modalContentClass = isModern
    ? 'max-w-2xl space-y-4 rounded-3xl border border-cyan-500/40 bg-slate-950/90 p-8 text-left text-sm text-slate-100 shadow-2xl shadow-cyan-500/30'
    : 'max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-left text-sm text-slate-700 shadow-2xl dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200';
  const modalButtonClass = isModern
    ? 'rounded-full border border-cyan-500/40 px-3 py-1 text-xs text-cyan-100 transition hover:border-cyan-300 hover:text-cyan-200'
    : 'rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-200';
  const modalChunkClass = isModern
    ? 'whitespace-pre-line rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-4 text-[13px] leading-relaxed text-slate-100'
    : 'whitespace-pre-line rounded-2xl bg-slate-100 p-4 text-[13px] leading-relaxed text-slate-700 dark:bg-slate-950/80 dark:text-slate-100';

  return (
    <section id="chatbot" className="mx-auto max-w-6xl px-6">
      <div className={containerClass}>
        <div className="grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h3 className={isModern ? 'text-2xl font-semibold text-cyan-100' : 'text-2xl font-semibold text-slate-900 dark:text-white'}>Explore your automation assistant</h3>
            <p className={isModern ? 'text-sm text-slate-300/80' : 'text-sm text-slate-600 dark:text-slate-300'}>
              Ask how we stitch together AI, n8n, and your existing tools. Responses reference the policies and SOPs you provide so stakeholders can see exactly where an answer comes from.
            </p>
            <div className={transcriptClass}>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 text-sm">
                {messages.length === 0 && (
                  <p className={isModern ? 'text-slate-400' : 'text-slate-500 dark:text-slate-500'}>No questions yet. Try asking how Workflow.sg would plug into your stack.</p>
                )}
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={message.role === 'assistant' ? assistantBubbleClass : userBubbleClass}
                  >
                    {message.content}
                  </motion.div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="chat-input" className={promptLabelClass}>
                  prompt
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="chat-input"
                    type="text"
                    value={input}
                    disabled={isSubmitting}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="e.g. How do we sync WhatsApp leads into HubSpot?"
                    className={inputClass}
                  />
                  <button type="submit" disabled={isSubmitting} className={submitClass}>
                    {isSubmitting ? 'Thinking...' : 'Send'}
                  </button>
                </div>
                {error && <p className={isModern ? 'text-xs text-rose-400' : 'text-xs text-rose-500 dark:text-rose-300'}>{error}</p>}
              </form>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className={isModern ? 'text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200' : 'text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300'}>
                workflow assistant
              </h4>
              <span className={isModern ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>Cited responses</span>
            </div>
            <div className={responsePanelClass}>
              {latestAssistantMessage ? (
                <p>{latestAssistantMessage}</p>
              ) : (
                <p className={isModern ? 'text-slate-400' : 'text-slate-500 dark:text-slate-500'}>Assistant answers will appear here along with any citations.</p>
              )}
              {citations.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {citations.map((citation, index) => (
                    <button
                      key={citation.id}
                      type="button"
                      onClick={() => setActiveCitation(citation)}
                      className={citationButtonClass}
                    >
                      {citation.label ?? `Citation ${index + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeCitation && (
          <motion.div
            key={activeCitation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalBackdropClass}
            onClick={() => setActiveCitation(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className={modalContentClass}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={isModern ? 'text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200/80' : 'text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400'}>source chunk</p>
                  {activeCitation.url ? (
                    <a
                      href={activeCitation.url}
                      target="_blank"
                      rel="noreferrer"
                      className={isModern ? 'text-base font-semibold text-cyan-200 hover:text-cyan-100' : 'text-base font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200'}
                    >
                      {activeCitation.label ?? 'View source'}
                    </a>
                  ) : (
                    <p className={isModern ? 'text-base font-semibold text-cyan-100' : 'text-base font-semibold text-sky-600 dark:text-sky-300'}>
                      {activeCitation.label ?? 'Citation'}
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => setActiveCitation(null)} className={modalButtonClass}>
                  Close
                </button>
              </div>
              <p className={modalChunkClass}>{activeCitation.chunk}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ChatPanel;
