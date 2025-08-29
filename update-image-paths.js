const fs = require('fs');
const path = require('path');

/**
 * Script to update localPath values in metadata files
 * Changes paths from /images/{category}/ to /images-cropped/{category}/
 */

const categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
const imagesDir = path.join(__dirname, 'public', 'images');

console.log('Updating image paths in metadata files...');

categories.forEach(category => {
    const filePath = path.join(imagesDir, `${category}_data.json`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    try {
        // Read the file
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Update localPath for each photo
        let updatedCount = 0;
        if (data.photos && Array.isArray(data.photos)) {
            data.photos.forEach(photo => {
                if (photo.localPath && photo.localPath.includes(`/images/${category}/`)) {
                    photo.localPath = photo.localPath.replace(`/images/${category}/`, `/images-cropped/${category}/`);
                    updatedCount++;
                }
            });
        }
        
        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Updated ${updatedCount} paths in ${category}_data.json`);
        
    } catch (error) {
        console.error(`❌ Error processing ${category}_data.json:`, error.message);
    }
});

console.log('\n🎉 Image path update completed!');
console.log('All metadata files now point to /images-cropped/ folder.');