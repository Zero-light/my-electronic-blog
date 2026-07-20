const fs = require('fs');
const path = require('path');

// Ultra-safe image compression - never fails the build
async function main() {
  console.log('');
  console.log('[Image Compression]');
  
  let sharp;
  try {
    sharp = require('sharp');
    console.log('  sharp loaded OK');
  } catch (err) {
    console.log('  WARNING: sharp not available, skipping image compression');
    console.log('  Reason:', err.message.split('\n')[0]);
    console.log('');
    return; // Graceful exit - do NOT fail the build
  }

  const PUBLIC_DIR = path.join(process.cwd(), 'public');
  const MAX_WIDTH = 1920;
  const WEBP_QUALITY = 75;
  const SIZE_THRESHOLD = 200 * 1024; // 200KB

  const SCAN_DIRS = [
    path.join(PUBLIC_DIR, 'images'),
    path.join(PUBLIC_DIR, 'uart-images'),
  ];

  // Collect image files
  function getImageFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    let files = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = files.concat(getImageFiles(fullPath));
        } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
    return files;
  }

  const allFiles = [];
  for (const scanDir of SCAN_DIRS) {
    allFiles.push(...getImageFiles(scanDir));
  }

  const bigFiles = allFiles.filter(f => {
    try { return fs.statSync(f).size >= SIZE_THRESHOLD; } catch { return false; }
  });

  console.log(`  Found ${allFiles.length} images, ${bigFiles.length} > 200KB`);

  if (bigFiles.length === 0) {
    console.log('  Nothing to compress.');
    console.log('');
    return;
  }

  let compressed = 0;
  let totalSaved = 0;

  for (const filePath of bigFiles) {
    const ext = path.extname(filePath).toLowerCase();
    const originalSize = fs.statSync(filePath).size;
    const fileName = path.basename(filePath);

    try {
      let pipeline = sharp(filePath);
      
      // Resize if too large
      const meta = await pipeline.metadata();
      if (meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, { 
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos2
        });
      }

      // Convert to WebP
      pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 4 });

      // Write to buffer
      const buffer = await pipeline.toBuffer();

      // Only replace if actually smaller
      if (buffer.length < originalSize) {
        const outputPath = filePath.replace(/\.(jpe?g|png|webp)$/i, '.webp');
        
        // Write to temp first
        const tempPath = filePath + '.compress_tmp';
        fs.writeFileSync(tempPath, buffer);
        
        // If format changed, remove original
        if (outputPath !== filePath) {
          fs.unlinkSync(filePath);
        }
        fs.renameSync(tempPath, outputPath);
        
        const saved = originalSize - buffer.length;
        totalSaved += saved;
        compressed++;
        const ratio = ((1 - buffer.length / originalSize) * 100).toFixed(0);
        console.log(`  ✓ ${fileName} (-${(saved/1024).0f}KB, -${ratio}%) ${outputPath !== filePath ? '→webp' : ''}`);
      }
    } catch (err) {
      console.log(`  ⚠ ${fileName}: ${err.message.split('\n')[0]}`);
      // Clean up temp if exists
      try { fs.unlinkSync(filePath + '.compress_tmp'); } catch {}
    }
  }

  console.log('');
  console.log(`  Compressed: ${compressed}/${bigFiles.length}, Saved: ${(totalSaved/1024/1024).1f}MB`);
  console.log('');
}

// Always exit successfully - never break the build
main().catch(err => {
  console.log('');
  console.log('  WARNING: Image compression failed, continuing build...');
  console.log('  Error:', err.message.split('\n')[0]);
  console.log('');
  process.exit(0); // <-- FORCE success
});
