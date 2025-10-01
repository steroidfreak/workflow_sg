import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadEnv } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { promises as fs } from "fs";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";

loadEnv();

const {
  GEMINI_API_KEY,
  UI_USERNAME = "banana",
  UI_PASSWORD = "ilovebanana",
  NODE_ENV,
  CLIENT_ORIGIN,
  PORT: PORT_ENV,
} = process.env;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set. Please add it to your .env file.");
}

const PORT = Number(PORT_ENV) || 4000;

const parsedOrigins = (CLIENT_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const fallbackOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`
];
const allowedOrigins = parsedOrigins.length ? parsedOrigins : fallbackOrigins;
const allowedOriginSet = new Set(allowedOrigins);
allowedOriginSet.add(`http://localhost:${PORT}`);
allowedOriginSet.add(`http://127.0.0.1:${PORT}`);

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const app = express();

const corsConfig = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOriginSet.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsConfig));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 6,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputsDir = path.join(__dirname, "..", "outputs");
const frontendDir = path.join(__dirname, "..", "frontend");
const serveStatic = express.static(frontendDir, {
  extensions: ["html"],
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-store");
    }
  },
});

const SESSION_COOKIE = "nanobanana_session";
const sessions = new Map();

const isAuthenticated = (req) => {
  const token = req.cookies?.[SESSION_COOKIE];
  return token && sessions.has(token);
};

const requireAuth = (req, res, next) => {
  if (isAuthenticated(req)) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/session", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ authenticated: false });
  }

  const session = sessions.get(token);
  return res.json({ authenticated: true, username: session.username });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body ?? {};

  if (username === UI_USERNAME && password === UI_PASSWORD) {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { username, createdAt: Date.now() });

    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 12,
    });

    return res.json({ success: true, username });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    sessions.delete(token);
  }
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === "production",
  });
  return res.json({ success: true });
});

app.post("/api/generate", requireAuth, upload.array("images"), async (req, res) => {
  try {
    const files = req.files ?? [];
    const prompt = (req.body.prompt ?? "").trim();

    if (!files.length) {
      return res.status(400).json({ error: "Upload at least one reference image." });
    }

    const contents = [
      {
        role: "user",
        parts: [
          {
            text:
              prompt ||
              "Combine the provided clothing images onto the person photo, adjusting posture if needed.",
          },
          ...files.map((file) => ({
            inlineData: {
              data: file.buffer.toString("base64"),
              mimeType: file.mimetype,
            },
          })),
        ],
      },
    ];

    const config = {
      responseModalities: ["IMAGE", "TEXT"],
      systemInstruction: [
        {
          text:
            "1st image will be the person, 2nd and 3rd onwards will be the clothing. Combine and make the person wear the clothing. You can change the posture of the person.",
        },
      ],
    };

    const model = "gemini-2.5-flash-image-preview";

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
          const mimeType = part.inlineData.mimeType || "image/png";
          const extension = mime.getExtension(mimeType) || "png";
          const buffer = Buffer.from(part.inlineData.data || "", "base64");
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
    console.error("Error generating content", error);
    return res.status(500).json({ error: "Failed to generate content. Check server logs for details." });
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  return serveStatic(req, res, next);
});

app.get(/.*/, async (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const requestedPath = req.path === '/' ? 'index.html' : req.path.replace(/^\/+/, '');
  const filePath = path.join(frontendDir, requestedPath);
  const resolved = path.resolve(filePath);
  const root = path.resolve(frontendDir);

  if (!resolved.startsWith(root)) {
    return res.status(403).send({ error: "Forbidden" });
  }

  try {
    await fs.access(resolved);
    return res.sendFile(resolved);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).send({ error: "Not found" });
    }
    return next(error);
  }
});

app.use((error, req, res, next) => {
  if (error?.message === "Not allowed by CORS") {
    console.warn(`Blocked request from origin ${req.headers.origin}`);
    return res.status(403).json({ error: "Origin not allowed" });
  }
  return next(error);
});

app.listen(PORT, () => {
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`Allowed origins: ${Array.from(allowedOriginSet).join(", ") || "(all)"}`);
});






