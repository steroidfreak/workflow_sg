import { tool } from '@openai/agents';

const PARAMETERS_SCHEMA = {
  type: 'object',
  properties: {
    location: {
      type: 'string',
      description: 'City or location to fetch weather for.',
    },
    units: {
      type: 'string',
      description: 'Preferred units (metric or imperial).',
    },
  },
  required: ['location'],
  additionalProperties: false,
};

export const getWeather = tool({
  name: 'get_weather',
  description: 'Retrieve the current weather conditions for a given location (mock data).',
  parameters: PARAMETERS_SCHEMA,
  strict: false,
  execute: async (input) => {
    const payload = typeof input === 'string' ? safeParseJson(input) : input;
    const location = typeof payload?.location === 'string' ? payload.location.trim() : '';
    const units = typeof payload?.units === 'string' ? payload.units.trim().toLowerCase() : 'metric';

    if (!location) {
      return 'Unable to determine the location for the weather lookup.';
    }

    const unitLabel = units === 'imperial' ? 'F' : 'C';
    return `Live weather data is not connected yet. Assume ${location} is 29 degrees ${unitLabel}, humid with light winds.`;
  },
});

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
