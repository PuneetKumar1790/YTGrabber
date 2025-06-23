const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create "downloads" folder if it doesn't exist
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Serve frontend files
const FRONTEND_DIR = path.join(__dirname, '../frontend');
app.use(express.static(FRONTEND_DIR));

// Serve downloaded files
app.use('/downloads', express.static(DOWNLOAD_DIR));

// POST /api/download
app.post('/api/download', (req, res) => {
  const { url, quality } = req.body;

  if (!url || !quality) {
    return res.status(400).json({ message: 'URL and quality required' });
  }

  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const safeId = videoIdMatch ? videoIdMatch[1] : 'video';
  const timestamp = Date.now();
  const filename = `${safeId}_${timestamp}.mp4`;
  const outputPath = path.join(DOWNLOAD_DIR, filename);

  const formatMap = {
    "360": "18",
    "480": "135+140",
    "720": "22",
    "1080": "137+140"
  };
  const format = formatMap[quality] || "18";

  const command = `yt-dlp -f ${format} -o "${outputPath}" "${url}"`;
  console.log(`Executing: ${command}`);

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error('Download error:', error.message);
      return res.status(500).json({ message: 'Download failed', error: error.message });
    }

    // Ensure file exists before returning
    let attempts = 0;
    const waitForFile = () =>
      new Promise((resolve, reject) => {
        const check = () => {
          if (fs.existsSync(outputPath)) return resolve();
          if (++attempts > 10) return reject(new Error('File not found after retries'));
          setTimeout(check, 500);
        };
        check();
      });

    try {
      await waitForFile();
      res.json({
        message: 'Downloaded successfully',
        file: `/downloads/${filename}`,
        filename
      });
    } catch (err) {
      res.status(500).json({ message: 'File wait failed', error: err.message });
    }
  });
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(` YTGrabber Backend running at: http://localhost:${PORT}`);
});