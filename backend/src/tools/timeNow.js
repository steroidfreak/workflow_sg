import { tool } from '@openai/agents';

export const timeNow = tool({
  name: 'time_now',
  description: 'Return the current date and time in both ISO 8601 and Asia/Singapore formats.',
  parameters: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  strict: false,
  execute: async () => {
    const now = new Date();
    const singaporeTime = now.toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `Current time: ${now.toISOString()} (ISO), ${singaporeTime} (Asia/Singapore)`;
  },
});
