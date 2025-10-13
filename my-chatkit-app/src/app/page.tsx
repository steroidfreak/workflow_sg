'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';
import React from 'react';

function MyChat() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(currentClientSecret) {
        if (!currentClientSecret) {
          const res = await fetch('/api/chatkit/session', { method: 'POST' });
          const { client_secret } = await res.json();
          return client_secret;
        }
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentClientSecret }),
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return (
    <div style={{ height: '600px', width: '400px' }}>
      <ChatKit control={control} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MyChat />
    </main>
  );
}