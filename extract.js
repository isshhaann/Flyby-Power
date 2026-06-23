const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = path.join(__dirname, 'images', 'Ultra_realistic_storey_moder.mp4');
const outputDir = path.join(__dirname, 'images', 'hero-frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ensure the folder is empty before starting
fs.readdirSync(outputDir).forEach(f => fs.unlinkSync(path.join(outputDir, f)));

// Extract frames at 12 fps with moderate JPEG compression (q:v 5)
// This keeps file size small while giving enough frames for scrolling
const cmd = `"${ffmpeg}" -i "${videoPath}" -vf fps=15 -q:v 5 "${path.join(outputDir, 'frame-%04d.jpg')}"`;

console.log('Extracting frames...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Frames extracted successfully!');
  
  const files = fs.readdirSync(outputDir);
  console.log(`Total frames generated: ${files.length}`);
} catch (err) {
  console.error('Error extracting frames:', err);
}
