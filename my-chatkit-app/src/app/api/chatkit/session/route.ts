// app/api/chatkit/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

const WORKFLOW_ID = process.env.CHATKIT_WORKFLOW_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY || !WORKFLOW_ID) {
    return NextResponse.json(
      { error: 'ChatKit environment variables are not configured.' },
      { status: 500 }
    );
  }

  try {
    const payload = await request
      .json()
      .catch(() => ({ deviceId: undefined, currentClientSecret: undefined }));

    const { deviceId, currentClientSecret } = payload ?? {};

    if (!deviceId) {
      return NextResponse.json(
        { error: 'deviceId is required' },
        { status: 400 }
      );
    }

    const body: Record<string, unknown> = {
      workflow: { id: WORKFLOW_ID },
      user: deviceId,
    };

    if (currentClientSecret) {
      body.client_secret = currentClientSecret;
    }

    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: 'Failed to create ChatKit session',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ client_secret: data.client_secret });
  } catch (error) {
    console.error('ChatKit session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
