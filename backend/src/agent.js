import 'dotenv/config';
import { Agent } from '@openai/agents';
import { timeNow } from './tools/timeNow.js';
import { getWeather } from './tools/getWeather.js';
import { localFilesTool } from './tools/filesLocal.js';
import { openAiFileSearchTool } from './tools/filesOpenAI.js';

const tools = [timeNow, getWeather];

if (process.env.USE_OPENAI_FILE_TOOL === 'true') {
  try {
    tools.push(await openAiFileSearchTool());
  } catch (error) {
    console.warn('Failed to initialize OpenAI file search tool:', error);
    tools.push(localFilesTool);
  }
} else {
  tools.push(localFilesTool);
}

export const agent = new Agent({
  name: 'Modular Chatbot',
  instructions: [
    'You are a concise, helpful assistant.',
    'If the user asks about content from files, prefer using the file tool.',
    'Cite filenames when answering from files.',
  ].join(' '),
  model: process.env.MODEL || 'gpt-5',
  tools,
  reasoning: { effort: 'low' },
  verbosity: 'low',
});
