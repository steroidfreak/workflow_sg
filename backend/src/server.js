import 'dotenv/config';
import express from 'express';
import { run, user, assistant } from '@openai/agents';
import { agent } from './agent.js';

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res, next) => {
  try {
    const { message, messages } = req.body ?? {};
    const latestMessage = typeof message === 'string' ? message.trim() : '';

    if (!latestMessage && !Array.isArray(messages)) {
      const error = new Error('Message is required');
      error.status = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }

    const normalizedHistory = normalizeHistory(messages, latestMessage);
    if (normalizedHistory.length === 0) {
      const error = new Error('Message is required');
      error.status = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }

    const runResult = await run(agent, normalizedHistory, {
      maxTurns: 6,
      conversationId: req.body?.conversationId,
    });

    const answer = typeof runResult.finalOutput === 'string' ? runResult.finalOutput.trim() : '';
    if (!answer) {
      const error = new Error('Assistant did not return a response');
      error.status = 502;
      error.code = 'OPENAI_EMPTY_RESPONSE';
      throw error;
    }

    res.json({ answer, citations: [] });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = typeof err.status === 'number' ? err.status : 500;
  const code = typeof err.code === 'string' ? err.code : 'INTERNAL_ERROR';
  const msg = typeof err.message === 'string' ? err.message : 'Unexpected error';

  res.status(status).json({ ok: false, error: { code, msg } });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function normalizeHistory(messages, fallbackMessage) {
  const history = Array.isArray(messages) ? messages : [];
  const trimmed = history
    .filter((entry) => entry && typeof entry.content === 'string')
    .map((entry) => ({
      role: normalizeRole(entry.role),
      content: entry.content.trim(),
    }))
    .filter((entry) => entry.content.length > 0)
    .slice(-12);

  if (fallbackMessage && (trimmed.length === 0 || trimmed[trimmed.length - 1].role !== 'user')) {
    trimmed.push({ role: 'user', content: fallbackMessage.trim() });
  }

  return trimmed.map((entry) => (entry.role === 'assistant' ? assistant(entry.content) : user(entry.content)));
}

function normalizeRole(role) {
  if (role === 'assistant') return 'assistant';
  return 'user';
}
