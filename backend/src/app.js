const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { UPLOAD_DIR } = require('./middleware/upload');

const app = express();

app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','), credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Uploaded files: serve images inline, attachments as downloads, never sniff
app.use('/uploads', express.static(UPLOAD_DIR, {
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const ext = path.extname(filePath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      res.setHeader('Content-Disposition', 'attachment');
    }
  },
}));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'AXORA API is running', timestamp: new Date().toISOString() }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
