# 🎬 YTGrabber — Ad-Free YouTube Video Downloader

Download high-quality YouTube videos without Premium, ads, or third-party trackers — runs completely on your own device.

GitHub Repo: https://github.com/PuneetKumar1790/YTGrabber

---

## ⚡ Features

- 🔥 Download 1080p videos without YouTube Premium  
- 🧠 Fully local — no data sent to third-party servers  
- 🚫 Zero ads, trackers, or captchas  
- 💻 Cross-platform: Windows, Linux, macOS, Android (via Termux)  
- 💸 Free forever — no paywalls or subscriptions  
- ⚙️ Uses yt-dlp + ffmpeg behind the scenes

---

## 📸 Interface Preview

> Minimal, modern, and built for productivity.

![YTGrabber Screenshot](https://github.com/user-attachments/assets/51baa241-f42f-4ad2-919c-19d9bfe39b2b)

---

## 🚀 Installation

🧰 Prerequisites:

- Node.js (v14 or higher)
- Python
- Git
- FFmpeg
- yt-dlp

1. Clone the Repository

git clone https://github.com/PuneetKumar1790/YTGrabber.git  
cd YT-Grabber

2. Install Dependencies

npm install

3. Install Required Tools

Windows:

- Download FFmpeg and extract to: ytgrabber-backend/ffmpeg  
- Place yt-dlp.exe in ytgrabber-backend/

Linux/macOS:

cd ytgrabber-backend  
chmod +x install-ffmpeg.sh  
./install-ffmpeg.sh

Android (Termux):

pkg update && pkg upgrade  
pkg install git nodejs ffmpeg python  
pip install yt-dlp

4. Start the Backend Server

cd ytgrabber-backend  
node index.js

Now go to:  
http://localhost:3000

---

## 🎯 How to Use

1. Paste YouTube video URL  
2. Select resolution (360p / 480p / 720p / 1080p)  
3. Click the "Download" button  
4. Wait for "Download started"  
5. File is saved automatically

---

## 📱 Android (Termux) Setup

pkg update && pkg upgrade  
pkg install git nodejs ffmpeg python  
pip install yt-dlp  
git clone https://github.com/PuneetKumar1790/YTGrabber.git  
cd YT-Grabber/ytgrabber-backend  
node index.js

Now open:  
http://localhost:3000 in Chrome or any browser on your phone

---

## 🧪 Troubleshooting

Problem: Cannot GET /  
Fix: Make sure server is running and visit http://localhost:3000

Problem: yt-dlp not found  
Fix: Place yt-dlp.exe in ytgrabber-backend/ or install it system-wide

Problem: ffmpeg not installed  
Fix: Run install-ffmpeg.sh or install manually

Problem: Port 3000 already in use  
Fix: Change port number in index.js

Problem: Download failed  
Fix: Check internet and if the URL is valid

---

## 📂 Project Structure

YT-Grabber/  
├── frontend/  
│   └── index.html  
├── ytgrabber-backend/  
│   ├── downloads/  
│   ├── ffmpeg/  
│   ├── index.js  
│   ├── install-ffmpeg.sh  
│   ├── yt-dlp.exe  
│   └── package.json  
├── package.json  
└── README.md

---

## 📊 Quality Comparison

360p — 640×360 — ~0.5 Mbps — No  
480p — 854×480 — ~1.0 Mbps — No  
720p — 1280×720 — ~2.5 Mbps — No  
1080p — 1920×1080 — ~5.0 Mbps — Normally Yes, but No with YTGrabber

---

## ⚖️ Legal Notice

- Use for personal and educational purposes only  
- Respect YouTube’s TOS and copyright laws  
- Do not redistribute downloaded content  
- You’re responsible for how you use this tool

---

## 💖 Support

If this saved your time and bandwidth, please star the repo:

https://github.com/PuneetKumar1790/YTGrabber

Access the app at:  
http://localhost:3000
