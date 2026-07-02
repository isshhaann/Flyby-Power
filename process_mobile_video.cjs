const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const videoFile = 'Create_a_realistic_cinematic_s (1).mp4';
const videoPath = path.join(imagesDir, videoFile);
const outputDir = path.join(imagesDir, 'hero-frames-mobile');

console.log(`🎥 Target mobile video: public/images/${videoFile}`);

if (!fs.existsSync(videoPath)) {
  console.error(`❌ Mobile video file not found at: ${videoPath}`);
  process.exit(1);
}

console.log('🔄 Cleaning old mobile frame cache...');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  fs.readdirSync(outputDir).forEach(f => fs.unlinkSync(path.join(outputDir, f)));
}

// Extract WebP frames at 60 fps
console.log('⚡ Extracting WebP frames at 60 fps (this might take a few seconds)...');
const cmd = `"${ffmpeg}" -i "${videoPath}" -vf fps=60 -c:v libwebp -q:v 75 "${path.join(outputDir, 'frame-%04d.webp')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  
  // Count extracted frames
  let frames = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp')).sort();
  let totalFrames = frames.length;
  console.log(`✅ Extracted ${totalFrames} WebP frames.`);

  // If there are more than 600 frames (e.g. due to slightly longer video duration),
  // delete the excess frames to keep it aligned with the 600 frame desktop count.
  const targetFrameCount = 600;
  if (totalFrames > targetFrameCount) {
    console.log(`🧹 Truncating frames to exactly ${targetFrameCount} to align with desktop...`);
    for (let i = targetFrameCount; i < totalFrames; i++) {
      const excessFrame = frames[i];
      fs.unlinkSync(path.join(outputDir, excessFrame));
    }
    console.log(`✅ Cleaned up ${totalFrames - targetFrameCount} excess frames.`);
  } else if (totalFrames < targetFrameCount) {
    console.warn(`⚠️ Warning: Extracted only ${totalFrames} frames (expected ${targetFrameCount}).`);
  }

  console.log('🎉 Done! Mobile frames are prepared.');

} catch (err) {
  console.error('❌ Failed to process video:', err.message);
  process.exit(1);
}
