const fs = require('fs');
const path = require('path');

/**
 * Multi-Language Translation Generator
 * 
 * This script automates the creation of new language packs for the PEXEDU game.
 * It generates both content translations (animal data) and UI translations.
 * 
 * Usage: node generate-language-pack.js <language_code> <language_name>
 * Example: node generate-language-pack.js fr "French"
 */

class LanguagePackGenerator {
  constructor(languageCode, languageName) {
    this.languageCode = languageCode;
    this.languageName = languageName;
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Paths
    this.contentLocalesPath = path.join(__dirname, 'public', 'locales');
    this.uiLocalesPath = path.join(__dirname, 'src', 'locales');
    this.backupPath = path.join(__dirname, 'backups', `language-pack-${languageCode}-${this.timestamp}`);
  }

  // Create backup directory
  createBackup() {
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
    console.log(`✓ Created backup directory: ${this.backupPath}`);
  }

  // Create content translation directories
  createContentDirectories() {
    const contentDir = path.join(this.contentLocalesPath, this.languageCode);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
      console.log(`✓ Created content directory: ${contentDir}`);
    }
  }

  // Create UI translation directories
  createUIDirectories() {
    const uiDir = path.join(this.uiLocalesPath, this.languageCode);
    if (!fs.existsSync(uiDir)) {
      fs.mkdirSync(uiDir, { recursive: true });
      console.log(`✓ Created UI directory: ${uiDir}`);
    }
  }

  // Generate content translation templates (animal data)
  generateContentTranslations() {
    const categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
    const englishContentPath = path.join(this.contentLocalesPath, 'en');
    const targetContentPath = path.join(this.contentLocalesPath, this.languageCode);

    categories.forEach(category => {
      const englishFile = path.join(englishContentPath, `${category}.json`);
      const targetFile = path.join(targetContentPath, `${category}.json`);

      if (fs.existsSync(englishFile)) {
        const englishData = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
        
        // Create template with placeholder translations
        const templateData = this.createContentTemplate(englishData, category);
        
        fs.writeFileSync(targetFile, JSON.stringify(templateData, null, 2), 'utf8');
        console.log(`✓ Generated content template: ${category}.json`);
      }
    });
  }

  // Create content template with translation placeholders
  createContentTemplate(englishData, category) {
    return englishData.map(animal => ({
      ...animal,
      // Keep scientific names as they are universal
      // Mark other fields for translation
      commonName: `[TRANSLATE] ${animal.commonName}`,
      size: this.translateSizeField(animal.size),
      lifespan: `[TRANSLATE] ${animal.lifespan}`,
      habitat: `[TRANSLATE] ${animal.habitat}`,
      funFact: `[TRANSLATE] ${animal.funFact}`
    }));
  }

  // Handle size field translation (preserve numbers, translate units)
  translateSizeField(sizeText) {
    // Keep numbers and basic structure, mark units for translation
    return sizeText.replace(/feet|foot|inches|inch/gi, match => `[TRANSLATE:${match}]`);
  }

  // Generate UI translation templates
  generateUITranslations() {
    const uiFiles = ['common.json', 'game.json', 'ui.json'];
    const englishUIPath = path.join(this.uiLocalesPath, 'en');
    const targetUIPath = path.join(this.uiLocalesPath, this.languageCode);

    uiFiles.forEach(file => {
      const englishFile = path.join(englishUIPath, file);
      const targetFile = path.join(targetUIPath, file);

      if (fs.existsSync(englishFile)) {
        const englishData = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
        
        // Create template with placeholder translations
        const templateData = this.createUITemplate(englishData);
        
        fs.writeFileSync(targetFile, JSON.stringify(templateData, null, 2), 'utf8');
        console.log(`✓ Generated UI template: ${file}`);
      }
    });
  }

  // Create UI template with translation placeholders
  createUITemplate(data) {
    if (typeof data === 'string') {
      // Special handling for language selector
      if (data === 'English' || data === 'Čeština') {
        return data; // Keep language names as reference
      }
      return `[TRANSLATE] ${data}`;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.createUITemplate(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const result = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.createUITemplate(value);
      }
      return result;
    }
    
    return data;
  }

  // Generate language configuration file
  generateLanguageConfig() {
    const configFile = path.join(__dirname, `language-config-${this.languageCode}.json`);
    const config = {
      languageCode: this.languageCode,
      languageName: this.languageName,
      generatedAt: new Date().toISOString(),
      status: 'template',
      translationProgress: {
        content: {
          mammals: 'template',
          birds: 'template',
          fish: 'template',
          reptiles: 'template',
          amphibians: 'template'
        },
        ui: {
          common: 'template',
          game: 'template',
          ui: 'template'
        }
      },
      instructions: {
        content: 'Replace [TRANSLATE] markers with actual translations. Keep scientific names unchanged.',
        ui: 'Replace [TRANSLATE] markers with actual translations. Preserve {{variable}} placeholders.',
        sizeUnits: 'Replace [TRANSLATE:unit] markers with translated measurement units.',
        validation: 'Run validation script after translation to check for untranslated markers.'
      }
    };

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');
    console.log(`✓ Generated language configuration: ${configFile}`);
  }

  // Generate validation script for the new language
  generateValidationScript() {
    const scriptContent = `
const fs = require('fs');
const path = require('path');

/**
 * Validation script for ${this.languageName} (${this.languageCode}) translations
 * Checks for untranslated markers and missing files
 */

class ${this.languageCode.toUpperCase()}ValidationScript {
  constructor() {
    this.languageCode = '${this.languageCode}';
    this.errors = [];
    this.warnings = [];
  }

  validateContentTranslations() {
    const categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
    const contentPath = path.join(__dirname, 'public', 'locales', this.languageCode);

    categories.forEach(category => {
      const filePath = path.join(contentPath, \`\${category}.json\`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('[TRANSLATE]')) {
          this.warnings.push(\`\${category}.json contains untranslated markers\`);
        }
      } else {
        this.errors.push(\`Missing content file: \${category}.json\`);
      }
    });
  }

  validateUITranslations() {
    const uiFiles = ['common.json', 'game.json', 'ui.json'];
    const uiPath = path.join(__dirname, 'src', 'locales', this.languageCode);

    uiFiles.forEach(file => {
      const filePath = path.join(uiPath, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('[TRANSLATE]')) {
          this.warnings.push(\`\${file} contains untranslated markers\`);
        }
      } else {
        this.errors.push(\`Missing UI file: \${file}\`);
      }
    });
  }

  run() {
    console.log(\`Validating ${this.languageName} (${this.languageCode}) translations...\`);
    
    this.validateContentTranslations();
    this.validateUITranslations();

    if (this.errors.length > 0) {
      console.log('\\n❌ ERRORS:');
      this.errors.forEach(error => console.log(\`  - \${error}\`));
    }

    if (this.warnings.length > 0) {
      console.log('\\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(\`  - \${warning}\`));
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\\n✅ All translations are complete!');
    }

    return { errors: this.errors, warnings: this.warnings };
  }
}

if (require.main === module) {
  const validator = new ${this.languageCode.toUpperCase()}ValidationScript();
  validator.run();
}

module.exports = ${this.languageCode.toUpperCase()}ValidationScript;
`;

    const scriptFile = path.join(__dirname, `validate-${this.languageCode}-translations.js`);
    fs.writeFileSync(scriptFile, scriptContent, 'utf8');
    console.log(`✓ Generated validation script: validate-${this.languageCode}-translations.js`);
  }

  // Main execution method
  async generate() {
    try {
      console.log(`\n🌍 Generating language pack for ${this.languageName} (${this.languageCode})...\n`);
      
      this.createBackup();
      this.createContentDirectories();
      this.createUIDirectories();
      this.generateContentTranslations();
      this.generateUITranslations();
      this.generateLanguageConfig();
      this.generateValidationScript();
      
      console.log(`\n✅ Language pack generation completed!\n`);
      console.log(`📋 Next steps:`);
      console.log(`   1. Translate content files in public/locales/${this.languageCode}/`);
      console.log(`   2. Translate UI files in src/locales/${this.languageCode}/`);
      console.log(`   3. Run: node validate-${this.languageCode}-translations.js`);
      console.log(`   4. Update i18n.js to include the new language`);
      console.log(`   5. Test the application with the new language\n`);
      
    } catch (error) {
      console.error('❌ Error generating language pack:', error.message);
      process.exit(1);
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node generate-language-pack.js <language_code> <language_name>');
    console.log('Example: node generate-language-pack.js fr "French"');
    console.log('Example: node generate-language-pack.js de "German"');
    process.exit(1);
  }
  
  const [languageCode, languageName] = args;
  const generator = new LanguagePackGenerator(languageCode, languageName);
  generator.generate();
}

module.exports = LanguagePackGenerator;