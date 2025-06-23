#!/bin/bash
set -e

echo "Installing FFmpeg..."
wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar xf ffmpeg-release-amd64-static.tar.xz
mv ffmpeg-*/ffmpeg ffmpeg-*/ffprobe .
rm -rf ffmpeg-* ffmpeg-release-amd64-static.tar.xz