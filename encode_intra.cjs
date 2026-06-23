const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');

const inputPath = path.join(__dirname, 'images', 'Ultra_realistic_storey_moder.mp4');
const outputPath = path.join(__dirname, 'images', 'hero-intra.mp4');

// Encode video with keyframes on every single frame (-g 1 -keyint_min 1),
// disable B-frames (-bf 0), baseline profile for maximum device compatibility.
const cmd = `"${ffmpeg}" -y -i "${inputPath}" -c:v libx264 -preset slow -crf 20 -g 1 -keyint_min 1 -bf 0 -pix_fmt yuv420p -profile:v baseline "${outputPath}"`;

console.log('Encoding keyframe-only (All-Intra) video...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Video encoded successfully at:', outputPath);
} catch (err) {
  console.error('Error encoding video:', err);
}
