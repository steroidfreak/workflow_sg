import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendChatMessage, type ChatMessage } from '../lib/chatApi';

interface Citation {
  id: string;
  label?: string;
  url?: string;
  chunk: string;
}

const ChatPanel: React.FC = () => {
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

  return (
    <section id="chatbot" className="mx-auto max-w-6xl px-6">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-sky-500/20">
        <div className="grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Explore your automation assistant</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Ask how we stitch together AI, n8n, and your existing tools. Responses reference the policies and SOPs you provide so stakeholders can see exactly where an answer comes from.
            </p>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 text-sm">
                {messages.length === 0 && <p className="text-slate-500 dark:text-slate-500">No questions yet. Try asking how Workflow.sg would plug into your stack.</p>}
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={
                      message.role === 'assistant'
                        ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-sky-100 px-4 py-3 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100'
                        : 'max-w-[85%] rounded-2xl rounded-tl-none bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-100'
                    }
                  >
                    {message.content}
                  </motion.div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="chat-input" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
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
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Thinking...' : 'Send'}
                  </button>
                </div>
                {error && <p className="text-xs text-rose-500 dark:text-rose-300">{error}</p>}
              </form>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                workflow assistant
              </h4>
              <span className="text-xs text-slate-500">Cited responses</span>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
              {latestAssistantMessage ? (
                <p>{latestAssistantMessage}</p>
              ) : (
                <p className="text-slate-500 dark:text-slate-500">Assistant answers will appear here along with any citations.</p>
              )}
              {citations.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {citations.map((citation, index) => (
                    <button
                      key={citation.id}
                      type="button"
                      onClick={() => setActiveCitation(citation)}
                      className="rounded-full border border-sky-300 bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6 py-12 backdrop-blur dark:bg-slate-950/80"
            onClick={() => setActiveCitation(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-left text-sm text-slate-700 shadow-2xl dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">source chunk</p>
                  {activeCitation.url ? (
                    <a
                      href={activeCitation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                      {activeCitation.label ?? 'View source'}
                    </a>
                  ) : (
                    <p className="text-base font-semibold text-sky-600 dark:text-sky-300">
                      {activeCitation.label ?? 'Citation'}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCitation(null)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-200"
                >
                  Close
                </button>
              </div>
              <p className="whitespace-pre-line rounded-2xl bg-slate-100 p-4 text-[13px] leading-relaxed text-slate-700 dark:bg-slate-950/80 dark:text-slate-100">
                {activeCitation.chunk}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ChatPanel;
