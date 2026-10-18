import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const PUBLIC_GALLERY_DIR = path.join(__dirname, 'public', 'gallery');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_GALLERY_DIR)) {
  fs.mkdirSync(PUBLIC_GALLERY_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Get gallery photos
  app.get('/api/gallery-photos', (_req, res) => {
    try {
      if (fs.existsSync(GALLERY_FILE)) {
        const raw = fs.readFileSync(GALLERY_FILE, 'utf-8');
        const data = JSON.parse(raw);
        const photosArray = Array.isArray(data) ? data : (data.photos || []);
        return res.json({ success: true, photos: photosArray });
      }
      return res.json({ success: true, photos: null });
    } catch (err: any) {
      console.error('Error reading gallery file:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save gallery photos synced from Google Drive
  app.post('/api/gallery-photos', (req, res) => {
    try {
      const { photos } = req.body;
      if (!Array.isArray(photos) || photos.length === 0) {
        return res.status(400).json({ success: false, error: 'Invalid photos array' });
      }

      fs.writeFileSync(GALLERY_FILE, JSON.stringify(photos, null, 2), 'utf-8');

      const publicManifest = path.join(__dirname, 'public', 'gallery_photos.json');
      fs.writeFileSync(publicManifest, JSON.stringify(photos, null, 2), 'utf-8');

      console.log(`Saved ${photos.length} gallery photos successfully`);
      return res.json({ success: true, count: photos.length });
    } catch (err: any) {
      console.error('Error saving gallery photos:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
