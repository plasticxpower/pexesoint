const fs = require('fs');
const path = require('path');

/**
 * Translation script that uses public/images JSON files as the single source of truth
 * and generates proper locale files in public/locales based on scientific names
 */
class LocaleGenerator {
    constructor() {
        this.sourceDir = path.join(__dirname, 'public', 'images');
        this.localesDir = path.join(__dirname, 'public', 'locales');
        this.categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
        
        // Scientific name to Czech common name mappings
        this.scientificToCzech = new Map([
            // Birds
            ['Turdus migratorius', 'drozd stěhovavý'],
            ['Corvus brachyrhynchos', 'vrána americká'],
            ['Poecile atricapillus', 'sýkora černohlavá'],
            ['Sialia sialis', 'modráček východní'],
            ['Spinus tristis', 'stehlík americký'],
            ['Cardinalis cardinalis', 'kardinál červený'],
            ['Cyanocitta cristata', 'sojka modrá'],
            ['Passer domesticus', 'vrabec domácí'],
            ['Agelaius phoeniceus', 'vlhovec červenokřídlý'],
            ['Haliaeetus leucocephalus', 'orel bělohlavý'],
            ['Ardea herodias', 'volavka modrá'],
            ['Buteo jamaicensis', 'káně rudoocasá'],
            ['Anas platyrhynchos', 'kachna divoká'],
            ['Bubo virginianus', 'výr virginský'],
            ['Aquila chrysaetos', 'orel skalní'],
            
            // Fish
            ['Micropterus salmoides', 'okounek pstruhový'],
            ['Oncorhynchus mykiss', 'pstruh duhový'],
            ['Esox lucius', 'štika obecná'],
            ['Lepomis macrochirus', 'slunečnice modrolemá'],
            ['Ictalurus punctatus', 'sumec tečkovaný'],
            ['Salmo salar', 'losos atlantský'],
            ['Sander vitreus', 'candát sklovitý'],
            ['Morone saxatilis', 'okoun pruhovaný'],
            ['Perca flavescens', 'okoun žlutý'],
            ['Esox masquinongy', 'štika muskellunge'],
            
            // Mammals
            ['Ursus americanus', 'medvěd baribal'],
            ['Odocoileus virginianus', 'jelen běloocasý'],
            ['Sciurus carolinensis', 'veverka šedá'],
            ['Procyon lotor', 'mýval severní'],
            ['Vulpes vulpes', 'liška obecná'],
            ['Canis lupus', 'vlk obecný'],
            ['Puma concolor', 'puma americká'],
            ['Alces alces', 'los evropský'],
            ['Castor canadensis', 'bobr kanadský'],
            ['Lynx rufus', 'rys červený'],
            ['Cervus canadensis', 'wapiti'],
            ['Erethizon dorsatum', 'dikobraz severoamerický'],
            ['Mephitis mephitis', 'skunk pruhovaný'],
            ['Didelphis virginiana', 'oposum virginský'],
            ['Tamias striatus', 'burunduk pruhovaný'],
            ['Ondatra zibethicus', 'ondatra pižmová'],
            ['Lontra canadensis', 'vydra kanadská'],
            ['Canis latrans', 'kojot prérijní'],
            ['Ovis canadensis', 'muflon kanadský'],
            ['Odocoileus hemionus', 'jelen mulí'],
            
            // Reptiles
            ['Thamnophis sirtalis', 'užovka podvazková'],
            ['Crotalus atrox', 'chřestýš diamantový'],
            ['Chelonia mydas', 'želva zelená'],
            ['Alligator mississippiensis', 'aligátor americký'],
            ['Iguana iguana', 'leguán zelený'],
            
            // Amphibians
            ['Lithobates catesbeianus', 'žába skokanka'],
            ['Ambystoma maculatum', 'mlok skvrnitý'],
            ['Bufo americanus', 'ropucha americká'],
            ['Hyla versicolor', 'rosnička šedá'],
            ['Plethodon glutinosus', 'mlok lepkavý']
        ]);
    }

    /**
     * Load source data from public/images
     */
    loadSourceData(category) {
        const filePath = path.join(this.sourceDir, `${category}_data.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`❌ Source file not found: ${filePath}`);
            return null;
        }
        
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log(`✅ Loaded ${data.photos?.length || 0} ${category} from source`);
            return data;
        } catch (error) {
            console.error(`❌ Error loading ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * Extract essential fields for locale files
     */
    extractLocaleData(sourceData, language = 'en') {
        if (!sourceData || !sourceData.photos) {
            return null;
        }

        const localePhotos = sourceData.photos.map(photo => {
            const baseData = {
                fileName: photo.fileName,
                scientificName: photo.scientificName,
                size: photo.size,
                lifespan: photo.lifespan,
                habitat: photo.habitat,
                funFact: photo.funFact,
                localPath: photo.localPath
            };

            if (language === 'en') {
                baseData.commonName = photo.commonName;
            } else if (language === 'cs') {
                // Use scientific name mapping for Czech
                const czechName = this.scientificToCzech.get(photo.scientificName);
                if (czechName) {
                    baseData.commonName = czechName;
                    console.log(`✅ Mapped ${photo.scientificName} -> ${czechName}`);
                } else {
                    // Fallback to English name with warning
                    baseData.commonName = photo.commonName;
                    console.log(`⚠️  No Czech mapping for ${photo.scientificName}, using English: ${photo.commonName}`);
                }
                
                // For now, keep other fields in English - these would need proper translation
                // In a full implementation, you'd want to translate these fields too
            }

            return baseData;
        });

        return {
            category: sourceData.category,
            totalPhotos: sourceData.totalPhotos,
            photos: localePhotos
        };
    }

    /**
     * Create backup of existing locale files
     */
    createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(__dirname, `locales-backup-${timestamp}`);
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Backup existing locale files
        for (const lang of ['en', 'cs']) {
            const langDir = path.join(this.localesDir, lang);
            if (fs.existsSync(langDir)) {
                const backupLangDir = path.join(backupDir, lang);
                fs.mkdirSync(backupLangDir, { recursive: true });
                
                for (const category of this.categories) {
                    const sourceFile = path.join(langDir, `${category}.json`);
                    if (fs.existsSync(sourceFile)) {
                        const backupFile = path.join(backupLangDir, `${category}.json`);
                        fs.copyFileSync(sourceFile, backupFile);
                    }
                }
            }
        }

        console.log(`📦 Backup created at: ${backupDir}`);
        return backupDir;
    }

    /**
     * Generate locale files from source data
     */
    generateLocales() {
        console.log('\n🚀 GENERATING LOCALE FILES FROM SOURCE DATA');
        console.log('=' .repeat(50));
        
        // Create backup first
        this.createBackup();
        
        // Ensure locale directories exist
        for (const lang of ['en', 'cs']) {
            const langDir = path.join(this.localesDir, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }
        }

        // Process each category
        for (const category of this.categories) {
            console.log(`\n📂 Processing ${category.toUpperCase()}`);
            console.log('-'.repeat(30));
            
            // Load source data
            const sourceData = this.loadSourceData(category);
            if (!sourceData) {
                console.log(`⏭️  Skipping ${category} - no source data`);
                continue;
            }

            // Generate English locale
            const englishData = this.extractLocaleData(sourceData, 'en');
            if (englishData) {
                const englishPath = path.join(this.localesDir, 'en', `${category}.json`);
                fs.writeFileSync(englishPath, JSON.stringify(englishData, null, 2), 'utf8');
                console.log(`✅ Generated English locale: ${englishPath}`);
            }

            // Generate Czech locale
            const czechData = this.extractLocaleData(sourceData, 'cs');
            if (czechData) {
                const czechPath = path.join(this.localesDir, 'cs', `${category}.json`);
                fs.writeFileSync(czechPath, JSON.stringify(czechData, null, 2), 'utf8');
                console.log(`✅ Generated Czech locale: ${czechPath}`);
            }
        }

        this.generateReport();
    }

    /**
     * Generate a report of the translation process
     */
    generateReport() {
        console.log('\n📊 TRANSLATION REPORT');
        console.log('=' .repeat(50));
        
        const report = {
            timestamp: new Date().toISOString(),
            sourceDirectory: this.sourceDir,
            localesDirectory: this.localesDir,
            categories: [],
            scientificNameMappings: {
                total: this.scientificToCzech.size,
                mappings: Object.fromEntries(this.scientificToCzech)
            }
        };

        for (const category of this.categories) {
            const sourceData = this.loadSourceData(category);
            if (sourceData) {
                const categoryReport = {
                    category,
                    totalAnimals: sourceData.photos.length,
                    mappedToCzech: 0,
                    unmappedAnimals: []
                };

                sourceData.photos.forEach(photo => {
                    if (this.scientificToCzech.has(photo.scientificName)) {
                        categoryReport.mappedToCzech++;
                    } else {
                        categoryReport.unmappedAnimals.push({
                            scientificName: photo.scientificName,
                            englishName: photo.commonName
                        });
                    }
                });

                report.categories.push(categoryReport);
                
                console.log(`\n${category.toUpperCase()}:`);
                console.log(`  Total animals: ${categoryReport.totalAnimals}`);
                console.log(`  Mapped to Czech: ${categoryReport.mappedToCzech}`);
                console.log(`  Unmapped: ${categoryReport.unmappedAnimals.length}`);
                
                if (categoryReport.unmappedAnimals.length > 0) {
                    console.log(`  ⚠️  Unmapped animals:`);
                    categoryReport.unmappedAnimals.forEach(animal => {
                        console.log(`    - ${animal.scientificName} (${animal.englishName})`);
                    });
                }
            }
        }

        // Save report
        const reportPath = path.join(__dirname, 'locale-generation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        console.log(`\n📄 Report saved to: ${reportPath}`);
        
        console.log('\n✅ LOCALE GENERATION COMPLETED!');
        console.log('\nNext steps:');
        console.log('1. Review the generated locale files in public/locales/');
        console.log('2. Add more scientific name mappings for unmapped animals');
        console.log('3. Translate habitat, funFact, and other text fields to Czech');
        console.log('4. Test the application with the new locale files');
    }

    /**
     * Add a new scientific name mapping
     */
    addMapping(scientificName, czechName) {
        this.scientificToCzech.set(scientificName, czechName);
        console.log(`✅ Added mapping: ${scientificName} -> ${czechName}`);
    }

    /**
     * List all current mappings
     */
    listMappings() {
        console.log('\n📋 CURRENT SCIENTIFIC NAME MAPPINGS');
        console.log('=' .repeat(50));
        
        for (const [scientific, czech] of this.scientificToCzech) {
            console.log(`${scientific} -> ${czech}`);
        }
    }
}

// Main execution
if (require.main === module) {
    const generator = new LocaleGenerator();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--list-mappings')) {
        generator.listMappings();
    } else if (args.includes('--help')) {
        console.log('\n🔧 LOCALE GENERATOR USAGE');
        console.log('=' .repeat(50));
        console.log('node generate-locales-from-source.js           # Generate all locale files');
        console.log('node generate-locales-from-source.js --list-mappings  # List current mappings');
        console.log('node generate-locales-from-source.js --help           # Show this help');
    } else {
        generator.generateLocales();
    }
}

module.exports = LocaleGenerator;