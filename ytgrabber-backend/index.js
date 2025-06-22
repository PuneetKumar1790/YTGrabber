const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Serve downloaded files
app.use('/downloads', express.static(DOWNLOAD_DIR));

// Extract video ID for filename
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

app.post('/api/download', (req, res) => {
  const { url, quality } = req.body;
  const videoId = extractVideoId(url);

  if (!videoId) {
    return res.status(400).json({ message: 'Invalid YouTube URL' });
  }

  const timestamp = Date.now();
  const outputPath = path.join(DOWNLOAD_DIR, `${videoId}_${timestamp}_%(title)s.%(ext)s`);
  
  const args = [
    url,
    '-f', qualityMap[quality] || 'best',
    '-o', outputPath,
    '--print-json',
    '--no-progress'
  ];

  const ytdlp = spawn('yt-dlp', args);

  let stdoutData = '';
  ytdlp.stdout.on('data', (data) => stdoutData += data.toString());
  
  ytdlp.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(stdoutData.split('\n').find(line => line.startsWith('{')));
        const filename = path.basename(result._filename);
        
        res.json({
          message: 'Download complete!',
          downloadUrl: `/downloads/${filename}`,
          filename: filename
        });
      } catch (e) {
        res.status(500).json({ message: 'Filename parsing failed' });
      }
    } else {
      res.status(500).json({ message: 'Download failed' });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));