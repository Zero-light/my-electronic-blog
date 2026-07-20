const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 75;
const WEBP_QUALITY = 75;
const SIZE_THRESHOLD = 200 * 1024; // 200KB

// Directories to scan
const SCAN_DIRS = [
  path.join(PUBLIC_DIR, 'images'),
  path.join(PUBLIC_DIR, 'uart-images'),
];

// Statistics
let processed = 0;
let saved = 0;
let totalSavedBytes = 0;

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getImageFiles(fullPath));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compressImage(filePath) {
  const originalSize = fs.statSync(filePath).size;
  if (originalSize < SIZE_THRESHOLD) {
    return null; // Skip small images
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    let sharpInst = sharp(filePath);
    
    // Get metadata to check dimensions
    const meta = await sharpInst.metadata();
    
    // Resize if too large (maintaining aspect ratio)
    if (meta.width > MAX_WIDTH) {
      sharpInst = sharpInst.resize(MAX_WIDTH, null, { 
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3 
      });
    }

    let outputPath = filePath;
    let outputExt = ext;

    // Convert large JPEGs to WebP for better compression
    if (ext === '.jpg' || ext === '.jpeg') {
      outputPath = filePath.replace(/\.jpe?g$/i, '.webp');
      sharpInst = sharpInst.webp({ quality: WEBP_QUALITY, effort: 5 });
      outputExt = '.webp';
    } else if (ext === '.png') {
      outputPath = filePath.replace(/\.png$/i, '.webp');
      sharpInst = sharpInst.webp({ quality: WEBP_QUALITY, effort: 5 });
      outputExt = '.webp';
    } else if (ext === '.webp') {
      // Keep as WebP but re-compress
      sharpInst = sharpInst.webp({ quality: WEBP_QUALITY, effort: 5 });
    }

    // Write to temp file first to avoid corrupting original if same path
    const tempPath = filePath + '.tmp';
    await sharpInst.toFile(tempPath);

    const newSize = fs.statSync(tempPath).size;
    
    // Only replace if actually smaller
    if (newSize < originalSize) {
      // If format changed, remove original and rename
      if (outputPath !== filePath) {
        fs.unlinkSync(filePath);
      }
      fs.renameSync(tempPath, outputPath);
      
      const saved = originalSize - newSize;
      totalSavedBytes += saved;
      return {
        file: path.relative(process.cwd(), outputPath),
        originalSize,
        newSize,
        saved,
      };
    } else {
      // New version is larger or equal, keep original
      fs.unlinkSync(tempPath);
      return null;
    }
  } catch (err) {
    console.error(`  Failed: ${filePath}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('\n🖼️  Image Compression Script');
  console.log('================================\n');

  const allFiles = [];
  for (const scanDir of SCAN_DIRS) {
    const files = getImageFiles(scanDir);
    allFiles.push(...files);
  }

  console.log(`Found ${allFiles.length} image files`);

  const bigFiles = allFiles.filter(f => fs.statSync(f).size >= SIZE_THRESHOLD);
  console.log(`Images > 200KB: ${bigFiles.length}`);

  for (const file of bigFiles) {
    processed++;
    const relPath = path.relative(process.cwd(), file);
    const sizeMB = fs.statSync(file).size / 1024 / 1024;
    console.log(`  [${processed}/${bigFiles.length}] ${relPath} (${sizeMB.toFixed(2)} MB)`);
    
    const result = await compressImage(file);
    if (result) {
      saved++;
      const ratio = ((1 - result.newSize / result.originalSize) * 100).toFixed(0);
      console.log(`      → ${result.file} (${(result.newSize/1024).1f} KB, -${ratio}%)`);
    }
  }

  console.log('\n================================');
  console.log(`Processed: ${bigFiles.length}`);
  console.log(`Compressed: ${saved}`);
  console.log(`Total saved: ${(totalSavedBytes/1024/1024).2f} MB`);
  console.log('================================\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
