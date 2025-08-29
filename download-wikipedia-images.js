const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');

/**
 * Wikipedia Image Downloader
 * Downloads main images from Wikipedia pages based on scientific names
 * Updates JSON files with image URLs and replaces existing images
 */
class WikipediaImageDownloader {
    constructor() {
        this.sourceDir = path.join(__dirname, 'public', 'images');
        this.categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
        this.downloadedCount = 0;
        this.failedCount = 0;
        this.logFile = path.join(__dirname, `download-log-${Date.now()}.json`);
        this.downloadLog = {
            startTime: new Date().toISOString(),
            downloads: [],
            failures: [],
            summary: {}
        };
        
        // Rate limiting
        this.requestDelay = 1000; // 1 second between requests
        this.maxRetries = 3;
        
        // User agent for Wikipedia requests
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    /**
     * Main execution function
     */
    async run() {
        console.log('🚀 Starting Wikipedia Image Download Process');
        console.log('=' .repeat(60));
        
        try {
            // Create backup of existing images
            await this.createBackup();
            
            // Process each category
            for (const category of this.categories) {
                console.log(`\n📂 Processing category: ${category.toUpperCase()}`);
                await this.processCategory(category);
            }
            
            // Generate final report
            await this.generateReport();
            
        } catch (error) {
            console.error('❌ Fatal error:', error.message);
            await this.saveLog();
        }
    }

    /**
     * Create backup of existing images and JSON files
     */
    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(__dirname, `images-backup-${timestamp}`);
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        console.log(`📦 Creating backup at: ${backupDir}`);
        
        // Backup JSON files and image directories
        for (const category of this.categories) {
            const jsonFile = path.join(this.sourceDir, `${category}_data.json`);
            const imageDir = path.join(this.sourceDir, category);
            
            if (fs.existsSync(jsonFile)) {
                const backupJsonFile = path.join(backupDir, `${category}_data.json`);
                fs.copyFileSync(jsonFile, backupJsonFile);
            }
            
            if (fs.existsSync(imageDir)) {
                const backupImageDir = path.join(backupDir, category);
                fs.mkdirSync(backupImageDir, { recursive: true });
                
                const files = fs.readdirSync(imageDir);
                for (const file of files) {
                    const srcFile = path.join(imageDir, file);
                    const destFile = path.join(backupImageDir, file);
                    if (fs.statSync(srcFile).isFile()) {
                        fs.copyFileSync(srcFile, destFile);
                    }
                }
            }
        }
        
        console.log('✅ Backup completed');
    }

    /**
     * Process a single category
     */
    async processCategory(category) {
        const jsonFile = path.join(this.sourceDir, `${category}_data.json`);
        
        if (!fs.existsSync(jsonFile)) {
            console.log(`⚠️  JSON file not found: ${jsonFile}`);
            return;
        }
        
        let data;
        try {
            data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        } catch (error) {
            console.error(`❌ Error reading ${jsonFile}:`, error.message);
            return;
        }
        
        if (!data.photos || !Array.isArray(data.photos)) {
            console.log(`⚠️  No photos array found in ${category}`);
            return;
        }
        
        console.log(`📊 Found ${data.photos.length} animals in ${category}`);
        
        // Ensure image directory exists
        const imageDir = path.join(this.sourceDir, category);
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }
        
        // Process each animal
        for (let i = 0; i < data.photos.length; i++) {
            const animal = data.photos[i];
            console.log(`\n🔍 [${i + 1}/${data.photos.length}] Processing: ${animal.scientificName}`);
            
            try {
                const result = await this.downloadAnimalImage(animal, category, imageDir);
                if (result.success) {
                    // Update the animal data with new image info
                    data.photos[i] = { ...animal, ...result.updates };
                    this.downloadedCount++;
                } else {
                    this.failedCount++;
                }
                
                // Rate limiting
                await this.delay(this.requestDelay);
                
            } catch (error) {
                console.error(`❌ Error processing ${animal.scientificName}:`, error.message);
                this.logFailure(animal.scientificName, error.message, category);
                this.failedCount++;
            }
        }
        
        // Save updated JSON file
        data.updatedAt = new Date().toISOString();
        data.imageDownloadInfo = {
            downloadedAt: new Date().toISOString(),
            method: 'Wikipedia main image',
            source: 'wikipedia.org'
        };
        
        fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Updated ${category} JSON file`);
    }

    /**
     * Download image for a single animal
     */
    async downloadAnimalImage(animal, category, imageDir) {
        const scientificName = animal.scientificName;
        
        try {
            // Step 1: Search Wikipedia for the article
            const wikipediaUrl = await this.findWikipediaArticle(scientificName);
            if (!wikipediaUrl) {
                throw new Error(`No Wikipedia article found for ${scientificName}`);
            }
            
            console.log(`📖 Found Wikipedia article: ${wikipediaUrl}`);
            
            // Step 2: Extract main image from Wikipedia page
            const imageUrl = await this.extractMainImage(wikipediaUrl);
            if (!imageUrl) {
                throw new Error(`No main image found on Wikipedia page`);
            }
            
            console.log(`🖼️  Found main image: ${imageUrl}`);
            
            // Step 3: Download and save the image
            const fileName = animal.fileName || `${category}${animal.photoData?.id?.split('_').pop() || Date.now()}.jpg`;
            const filePath = path.join(imageDir, fileName);
            
            await this.downloadImage(imageUrl, filePath);
            console.log(`💾 Downloaded image: ${fileName}`);
            
            // Log success
            this.logSuccess(scientificName, imageUrl, wikipediaUrl, fileName, category);
            
            return {
                success: true,
                updates: {
                    imageSource: imageUrl,
                    wikipediaUrl: wikipediaUrl,
                    photoData: {
                        ...animal.photoData,
                        urls: {
                            regular: imageUrl
                        }
                    },
                    updatedAt: new Date().toISOString(),
                    imageMethod: 'Wikipedia main image download'
                }
            };
            
        } catch (error) {
            console.error(`❌ Failed to download image for ${scientificName}: ${error.message}`);
            this.logFailure(scientificName, error.message, category);
            return { success: false };
        }
    }

    /**
     * Find Wikipedia article URL for scientific name
     */
    async findWikipediaArticle(scientificName) {
        try {
            // Use Wikipedia API to search for the article
            const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/title/${encodeURIComponent(scientificName)}`;
            
            const response = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 10000
            });
            
            if (response.status === 200) {
                return `https://en.wikipedia.org/wiki/${encodeURIComponent(scientificName)}`;
            }
            
            // If direct lookup fails, try search API
            const searchApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`;
            const searchResponse = await axios.get(searchApiUrl, {
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 10000
            });
            
            if (searchResponse.status === 200 && searchResponse.data.content_urls) {
                return searchResponse.data.content_urls.desktop.page;
            }
            
            return null;
            
        } catch (error) {
            console.error(`Error finding Wikipedia article for ${scientificName}:`, error.message);
            return null;
        }
    }

    /**
     * Extract main image URL from Wikipedia page
     */
    async extractMainImage(wikipediaUrl) {
        try {
            const response = await axios.get(wikipediaUrl, {
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 15000
            });
            
            const $ = cheerio.load(response.data);
            
            // Look for the main infobox image (most common location)
            let imageUrl = null;
            
            // Method 1: Infobox image
            const infoboxImage = $('.infobox img').first();
            if (infoboxImage.length > 0) {
                imageUrl = infoboxImage.attr('src');
            }
            
            // Method 2: First image in the article
            if (!imageUrl) {
                const firstImage = $('.mw-parser-output img').first();
                if (firstImage.length > 0) {
                    imageUrl = firstImage.attr('src');
                }
            }
            
            // Method 3: Thumbnail image
            if (!imageUrl) {
                const thumbImage = $('.thumbimage').first();
                if (thumbImage.length > 0) {
                    imageUrl = thumbImage.attr('src');
                }
            }
            
            if (imageUrl) {
                // Convert to full resolution URL
                if (imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                } else if (imageUrl.startsWith('/')) {
                    imageUrl = 'https://en.wikipedia.org' + imageUrl;
                }
                
                // Remove thumbnail size restrictions to get full resolution
                imageUrl = imageUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');
                
                return imageUrl;
            }
            
            return null;
            
        } catch (error) {
            console.error(`Error extracting image from ${wikipediaUrl}:`, error.message);
            return null;
        }
    }

    /**
     * Download image from URL and save to file
     */
    async downloadImage(imageUrl, filePath) {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 30000
            });
            
            // Process image with Sharp to ensure it's in the right format
            await sharp(response.data)
                .jpeg({ quality: 85 })
                .resize(800, 600, { 
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toFile(filePath);
                
        } catch (error) {
            throw new Error(`Failed to download image: ${error.message}`);
        }
    }

    /**
     * Log successful download
     */
    logSuccess(scientificName, imageUrl, wikipediaUrl, fileName, category) {
        this.downloadLog.downloads.push({
            scientificName,
            imageUrl,
            wikipediaUrl,
            fileName,
            category,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log failed download
     */
    logFailure(scientificName, error, category) {
        this.downloadLog.failures.push({
            scientificName,
            error,
            category,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Generate final report
     */
    async generateReport() {
        this.downloadLog.endTime = new Date().toISOString();
        this.downloadLog.summary = {
            totalDownloaded: this.downloadedCount,
            totalFailed: this.failedCount,
            successRate: `${((this.downloadedCount / (this.downloadedCount + this.failedCount)) * 100).toFixed(1)}%`
        };
        
        await this.saveLog();
        
        console.log('\n' + '=' .repeat(60));
        console.log('📊 DOWNLOAD SUMMARY');
        console.log('=' .repeat(60));
        console.log(`✅ Successfully downloaded: ${this.downloadedCount}`);
        console.log(`❌ Failed downloads: ${this.failedCount}`);
        console.log(`📈 Success rate: ${this.downloadLog.summary.successRate}`);
        console.log(`📄 Detailed log saved to: ${this.logFile}`);
        console.log('=' .repeat(60));
    }

    /**
     * Save download log to file
     */
    async saveLog() {
        fs.writeFileSync(this.logFile, JSON.stringify(this.downloadLog, null, 2), 'utf8');
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Run the script if called directly
if (require.main === module) {
    const downloader = new WikipediaImageDownloader();
    downloader.run().catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = WikipediaImageDownloader;