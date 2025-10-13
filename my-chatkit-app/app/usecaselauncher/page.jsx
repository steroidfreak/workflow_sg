'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useMemo } from 'react';

function usePersistentDeviceId() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const storageKey = 'chatkit-device-id';
    let stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      const randomId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      stored = randomId;
      window.localStorage.setItem(storageKey, stored);
    }

    return stored;
  }, []);
}

function MyChat() {
  const deviceId = usePersistentDeviceId();

  const { control } = useChatKit({
    api: {
      async getClientSecret(currentClientSecret) {
        if (!deviceId) {
          throw new Error('Device identifier unavailable');
        }

        const response = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId,
            currentClientSecret: currentClientSecret ?? undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const message = error?.error ?? 'Failed to fetch client secret';
          throw new Error(message);
        }

        const payload = await response.json();
        return payload.client_secret;
      },
    },
  });

  return (
    <div className="chatkit-container">
      <ChatKit control={control} />
    </div>
  );
}

export default function UseCaseLauncherPage() {
  return (
    <main className="usecaselauncher-page">
      <header className="usecaselauncher-header">
        <h1>Use Case Launcher</h1>
        <p>
          Explore workflows powered by ChatKit. Start a session to collaborate with Workflow SG agents and your teammates
          in a dedicated workspace.
        </p>
      </header>
      <MyChat />
    </main>
  );
}
