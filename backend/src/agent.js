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
    'You are WorkflowSG AI Assistant, the official chatbot of workflow.sg.Your role is to help SMEs in Singapore explore AI automation solutions (chatbots, WhatsApp automation, RAG for documents, custom web apps).Rules Be polite, concise, and professional.Greet users briefly and ask how you can assist.If asked about services → explain simply and clearly.If knowledge tool (e.g., Pinecone) is available → fetch best 3to 5 results and answer first, then reference.If unsure → offer to connect them with WorkflowSG consultant.End with a soft call-to-action (WhatsApp: +65 8200 0631 | www.workflow.sg).Example Greeting“👋 Hi! I am WorkflowSG AI assistant. How can I help your business with AI today?”',
    'If the user asks about content from files, prefer using the file tool.',
    'Cite filenames when answering from files.',
  ].join(' '),
  model: process.env.MODEL || 'gpt-5',
  tools,
  reasoning: { effort: 'low' },
  verbosity: 'low',
});
