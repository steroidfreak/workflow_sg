import { useMemo, useState } from 'react';

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const WebResearchAgentPanel = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const formattedSummary = useMemo(() => {
    if (!result?.summarizeAndDisplayResult?.output_parsed) {
      return null;
    }

    return result.summarizeAndDisplayResult.output_parsed;
  }, [result]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/web-research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_as_text: trimmed }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: { msg: 'Unable to reach workflow service' } }));
        const message = data?.error?.msg || 'Unable to reach workflow service';
        throw new Error(message);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-sky-500/20">
        <div className="grid gap-10 p-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Web research workflow</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Run the two-step agent workflow powered by the OpenAI Agents API. The first agent researches the company, and the second agent produces a marketing-ready summary.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="web-research-query" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Company prompt
              </label>
              <textarea
                id="web-research-query"
                className="h-28 w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Research marketing angles for Workflow SG in Singapore."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Running workflow…' : 'Run workflow'}
              </button>
              {error && <p className="text-xs text-rose-500 dark:text-rose-300">{error}</p>}
            </form>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Workflow output</h4>
              <span className="text-xs text-slate-500">Powered by @openai/agents</span>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
              {isLoading && <p>Agents are gathering information…</p>}
              {!isLoading && formattedSummary && (
                <div className="space-y-3">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{formattedSummary.company_name}</p>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    <span>{formattedSummary.industry}</span>
                    <span>•</span>
                    <span>{formattedSummary.headquarters_location}</span>
                    <span>•</span>
                    <span>Founded {formattedSummary.founded_year}</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">{formattedSummary.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-sky-600 dark:text-sky-300">
                    <a href={formattedSummary.website} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      Visit website
                    </a>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {formattedSummary.company_size}
                    </span>
                  </div>
                </div>
              )}
              {!isLoading && !formattedSummary && !error && <p className="text-slate-500 dark:text-slate-500">Run the workflow to see structured results here.</p>}
            </div>
            {result?.webResearchAgentResult?.output_parsed?.companies?.length > 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300">
                <p className="mb-2 font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Raw research</p>
                <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap text-[11px] text-slate-600 dark:text-slate-300">
                  {JSON.stringify(result.webResearchAgentResult.output_parsed, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function normalizeBaseUrl(raw) {
  if (!raw) {
    return '';
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '/') {
    return '';
  }
  return trimmed.replace(/\/$/, '');
}

export default WebResearchAgentPanel;
