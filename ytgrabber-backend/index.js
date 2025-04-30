const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

app.post('/api/download', (req, res) => {
  const { url, quality } = req.body;

  if (!url || !quality) {
    return res.status(400).json({ message: 'URL and quality are required.' });
  }

  // Verified format combinations
  const qualityMap = {
    '360p': '18',       // MP4 container with audio
    '480p': '135+140',  // DASH video + audio
    '720p': '22',       // Standard HD MP4
    '1080p': '137+140',
    'best': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]'
  };

  const formatCode = qualityMap[quality] || qualityMap['best'];
  const outputPath = path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s');
  const ytdlpPath = path.join(__dirname, 'yt-dlp.exe');

  const ytdlp = spawn(ytdlpPath, [
    url,
    '-f', formatCode,
    '--merge-output-format', 'mp4',
    '--postprocessor-args', 'FFmpeg:-movflags +faststart -map_metadata -1',
    '--no-embed-metadata',
    '-o', outputPath,
    '--ffmpeg-location', 'D:\\YT-Grabber\\ytgrabber-backend\\ffmpeg-7.1.1-essentials_build\\bin',
    '--windows-filenames',
    '--verbose'
  ]);

  ytdlp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ytdlp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ytdlp.on('close', (code) => {
    if (code === 0) {
      res.json({ message: 'Download complete!' });
    } else {
      res.status(500).json({ message: 'Download failed. Check server logs.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});