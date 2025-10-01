import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import mime from 'mime';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', 'frontend');
const PORT = Number(process.env.FRONTEND_PORT) || 3000;

const resolvePath = (requestedPath = '/') => {
  const urlPath = requestedPath.split('?')[0] || '/';
  if (urlPath === '/' || urlPath === '') {
    return path.join(rootDir, 'index.html');
  }
  const decoded = decodeURIComponent(urlPath);
  return path.join(rootDir, decoded);
};

const sendFile = async (res, filePath) => {
  const contentType = mime.getType(filePath) || 'application/octet-stream';
  const data = await fs.readFile(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
};

const server = http.createServer(async (req, res) => {
  try {
    const targetPath = resolvePath(req.url);
    const normalizedRoot = path.resolve(rootDir);
    const normalizedTarget = path.resolve(targetPath);

    if (!normalizedTarget.startsWith(normalizedRoot)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    let finalPath = normalizedTarget;
    let stats;

    try {
      stats = await fs.stat(finalPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      throw error;
    }

    if (stats.isDirectory()) {
      finalPath = path.join(finalPath, 'index.html');
      try {
        await fs.access(finalPath);
      } catch {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
    }

    await sendFile(res, finalPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    console.error('Frontend server error', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Frontend available at http://localhost:${PORT}`);
});
