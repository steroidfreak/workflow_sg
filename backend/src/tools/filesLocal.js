import { tool } from '@openai/agents';
import path from 'node:path';
import { promises as fs } from 'node:fs';

const DEFAULT_BASE_DIR = process.env.LOCAL_FILES_DIR
  ? path.resolve(process.env.LOCAL_FILES_DIR)
  : path.resolve(process.cwd(), '../storage');

const ALLOWED_EXTENSIONS = new Set(['.md', '.mdx', '.txt', '.json', '.html']);
const MAX_FILES_SCANNED = 40;
const MAX_SNIPPET_LENGTH = 280;

export const localFilesTool = tool({
  name: 'local_file_search',
  description:
    'Search the local knowledge base mounted on the server. Provide a short query and the assistant will surface matching snippets with filenames.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search phrase to look for within the local files.',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of snippets to return (default 3).',
      },
    },
    required: ['query'],
    additionalProperties: false,
  },
  strict: false,
  execute: async (input) => {
    const payload = typeof input === 'string' ? safeParseJson(input) : input;
    const query = typeof payload?.query === 'string' ? payload.query.trim() : '';
    const maxResults = clampNumber(payload?.maxResults, 1, 5) ?? 3;

    if (!query) {
      return 'No query provided to local_file_search tool.';
    }

    const matches = await searchLocalFiles(query, maxResults);
    if (matches.length === 0) {
      return `No local files matched "${query}".`;
    }

    return matches
      .map((match, index) => {
        return `[source#${index + 1}] ${match.file}\n${match.snippet}`;
      })
      .join('\n\n');
  },
});

async function searchLocalFiles(query, maxResults) {
  try {
    const files = await collectFiles(DEFAULT_BASE_DIR);
    const lowercaseQuery = query.toLowerCase();
    const matches = [];

    for (const file of files) {
      if (matches.length >= maxResults) break;
      const content = await readFileSafe(file);
      if (!content) continue;

      const idx = content.toLowerCase().indexOf(lowercaseQuery);
      if (idx === -1) continue;

      const snippet = createSnippet(content, idx, lowercaseQuery.length);
      matches.push({ file: path.relative(DEFAULT_BASE_DIR, file), snippet });
    }

    return matches;
  } catch (error) {
    return [];
  }
}

async function collectFiles(baseDir) {
  const files = [];
  async function walk(currentDir) {
    if (files.length >= MAX_FILES_SCANNED) {
      return;
    }
    let dirEntries;
    try {
      dirEntries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      return;
    }

    for (const entry of dirEntries) {
      if (files.length >= MAX_FILES_SCANNED) {
        break;
      }
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  await walk(baseDir);
  return files;
}

async function readFileSafe(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    return buffer.toString('utf8').slice(0, 8000);
  } catch (error) {
    return null;
  }
}

function createSnippet(content, index, queryLength) {
  const start = Math.max(0, index - 120);
  const end = Math.min(content.length, index + queryLength + 160);
  const snippet = content.slice(start, end).replace(/\s+/g, ' ').trim();
  return snippet.slice(0, MAX_SNIPPET_LENGTH);
}

function clampNumber(value, min, max) {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.min(Math.max(numeric, min), max);
}

function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}
