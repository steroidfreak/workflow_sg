import { z } from 'zod';
import { Agent, Runner } from '@openai/agents';

const WebResearchAgentSchema = z.object({
  companies: z.array(
    z.object({
      company_name: z.string(),
      industry: z.string(),
      headquarters_location: z.string(),
      company_size: z.string(),
      website: z.string(),
      description: z.string(),
      founded_year: z.number(),
    }),
  ),
});

const SummarizeAndDisplaySchema = z.object({
  company_name: z.string(),
  industry: z.string(),
  headquarters_location: z.string(),
  company_size: z.string(),
  website: z.string(),
  description: z.string(),
  founded_year: z.number(),
});

const webResearchAgent = new Agent({
  name: 'Web research agent',
  instructions:
    'You are a helpful assistant. Use web search to find information about the following company I can use in marketing asset based on the underlying topic.',
  model: 'gpt-5-mini',
  outputType: WebResearchAgentSchema,
  modelSettings: {
    reasoning: {
      effort: 'low',
      summary: 'auto',
    },
    store: true,
  },
});

const summarizeAndDisplay = new Agent({
  name: 'Summarize and display',
  instructions: 'Put the research together in a nice display using the output format described.\n',
  model: 'gpt-5',
  outputType: SummarizeAndDisplaySchema,
  modelSettings: {
    reasoning: {
      effort: 'minimal',
      summary: 'auto',
    },
    store: true,
  },
});

export const runWorkflow = async ({ input_as_text }) => {
  if (!input_as_text || typeof input_as_text !== 'string') {
    const error = new Error('Expected input_as_text to be a non-empty string');
    error.code = 'INVALID_INPUT';
    throw error;
  }

  const conversationHistory = [
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: input_as_text,
        },
      ],
    },
  ];

  const runner = new Runner({
    traceMetadata: {
      __trace_source__: 'agent-builder',
      workflow_id: 'wf_68e7384825dc8190bd14567ebc5132510af21f2af2290200',
    },
  });

  const webResearchAgentResultTemp = await runner.run(webResearchAgent, [...conversationHistory]);

  if (!webResearchAgentResultTemp?.finalOutput) {
    const error = new Error('Web research agent result is undefined');
    error.code = 'WEB_RESEARCH_AGENT_ERROR';
    throw error;
  }

  const newItems = Array.isArray(webResearchAgentResultTemp.newItems)
    ? webResearchAgentResultTemp.newItems
    : [];

  conversationHistory.push(...newItems.map((item) => item.rawItem).filter(Boolean));

  const webResearchAgentResult = {
    output_text: JSON.stringify(webResearchAgentResultTemp.finalOutput),
    output_parsed: webResearchAgentResultTemp.finalOutput,
  };

  const summarizeAndDisplayResultTemp = await runner.run(summarizeAndDisplay, [...conversationHistory]);

  if (!summarizeAndDisplayResultTemp?.finalOutput) {
    const error = new Error('Summarize and display agent result is undefined');
    error.code = 'SUMMARIZE_AGENT_ERROR';
    throw error;
  }

  const summarizeAndDisplayResult = {
    output_text: JSON.stringify(summarizeAndDisplayResultTemp.finalOutput),
    output_parsed: summarizeAndDisplayResultTemp.finalOutput,
  };

  return {
    webResearchAgentResult,
    summarizeAndDisplayResult,
  };
};
