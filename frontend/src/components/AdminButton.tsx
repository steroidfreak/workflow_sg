import React, { useState } from 'react';
import { useDesign } from '../lib/design';

const AdminButton: React.FC = () => {
  const { design } = useDesign();
  const isModern = design === 'modern-programmer';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const reindexDocuments = async () => {
    const token = import.meta.env.VITE_ADMIN_TOKEN;
    if (!token) {
      setStatus('error');
      setMessage('Admin token missing. Set VITE_ADMIN_TOKEN in your environment.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/rag/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Reindex request failed');
      }

      setStatus('success');
      setMessage('Reindex started successfully.');
    } catch (error) {
      const fallback = error instanceof Error ? error.message : 'Unexpected error';
      setStatus('error');
      setMessage(fallback);
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const buttonClass = isModern
    ? 'inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-100 shadow-lg shadow-cyan-500/20 transition hover:border-cyan-300 hover:text-cyan-50 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow transition hover:border-sky-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-200';
  const messageClass =
    status === 'error'
      ? isModern
        ? 'text-xs text-rose-400'
        : 'text-xs text-rose-500 dark:text-rose-300'
      : isModern
        ? 'text-xs text-emerald-300'
        : 'text-xs text-emerald-600 dark:text-emerald-300';

  return (
    <div className="flex flex-col items-end gap-2">
      <button type="button" onClick={reindexDocuments} disabled={status === 'loading'} className={buttonClass}>
        {status === 'loading' ? 'Reindexing...' : 'Admin Reindex'}
      </button>
      {message && <p className={messageClass}>{message}</p>}
    </div>
  );
};

export default AdminButton;
