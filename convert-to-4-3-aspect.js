const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Source and destination directories
const sourceDir = path.join(__dirname, 'public', 'images');
const destDir = path.join(__dirname, 'public', 'images-cropped');

// Categories to process
const categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to convert image to 4:3 aspect ratio with grey padding
async function convertTo4x3(inputPath, outputPath) {
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    
    // Calculate target dimensions for 4:3 aspect ratio
    const aspectRatio = 4 / 3;
    let canvasWidth, canvasHeight;
    let left = 0, top = 0;
    
    // Determine canvas size based on image aspect ratio
    if (width / height > aspectRatio) {
      // Image is wider than 4:3, add padding to top and bottom
      canvasWidth = width;
      canvasHeight = Math.round(width / aspectRatio);
      top = Math.round((canvasHeight - height) / 2);
    } else {
      // Image is taller than 4:3, add padding to left and right
      canvasHeight = height;
      canvasWidth = Math.round(height * aspectRatio);
      left = Math.round((canvasWidth - width) / 2);
    }
    
    // Create canvas with grey background and composite the original image
    await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: { r: 128, g: 128, b: 128 } // Grey background
      }
    })
    .composite([{
      input: inputPath,
      left: left,
      top: top
    }])
    .jpeg({ quality: 85 })
    .toFile(outputPath);
    
    console.log(`✓ Converted: ${path.basename(inputPath)} (${width}x${height} → ${canvasWidth}x${canvasHeight})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to convert ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

// Main processing function
async function processAllImages() {
  console.log('Starting 4:3 aspect ratio conversion...');
  console.log('Source:', sourceDir);
  console.log('Destination:', destDir);
  console.log('\n');
  
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;
  
  // Ensure destination directory exists
  ensureDirectoryExists(destDir);
  
  for (const category of categories) {
    const categorySourceDir = path.join(sourceDir, category);
    const categoryDestDir = path.join(destDir, category);
    
    if (!fs.existsSync(categorySourceDir)) {
      console.log(`⚠ Category directory not found: ${category}`);
      continue;
    }
    
    // Ensure category destination directory exists
    ensureDirectoryExists(categoryDestDir);
    
    console.log(`Processing category: ${category.toUpperCase()}`);
    
    // Get all jpg files in the category directory
    const files = fs.readdirSync(categorySourceDir)
      .filter(file => file.toLowerCase().endsWith('.jpg'))
      .sort((a, b) => {
        // Sort numerically by extracting number from filename
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
    
    for (const file of files) {
      const inputPath = path.join(categorySourceDir, file);
      const outputPath = path.join(categoryDestDir, file);
      
      totalProcessed++;
      const success = await convertTo4x3(inputPath, outputPath);
      
      if (success) {
        totalSuccess++;
      } else {
        totalFailed++;
      }
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`Completed ${category}: ${files.length} images\n`);
  }
  
  // Final summary
  console.log('='.repeat(50));
  console.log('CONVERSION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total images processed: ${totalProcessed}`);
  console.log(`Successful conversions: ${totalSuccess}`);
  console.log(`Failed conversions: ${totalFailed}`);
  console.log(`Success rate: ${((totalSuccess / totalProcessed) * 100).toFixed(1)}%`);
  console.log('\nAll images have been converted to 4:3 aspect ratio with grey padding!');
  console.log(`Output directory: ${destDir}`);
}

// Run the conversion
processAllImages().catch(console.error);