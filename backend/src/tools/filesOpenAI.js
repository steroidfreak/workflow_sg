import { fileSearchTool } from '@openai/agents-openai';

export async function openAiFileSearchTool() {
  const vectorStoreId = process.env.VECTOR_STORE_ID || process.env.OPENAI_VECTOR_STORE_ID;
  if (!vectorStoreId) {
    throw new Error('VECTOR_STORE_ID environment variable is required when USE_OPENAI_FILE_TOOL is true.');
  }

  const ids = Array.isArray(vectorStoreId) ? vectorStoreId : String(vectorStoreId).split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    throw new Error('VECTOR_STORE_ID must contain at least one store id.');
  }

  return fileSearchTool(ids, {
    includeSearchResults: true,
    maxNumResults: 8,
  });
}
