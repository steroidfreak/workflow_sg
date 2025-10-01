# Gemini Outfit Agent Guide

## Purpose
Spin up a split-stack Gemini outfit compositor: a locked-down backend API and a static frontend that handles uploads, previews, and result rendering.

## Prereqs
- Node.js 18+
- An API key with access to Gemini multimodal endpoints (set as `GEMINI_API_KEY`).
- Username/password for the UI (defaults to banana / ilovebanana, override via env).
- Dependencies installed via `npm install`.

## Quick Start
1. Copy `.env.example` to `.env`, add your Gemini key, and tweak credentials if desired.
2. Run `npm install` (only once per clone).
3. In one terminal run `npm run start:backend` to launch the API at `http://localhost:4000`.
4. In a second terminal run `npm run start:frontend` to serve the UI at `http://localhost:3000`.
5. Visit `http://localhost:3000`, sign in, drop or capture images, then press **Generate**.

## Project Layout
- `backend/server.js` – Express API, session handling, Gemini bridge, and secure file writes.
- `frontend/index.html` – Authenticated UI shell.
- `frontend/login.html` – Password gate for the app.
- `frontend/app.js` – Client logic for previews, camera capture, prompt submission, result rendering, logout.
- `frontend/login.js` – Login flow that targets the backend API.
- `frontend/styles.css` – Styling for login + main UI.
- `frontend/config.js` – Lightweight client-side config surface for the API base URL.
- `scripts/serve-frontend.mjs` – Minimal static file server for the frontend during local dev.
- `outputs/` – Generated images written with timestamped filenames.

## Auth Notes
- Credentials stored in `.env` (`UI_USERNAME` / `UI_PASSWORD`).
- Successful login receives an httpOnly cookie (`nanobanana_session`) valid for 12 hours.
- `/api/session`, `/api/generate`, and logout enforce the session.
- `POST /api/logout` clears the cookie; the UI exposes a **Sign out** button.
- Configure allowed browser origins via `CLIENT_ORIGIN` (comma separated list) in `.env`.

## Agent Notes
- Always load dotenv early; fail fast if `GEMINI_API_KEY` missing.
- Keep uploads in memory (10MB max each) and send them as base64 inline data in the request.
- Maintain request order: first image = person, others = clothing.
- When streaming response chunks, capture both inline images and text; respond with JSON payload.
- Return data URLs so the browser previews instantly; also persist binaries on disk.

## Future Ideas
- Persist sessions in a shared store instead of in-memory.
- Add rate limiting and audit logging.
- Swap the static frontend server for a production-grade CDN build.
- Expand health checks and monitoring endpoints.
