import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendChatMessage, type ChatMessage } from '../lib/chatApi';

const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

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

  const toggleWidget = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setError(null);
      }
      return next;
    });
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-chat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[320px] sm:w-[360px] rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-2xl shadow-slate-300/60 backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Workflow Assistant</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by OpenAI</p>
              </div>
              <button
                type="button"
                onClick={toggleWidget}
                className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-100"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex h-60 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950/70">
              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {messages.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ask anything about Workflow SG and the assistant will help.
                  </p>
                )}
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                    className={
                      message.role === 'assistant'
                        ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-sky-100 px-3 py-2 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100'
                        : 'max-w-[85%] rounded-2xl rounded-tl-none bg-white px-3 py-2 text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-100'
                    }
                  >
                    {message.content}
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                disabled={isSubmitting}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question"
                className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </form>
            {error && <p className="mt-2 text-xs text-rose-500 dark:text-rose-300">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggleWidget}
        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/30 transition hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-500/30"
      >
        {isOpen ? 'Hide assistant' : 'Chat with Workflow SG'}
      </button>
    </div>
  );
};

export default FloatingChatWidget;
