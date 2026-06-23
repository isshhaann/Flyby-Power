const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const outputDir = path.join(imagesDir, 'hero-frames');

// 1. Locate the video file in the images directory
const mp4Files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.mp4'));

if (mp4Files.length === 0) {
  console.error('❌ No MP4 video file found in the "images/" directory.');
  console.log('👉 Please upload your new video to the "images/" folder (e.g. name it "hero-video.mp4").');
  process.exit(1);
}

// Select the most recently modified MP4 file
const sortedVideos = mp4Files.map(file => {
  const filePath = path.join(imagesDir, file);
  return { file, time: fs.statSync(filePath).mtime.getTime() };
}).sort((a, b) => b.time - a.time);

const videoFile = sortedVideos[0].file;
const videoPath = path.join(imagesDir, videoFile);

console.log(`🎥 Found video file: images/${videoFile}`);
console.log('🔄 Cleaning old frame cache...');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  fs.readdirSync(outputDir).forEach(f => fs.unlinkSync(path.join(outputDir, f)));
}

// 2. Extract WebP frames directly at 60 fps
console.log('⚡ Extracting WebP frames at 60 fps (this might take a few seconds)...');
const cmd = `"${ffmpeg}" -i "${videoPath}" -vf fps=60 -c:v libwebp -q:v 75 "${path.join(outputDir, 'frame-%04d.webp')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  
  // 3. Count extracted frames
  const frames = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
  const totalFrames = frames.length;
  console.log(`✅ Extracted ${totalFrames} WebP frames successfully!`);

  // 4. Automatically update script.js with the new frame count
  const scriptPath = path.join(__dirname, 'script.js');
  if (fs.existsSync(scriptPath)) {
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const prevMatch = scriptContent.match(/const frameCount = (\d+);/);
    
    if (prevMatch) {
      scriptContent = scriptContent.replace(/const frameCount = \d+;/, `const frameCount = ${totalFrames};`);
      fs.writeFileSync(scriptPath, scriptContent, 'utf8');
      console.log(`⚙️ Automatically updated script.js: frameCount is now set to ${totalFrames} (from ${prevMatch[1]}).`);
    } else {
      console.warn('⚠️ Could not find "const frameCount" variable in script.js to update.');
    }
  }

  console.log('🎉 Done! Refresh your browser to scroll through your new video.');

} catch (err) {
  console.error('❌ Failed to process video:', err.message);
  process.exit(1);
}
