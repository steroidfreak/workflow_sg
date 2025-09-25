# Gemini Outfit Agent Guide

## Purpose
Spin up a local Express UI that lets you drag/paste/capture reference photos (person + outfits) and call the Gemini `gemini-2.5-flash-image-preview` model. Outputs stream back as both data URLs and saved files.

## Prereqs
- Node.js 18+
- An API key with access to Gemini multimodal endpoints (set as `GEMINI_API_KEY`).
- Username/password for the UI (defaults to banana / ilovebanana, override via env).
- Dependencies: `npm install` reads from `package.json`.

## Quick Start
1. Copy `.env.example` to `.env`, add your Gemini key, adjust UI credentials if desired.
2. Run `npm install` (only once per clone).
3. Run `npm start` to serve the UI at `http://localhost:3000`.
4. Visit the site, sign in, drop or capture images, then hit Generate.

## Project Layout
- `src/server.js` – Express server, auth guard, multer upload handling, Gemini streaming bridge.
- `public/login.html` – Password gate for the app.
- `public/index.html` – Drag-and-drop UI shell.
- `public/app.js` – Client logic for previews, camera capture, prompt submission, result rendering, logout.
- `public/login.js` – Minimal login POST handler.
- `public/styles.css` – Styling for login + main UI.
- `outputs/` – Generated images written with timestamped filenames.

## Auth Notes
- Credentials stored in `.env` (`UI_USERNAME` / `UI_PASSWORD`).
- Successful login receives a httpOnly cookie (`nanobanana_session`) valid for 12 hours.
- `/api/generate` and other privileged routes enforce the session.
- `POST /api/logout` clears the cookie; the UI exposes a Sign out button.

## Agent Notes
- Always load dotenv early; fail fast if `GEMINI_API_KEY` missing.
- Keep uploads in memory (10MB max each) and send them as base64 inline data in the request.
- Maintain request order: first image = person, others = clothing.
- When streaming response chunks, capture both inline images and text; respond with JSON payload.
- Return data URLs so the browser previews instantly; also persist binaries on disk.

## Future Ideas
- Persist sessions to disk/Redis if you deploy.
- Add rate limiting per session.
- Support reordering previews so users can change image order.
- Allow history of generated outputs inside the UI.