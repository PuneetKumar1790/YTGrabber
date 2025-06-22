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

// Serve downloaded files statically
app.use('/downloads', express.static(DOWNLOAD_DIR));

// Extract video ID from YouTube URL
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

app.post('/api/download', (req, res) => {
  const { url, quality } = req.body;

  if (!url || !quality) {
    return res.status(400).json({ message: 'URL and quality are required.' });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ message: 'Invalid YouTube URL' });
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
  const timestamp = Date.now();
  const outputPath = path.join(DOWNLOAD_DIR, `${videoId}_${timestamp}_%(title)s.%(ext)s`);
  
  const ytdlpPath = path.join(__dirname, 'yt-dlp.exe');
  const ffmpegPath = 'D:\\YT-Grabber\\ytgrabber-backend\\ffmpeg-7.1.1-essentials_build\\bin';

  const args = [
    url,
    '-f', formatCode,
    '--merge-output-format', 'mp4',
    '--postprocessor-args', 'FFmpeg:-movflags +faststart -map_metadata -1',
    '--no-embed-metadata',
    '-o', outputPath,
    '--ffmpeg-location', ffmpegPath,
    '--windows-filenames',
    '--print-json',
    '--no-progress'
  ];

  console.log(`Starting download: ${url} at ${quality}`);
  const ytdlp = spawn(ytdlpPath, args);

  let stdoutData = '';
  let stderrData = '';

  ytdlp.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  ytdlp.stderr.on('data', (data) => {
    stderrData += data.toString();
    console.error(`stderr: ${data}`);
  });

  ytdlp.on('error', (error) => {
    console.error(`Spawn error: ${error}`);
    res.status(500).json({ message: 'Failed to start download process' });
  });

  ytdlp.on('close', (code) => {
    if (code === 0) {
      try {
        // Parse yt-dlp JSON output to get filename
        const result = JSON.parse(stdoutData.split('\n').find(line => line.startsWith('{')));
        const filename = result._filename;
        const sanitizedFilename = path.basename(filename);
        
        console.log(`Download complete: ${sanitizedFilename}`);
        res.json({ 
          message: 'Download complete!',
          downloadUrl: `/downloads/${encodeURIComponent(sanitizedFilename)}`
        });
      } catch (parseError) {
        console.error('Error parsing output:', parseError);
        res.status(500).json({ message: 'Download completed but failed to parse output' });
      }
    } else {
      console.error(`Process exited with code ${code}`);
      console.error(`stderr output: ${stderrData}`);
      
      // Try to extract error message from stderr
      let errorMessage = 'Download failed';
      const errorMatch = stderrData.match(/ERROR: (.+)/);
      if (errorMatch) errorMessage = errorMatch[1];
      
      res.status(500).json({ message: errorMessage });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Downloads served from: ${DOWNLOAD_DIR}`);
});