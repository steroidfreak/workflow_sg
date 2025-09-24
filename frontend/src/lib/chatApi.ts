export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatApiResponse {
  answer: string;
  citations?: Array<{ id: string; label?: string; url?: string; chunk: string }>;
}

interface SendChatPayload {
  message: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const sendChatMessage = async ({ message, messages, signal }: SendChatPayload): Promise<ChatApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, messages }),
    signal,
  });

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: null }));
    const msg = error?.msg || 'Unable to reach chat service';
    throw new Error(msg);
  }

  return response.json();
};

function normalizeBaseUrl(raw: string | undefined) {
  if (!raw) {
    return '';
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '/') {
    return '';
  }
  return trimmed.replace(/\/$/, '');
}
