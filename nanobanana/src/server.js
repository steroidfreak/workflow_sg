import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { promises as fs } from 'fs';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

loadEnv();

const { GEMINI_API_KEY, UI_USERNAME = 'banana', UI_PASSWORD = 'ilovebanana', NODE_ENV } = process.env;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. Please add it to your .env file.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 6,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const outputsDir = path.join(__dirname, '..', 'outputs');

const SESSION_COOKIE = 'nanobanana_session';
const sessions = new Map();

const isAuthenticated = (req) => {
  const token = req.cookies?.[SESSION_COOKIE];
  return token && sessions.has(token);
};

const requireAuth = (req, res, next) => {
  if (isAuthenticated(req)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const fileName = isAuthenticated(req) ? 'index.html' : 'login.html';
  return res.sendFile(path.join(publicDir, fileName));
});

app.use(express.static(publicDir));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body ?? {};

  if (username === UI_USERNAME && password === UI_PASSWORD) {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { username, createdAt: Date.now() });

    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 12, // 12 hours
    });

    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    sessions.delete(token);
  }
  res.clearCookie(SESSION_COOKIE);
  return res.json({ success: true });
});

app.post('/api/generate', requireAuth, upload.array('images'), async (req, res) => {
  try {
    const files = req.files ?? [];
    const prompt = (req.body.prompt ?? '').trim();

    if (!files.length) {
      return res.status(400).json({ error: 'Upload at least one reference image.' });
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt || 'Combine the provided clothing images onto the person photo, adjusting posture if needed.',
          },
          ...files.map((file) => ({
            inlineData: {
              data: file.buffer.toString('base64'),
              mimeType: file.mimetype,
            },
          })),
        ],
      },
    ];

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
      systemInstruction: [
        {
          text: '1st image will be the person, 2nd and 3rd onwards will be the clothing. Combine and make the person wear the clothing. You can change the posture of the person.',
        },
      ],
    };

    const model = 'gemini-2.5-flash-image-preview';

    await fs.mkdir(outputsDir, { recursive: true });

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    const images = [];
    const texts = [];
    let fileIndex = 0;

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts ?? [];

      for (const part of parts) {
        if (part.inlineData) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const extension = mime.getExtension(mimeType) || 'png';
          const buffer = Buffer.from(part.inlineData.data || '', 'base64');
          const fileName = `result_${Date.now()}_${fileIndex++}.${extension}`;
          const filePath = path.join(outputsDir, fileName);

          await fs.writeFile(filePath, buffer);

          images.push({
            fileName,
            mimeType,
            dataUrl: `data:${mimeType};base64,${part.inlineData.data}`,
          });
        } else if (part.text) {
          texts.push(part.text);
        }
      }
    }

    return res.json({ images, texts });
  } catch (error) {
    console.error('Error generating content', error);
    return res.status(500).json({ error: 'Failed to generate content. Check server logs for details.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`UI available at http://localhost:${PORT}`);
});