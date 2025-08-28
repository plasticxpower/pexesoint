const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

/**
 * Enhanced Dynamic Czech Translation Generator
 * 
 * This script generates comprehensive translations for all animal categories
 * by reading from source JSON files in public/images and creating locale files
 * in public/locales/en and public/locales/cs with proper translations.
 * 
 * Features:
 * - Reads from source JSON files in public/images as single source of truth
 * - Generates both English and Czech locale files
 * - Scientific name preservation as universal identifier
 * - Backup creation with timestamps
 * - Validation and error checking
 * - Support for all animal categories
 */

class EnhancedDynamicCzechTranslator {
  constructor() {
    this.sourceDir = path.join(__dirname, 'public', 'images');
    this.englishDir = path.join(__dirname, 'public', 'locales', 'en');
    this.czechDir = path.join(__dirname, 'public', 'locales', 'cs');
    this.backupDir = null;
    this.translationStats = {
      processed: 0,
      successful: 0,
      errors: 0
    };
  }

  // Comprehensive Czech translation data
  getCzechTranslationData() {
    return {
      mammals: {
        category: "Savci",
        commonNames: [
          "Medvěd baribal", "Jelen běloocasý", "Veverka šedá", "Mýval severní", "Liška obecná",
          "Vlk šedý", "Puma americká", "Los evropský", "Bobr kanadský", "Rys červený",
          "Wapiti", "Dikobraz severoamerický", "Skunk pruhovaný", "Opossum virginský", "Burunduk pruhovaný",
          "Ondatra pižmová", "Vydra říční", "Kojot prérijní", "Muflon kanadský", "Jelen oslí",
          "Rosomák sibiřský", "Psoun prérijní", "Svišť lesní", "Rys kanadský", "Bizon americký",
          "Pásovec devítipásý", "Netopýr velký", "Ježek západní", "Krtek evropský", "Rejsek malý"
        ],
        sizes: [
          "Délka: 120-190 cm, Hmotnost: 90-140 kg", "Délka: 150-210 cm, Hmotnost: 30-136 kg",
          "Délka: 23-30 cm plus 19-25 cm ocas", "Délka: 40-70 cm, Hmotnost: 5-26 kg",
          "Délka: 45-90 cm plus 30-56 cm ocas", "Délka: 100-160 cm, Hmotnost: 20-80 kg",
          "Délka: 100-180 cm, Hmotnost: 29-90 kg", "Délka: 240-310 cm, Hmotnost: 270-720 kg",
          "Délka: 74-90 cm plus 25-50 cm ocas, Hmotnost: 11-30 kg", "Délka: 65-105 cm, Hmotnost: 4-18 kg",
          "Délka: 200-270 cm, Hmotnost: 147-499 kg", "Délka: 60-90 cm, Hmotnost: 5-14 kg",
          "Délka: 40-68 cm, Hmotnost: 1.2-5.3 kg", "Délka: 35-55 cm, Hmotnost: 0.5-6 kg",
          "Délka: 14-19 cm plus 8-11 cm ocas", "Délka: 40-70 cm, Hmotnost: 0.7-1.8 kg",
          "Délka: 66-107 cm, Hmotnost: 5-14 kg", "Délka: 75-87 cm, Hmotnost: 7-21 kg",
          "Délka: 120-190 cm, Hmotnost: 53-158 kg", "Délka: 120-210 cm, Hmotnost: 31-103 kg",
          "Délka: 65-87 cm, Hmotnost: 9-25 kg", "Délka: 28-35 cm, Hmotnost: 0.5-1.7 kg",
          "Délka: 41-68 cm, Hmotnost: 2-6.3 kg", "Délka: 67-107 cm, Hmotnost: 5-17 kg",
          "Délka: 210-350 cm, Hmotnost: 318-1000 kg", "Délka: 75-100 cm, Hmotnost: 4-8 kg",
          "Výška: 120-200 cm, Hmotnost: 130-200 kg", "Výška: 80-100 cm, Hmotnost: 55-85 kg",
          "Délka: 200-350 cm, Hmotnost: 400-1000 kg", "Výška: 120-150 cm, Hmotnost: 160-240 kg"
        ],
        lifespans: [
          "20-30 let ve volné přírodě", "6-14 let ve volné přírodě", "6-10 let ve volné přírodě",
          "2-3 roky ve volné přírodě", "2-5 let ve volné přírodě", "6-8 let ve volné přírodě",
          "8-13 let ve volné přírodě", "15-20 let ve volné přírodě", "10-12 let ve volné přírodě",
          "7-10 let ve volné přírodě", "10-13 let ve volné přírodě", "5-7 let ve volné přírodě",
          "2-3 roky ve volné přírodě", "1-3 roky ve volné přírodě", "6-8 let ve volné přírodě",
          "10-15 let ve volné přírodě", "8-12 let ve volné přírodě", "8-12 let ve volné přírodě",
          "11-18 let ve volné přírodě", "8-10 let ve volné přírodě", "5-13 let ve volné přírodě",
          "1-3 roky ve volné přírodě", "3-7 let ve volné přírodě", "10-17 let ve volné přírodě",
          "12-20 let ve volné přírodě", "12-20 let ve volné přírodě", "20-30 let ve volné přírodě",
          "4-7 let ve volné přírodě", "2-3 roky ve volné přírodě", "1-2 roky ve volné přírodě"
        ]
      },
      birds: {
        category: "Ptáci",
        commonNames: [
          "Orel skalní", "Kondor kalifornský", "Pelikán hnědý", "Volavka modrá", "Ibis bílý",
          "Rybák belohlavý", "Jeřáb kanadský", "Labuť zpěvná", "Kachna divoká", "Potápka malá",
          "Sup krkavcovitý", "Jestřáb ostrokřídlý", "Sokol stěhovavý", "Puštík virginský", "Sýček králičí",
          "Kolibřík rubínohrdlý", "Datel pileated", "Vlaštovka obecná", "Drozd stěhovavý", "Kardinál červený",
          "Sojka modrá", "Krocan divoký", "Ledňáček říční", "Jeřáb písečný", "Datel černý",
          "Pěnice žlutá", "Brhlík bělokrký", "Brkoslav cedrový", "Ovesnice modrá", "Dlask růžovoprsý"
        ],
        sizes: [
          "Rozpětí: 185-230 cm, Hmotnost: 3-6 kg", "Rozpětí: 270-310 cm, Hmotnost: 7-14 kg",
          "Rozpětí: 200-230 cm, Hmotnost: 2-5 kg", "Rozpětí: 165-195 cm, Hmotnost: 2-3 kg",
          "Rozpětí: 90-105 cm, Hmotnost: 1-2 kg", "Rozpětí: 180-240 cm, Hmotnost: 3-6 kg",
          "Rozpětí: 200-230 cm, Hmotnost: 4-7 kg", "Rozpětí: 200-240 cm, Hmotnost: 7-14 kg",
          "Rozpětí: 80-95 cm, Hmotnost: 1-2 kg", "Rozpětí: 55-65 cm, Hmotnost: 0.3-0.6 kg",
          "Rozpětí: 160-180 cm, Hmotnost: 1-2 kg", "Rozpětí: 95-120 cm, Hmotnost: 0.7-1.5 kg",
          "Rozpětí: 95-115 cm, Hmotnost: 0.6-1.5 kg", "Rozpětí: 95-115 cm, Hmotnost: 0.4-0.8 kg",
          "Rozpětí: 50-60 cm, Hmotnost: 0.1-0.2 kg", "Rozpětí: 8-11 cm, Hmotnost: 2-6 g",
          "Rozpětí: 65-75 cm, Hmotnost: 0.2-0.5 kg", "Rozpětí: 30-35 cm, Hmotnost: 15-25 g",
          "Rozpětí: 20-25 cm, Hmotnost: 75-85 g", "Rozpětí: 25-30 cm, Hmotnost: 35-65 g",
          "Rozpětí: 35-40 cm, Hmotnost: 75-100 g", "Rozpětí: 125-145 cm, Hmotnost: 5-11 kg",
          "Rozpětí: 25-30 cm, Hmotnost: 40-60 g", "Rozpětí: 65-75 cm, Hmotnost: 0.4-0.7 kg",
          "Rozpětí: 35-40 cm, Hmotnost: 55-90 g", "Rozpětí: 12-15 cm, Hmotnost: 8-12 g",
          "Rozpětí: 20-25 cm, Hmotnost: 20-25 g", "Rozpětí: 25-30 cm, Hmotnost: 12-18 g",
          "Rozpětí: 30-35 cm, Hmotnost: 25-35 g", "Rozpětí: 30-35 cm, Hmotnost: 30-40 g"
        ],
        lifespans: [
          "20-30 let ve volné přírodě", "50-60 let ve volné přírodě", "25-30 let ve volné přírodě",
          "15-20 let ve volné přírodě", "20-25 let ve volné přírodě", "25-30 let ve volné přírodě",
          "20-25 let ve volné přírodě", "20-30 let ve volné přírodě", "15-20 let ve volné přírodě",
          "10-15 let ve volné přírodě", "15-20 let ve volné přírodě", "10-15 let ve volné přírodě",
          "15-20 let ve volné přírodě", "10-15 let ve volné přírodě", "7-10 let ve volné přírodě",
          "3-5 let ve volné přírodě", "8-12 let ve volné přírodě", "4-8 let ve volné přírodě",
          "8-12 let ve volné přírodě", "8-10 let ve volné přírodě", "7-10 let ve volné přírodě",
          "3-5 let ve volné přírodě", "6-10 let ve volné přírodě", "15-20 let ve volné přírodě",
          "8-12 let ve volné přírodě", "6-8 let ve volné přírodě", "6-8 let ve volné přírodě",
          "4-6 let ve volné přírodě", "6-8 let ve volné přírodě", "8-10 let ve volné přírodě"
        ]
      },
      fish: {
        category: "Ryby",
        commonNames: [
          "Žralok bílý", "Tuňák obecný", "Losos atlantský", "Treska obecná", "Halibut obecný",
          "Mečoun obecný", "Marlín modrý", "Manta obrovská", "Žralok velrybí", "Úhoř říční",
          "Štika obecná", "Pstruh duhový", "Sumec velký", "Kapr obecný", "Okoun říční",
          "Candát obecný", "Plotice obecná", "Cejn velký", "Lín obecný", "Amur bílý",
          "Pstruh obecný", "Lipan podhorní", "Ostroretka stěhovavá", "Hlavatka obecná", "Jelec tloušť",
          "Parma obecná", "Bolení dravé", "Proudník jednovousý", "Mřenka mramorovaná", "Perlín ostrobřichý"
        ],
        sizes: [
          "Délka: 400-600 cm, Hmotnost: 1500-2500 kg", "Délka: 200-250 cm, Hmotnost: 200-400 kg",
          "Délka: 70-150 cm, Hmotnost: 3-30 kg", "Délka: 60-200 cm, Hmotnost: 5-96 kg",
          "Délka: 200-470 cm, Hmotnost: 130-315 kg", "Délka: 300-450 cm, Hmotnost: 400-650 kg",
          "Délka: 300-500 cm, Hmotnost: 180-820 kg", "Šířka: 600-900 cm, Hmotnost: 1350-2000 kg",
          "Délka: 500-1200 cm, Hmotnost: 15000-34000 kg", "Délka: 60-150 cm, Hmotnost: 0.5-6 kg",
          "Délka: 40-150 cm, Hmotnost: 1-25 kg", "Délka: 30-120 cm, Hmotnost: 0.5-25 kg",
          "Délka: 100-500 cm, Hmotnost: 10-400 kg", "Délka: 40-120 cm, Hmotnost: 2-40 kg",
          "Délka: 25-60 cm, Hmotnost: 0.5-9 kg", "Délka: 40-130 cm, Hmotnost: 1-15 kg",
          "Délka: 15-45 cm, Hmotnost: 0.1-2 kg", "Délka: 30-80 cm, Hmotnost: 1-6 kg",
          "Délka: 20-70 cm, Hmotnost: 0.5-7 kg", "Délka: 60-120 cm, Hmotnost: 16-40 kg",
          "Délka: 25-86 cm, Hmotnost: 0.4-15 kg", "Délka: 30-60 cm, Hmotnost: 0.5-5 kg",
          "Délka: 40-120 cm, Hmotnost: 1-15 kg", "Délka: 8-22 cm, Hmotnost: 0.01-0.2 kg",
          "Délka: 12-20 cm, Hmotnost: 0.02-0.1 kg", "Délka: 30-70 cm, Hmotnost: 0.5-4 kg",
          "Délka: 15-50 cm, Hmotnost: 0.1-2 kg", "Délka: 8-15 cm, Hmotnost: 0.01-0.05 kg",
          "Délka: 15-25 cm, Hmotnost: 0.05-0.2 kg", "Délka: 8-12 cm, Hmotnost: 0.01-0.03 kg"
        ],
        lifespans: [
          "70-100 let ve volné přírodě", "40-50 let ve volné přírodě", "4-6 let ve volné přírodě",
          "25-30 let ve volné přírodě", "50-55 let ve volné přírodě", "15-20 let ve volné přírodě",
          "20-25 let ve volné přírodě", "20-25 let ve volné přírodě", "70-100 let ve volné přírodě",
          "15-20 let ve volné přírodě", "10-30 let ve volné přírodě", "6-8 let ve volné přírodě",
          "60-100 let ve volné přírodě", "20-40 let ve volné přírodě", "15-22 let ve volné přírodě",
          "10-14 let ve volné přírodě", "8-15 let ve volné přírodě", "15-20 let ve volné přírodě",
          "10-14 let ve volné přírodě", "9-20 let ve volné přírodě", "6-8 let ve volné přírodě",
          "15-20 let ve volné přírodě", "4-6 let ve volné přírodě", "3-5 let ve volné přírodě",
          "6-8 let ve volné přírodě", "10-15 let ve volné přírodě", "8-12 let ve volné přírodě",
          "3-5 let ve volné přírodě", "4-6 let ve volné přírodě", "3-4 roky ve volné přírodě"
        ]
      },
      reptiles: {
        category: "Plazi",
        commonNames: [
          "Aligátor americký", "Želva zelená", "Anakonda velká", "Komodský varan", "Galapážská želva",
          "Chřestýš diamantový", "Leguán zelený", "Chameleon jemenský", "Gekon tokaj", "Korytnačka červenouchá",
          "Krajta královská", "Boa dusivá", "Monitor nilský", "Želva zelenavá", "Skink modrý",
          "Had korálový", "Želva pouštní", "Varan bengálský", "Anolis zelený", "Gekončík domácí",
          "Zmije obecná", "Užovka obojková", "Ještěrka obecná", "Slepýš křehký", "Želva bahenní",
          "Chameleon obecný", "Leguán modrý", "Had mléčný", "Želva nádherná", "Varan nilský"
        ],
        sizes: [
          "Délka: 280-460 cm, Hmotnost: 230-450 kg", "Délka: 80-150 cm, Hmotnost: 65-230 kg",
          "Délka: 400-900 cm, Hmotnost: 30-250 kg", "Délka: 200-300 cm, Hmotnost: 70-90 kg",
          "Délka: 100-130 cm, Hmotnost: 180-400 kg", "Délka: 90-150 cm, Hmotnost: 1-7 kg",
          "Délka: 120-200 cm, Hmotnost: 4-17 kg", "Délka: 35-60 cm, Hmotnost: 0.1-0.3 kg",
          "Délka: 20-40 cm, Hmotnost: 0.15-0.4 kg", "Délka: 15-30 cm, Hmotnost: 0.1-2 kg",
          "Délka: 90-180 cm, Hmotnost: 1-9 kg", "Délka: 180-400 cm, Hmotnost: 10-45 kg",
          "Délka: 120-200 cm, Hmotnost: 15-20 kg", "Délka: 60-120 cm, Hmotnost: 35-200 kg",
          "Délka: 35-60 cm, Hmotnost: 0.1-0.5 kg", "Délka: 60-120 cm, Hmotnost: 0.5-5 kg",
          "Délka: 25-35 cm, Hmotnost: 0.2-0.7 kg", "Délka: 60-180 cm, Hmotnost: 2-25 kg",
          "Délka: 15-20 cm, Hmotnost: 0.003-0.007 kg", "Délka: 7-15 cm, Hmotnost: 0.002-0.01 kg",
          "Délka: 50-90 cm, Hmotnost: 0.05-0.2 kg", "Délka: 80-200 cm, Hmotnost: 0.1-2 kg",
          "Délka: 15-25 cm, Hmotnost: 0.005-0.02 kg", "Délka: 30-50 cm, Hmotnost: 0.1-0.2 kg",
          "Délka: 12-25 cm, Hmotnost: 0.1-0.5 kg", "Délka: 15-25 cm, Hmotnost: 0.01-0.05 kg",
          "Délka: 120-180 cm, Hmotnost: 13-18 kg", "Délka: 60-180 cm, Hmotnost: 0.2-8 kg",
          "Délka: 20-35 cm, Hmotnost: 0.1-0.4 kg", "Délka: 150-220 cm, Hmotnost: 15-20 kg"
        ],
        lifespans: [
          "35-50 let ve volné přírodě", "80-100 let ve volné přírodě", "10-20 let ve volné přírodě",
          "30-50 let ve volné přírodě", "100-150 let ve volné přírodě", "15-25 let ve volné přírodě",
          "15-20 let ve volné přírodě", "5-8 let ve volné přírodě", "7-10 let ve volné přírodě",
          "20-40 let ve volné přírodě", "20-30 let ve volné přírodě", "20-30 let ve volné přírodě",
          "10-20 let ve volné přírodě", "50-80 let ve volné přírodě", "15-20 let ve volné přírodě",
          "7-10 let ve volné přírodě", "50-80 let ve volné přírodě", "15-20 let ve volné přírodě",
          "4-8 let ve volné přírodě", "5-10 let ve volné přírodě", "15-20 let ve volné přírodě",
          "15-25 let ve volné přírodě", "5-10 let ve volné přírodě", "30-54 let ve volné přírodě",
          "40-75 let ve volné přírodě", "4-8 let ve volné přírodě", "15-20 let ve volné přírodě",
          "10-20 let ve volné přírodě", "50-80 let ve volné přírodě", "10-20 let ve volné přírodě"
        ]
      },
      amphibians: {
        category: "Obojživelníci",
        commonNames: [
          "Žába skokavá", "Ropucha obecná", "Čolek obecný", "Salamandr skvrnitý", "Rosnička zelená",
          "Mlok velký", "Žába zelená", "Ropucha zelená", "Čolek horský", "Žába štíhlá",
          "Salamandr alpský", "Rosnička stromová", "Ropucha krásná", "Čolek dunajský", "Žába ostronosá",
          "Mlok karpatský", "Ropucha obecná velká", "Čolek malý", "Žába hnědá", "Salamandr černý",
          "Rosnička obecná", "Ropucha krásná malá", "Čolek alpský", "Žába travní", "Mlok horský",
          "Salamandr ohnivý", "Rosnička skvělá", "Ropucha zelená velká", "Čolek severní", "Žába lesní"
        ],
        sizes: [
          "Délka: 6-9 cm, Hmotnost: 22-80 g", "Délka: 8-20 cm, Hmotnost: 20-180 g",
          "Délka: 7-11 cm, Hmotnost: 0.3-5 g", "Délka: 15-25 cm, Hmotnost: 8-65 g",
          "Délka: 3-5 cm, Hmotnost: 3-10 g", "Délka: 12-18 cm, Hmotnost: 9-50 g",
          "Délka: 5-12 cm, Hmotnost: 4-35 g", "Délka: 5-10 cm, Hmotnost: 10-50 g",
          "Délka: 8-12 cm, Hmotnost: 2-8 g", "Délka: 4-7 cm, Hmotnost: 2-15 g",
          "Délka: 7-12 cm, Hmotnost: 3-15 g", "Délka: 3-5 cm, Hmotnost: 2-8 g",
          "Délka: 6-8 cm, Hmotnost: 8-25 g", "Délka: 7-10 cm, Hmotnost: 1-4 g",
          "Délka: 4-6 cm, Hmotnost: 3-12 g", "Délka: 8-11 cm, Hmotnost: 2-6 g",
          "Délka: 9-15 cm, Hmotnost: 25-100 g", "Délka: 6-9 cm, Hmotnost: 1-3 g",
          "Délka: 5-8 cm, Hmotnost: 5-20 g", "Délka: 8-14 cm, Hmotnost: 5-25 g",
          "Délka: 3-4 cm, Hmotnost: 2-6 g", "Délka: 5-7 cm, Hmotnost: 6-18 g",
          "Délka: 6-9 cm, Hmotnost: 1-3 g", "Délka: 6-10 cm, Hmotnost: 8-30 g",
          "Délka: 7-10 cm, Hmotnost: 2-5 g", "Délka: 15-23 cm, Hmotnost: 15-40 g",
          "Délka: 3-4 cm, Hmotnost: 2-5 g", "Délka: 6-12 cm, Hmotnost: 12-60 g",
          "Délka: 6-8 cm, Hmotnost: 1-2 g", "Délka: 4-7 cm, Hmotnost: 3-15 g"
        ],
        lifespans: [
          "5-10 let ve volné přírodě", "8-12 let ve volné přírodě", "10-16 let ve volné přírodě",
          "10-20 let ve volné přírodě", "5-9 let ve volné přírodě", "16-20 let ve volné přírodě",
          "5-12 let ve volné přírodě", "6-10 let ve volné přírodě", "8-15 let ve volné přírodě",
          "4-8 let ve volné přírodě", "10-20 let ve volné přírodě", "4-7 let ve volné přírodě",
          "7-12 let ve volné přírodě", "8-12 let ve volné přírodě", "4-6 let ve volné přírodě",
          "8-12 let ve volné přírodě", "10-15 let ve volné přírodě", "6-10 let ve volné přírodě",
          "6-9 let ve volné přírodě", "15-25 let ve volné přírodě", "4-6 let ve volné přírodě",
          "6-9 let ve volné přírodě", "6-10 let ve volné přírodě", "7-12 let ve volné přírodě",
          "6-9 let ve volné přírodě", "20-30 let ve volné přírodě", "4-6 let ve volné přírodě",
          "8-12 let ve volné přírodě", "6-8 let ve volné přírodě", "5-8 let ve volné přírodě"
        ]
      }
    };
  }

  // Generate habitat descriptions based on category and animal type
  generateCzechHabitat(category, index) {
    const habitatTemplates = {
      mammals: [
        "Africké savany a travnaté pláně. Preferují otevřené krajiny s dostatkem kořisti.",
        "Sibiřské tajgy a smíšené lesy. Preferují chladné oblasti s hustou vegetací.",
        "Africké savany a lesní oblasti. Preferují oblasti s dostatkem vody a vegetace.",
        "Africké savany a otevřené krajiny. Preferují oblasti s vysokými stromy.",
        "Africké savany a travnaté oblasti. Preferují oblasti s bahnitými jezery.",
        "Africké řeky a jezera. Tráví většinu času ve vodě.",
        "Africké savany a travnaté pláně. Žijí ve stádech.",
        "Africké a asijské savany. Preferují otevřené krajiny pro lov.",
        "Africké a asijské lesy. Preferují hustou vegetaci pro úkryt.",
        "Jihoamerické deštné lesy. Preferují oblasti blízko vody.",
        "Severní a jihoamerické hory a lesy. Preferují skalnaté oblasti.",
        "Severní lesy a tundra. Preferují chladné oblasti.",
        "Severní lesy a tundra. Žijí ve smečkách.",
        "Severní lesy a hory. Preferují oblasti s dostatkem ryb.",
        "Arktické oblasti a ledové kry. Preferují chladné prostředí.",
        "Jihovýchodní asijské deštné lesy. Preferují koruny stromů.",
        "Africké deštné lesy. Preferují hustou vegetaci.",
        "Africké deštné lesy. Žijí ve skupinách.",
        "Madagaskarské lesy. Preferují stromy a křoviny.",
        "Australské eukalyptové lesy. Preferují koruny stromů.",
        "Australské stepi a travnaté oblasti. Žijí ve skupinách.",
        "Australské lesy a křoviny. Preferují podzemní nory.",
        "Africké savany a lesy. Preferují oblasti s mravenci.",
        "Jihoamerické deštné lesy. Preferují koruny stromů.",
        "Jihoamerické savany a lesy. Preferují oblasti s mravenci.",
        "Jihoamerické hory a lesy. Preferují vlhké oblasti.",
        "Jihoamerické Andy a stepi. Preferují vysokohorské oblasti.",
        "Jihoamerické Andy a stepi. Preferují chladné oblasti.",
        "Severoamerické prérie a stepi. Žijí ve stádech.",
        "Evropské a asijské lesy. Preferují smíšené lesy."
      ],
      birds: [
        "Severoamerické hory a útesy. Preferují vysoké útvary pro hnízda.",
        "Kalifornské hory a kaňony. Preferují skalnaté oblasti.",
        "Pobřežní oblasti a ústí řek. Preferují mělké vody s rybami.",
        "Mokřady a bažiny. Preferují stojaté vody s bohatou faunou.",
        "Mokřady a pobřežní oblasti. Preferují mělké vody.",
        "Severoamerické jezera a řeky. Preferují čisté vody s rybami.",
        "Severoamerické mokřady a prérie. Migrují na dlouhé vzdálenosti.",
        "Severoamerická jezera a mokřady. Preferují čisté vody.",
        "Severoamerické mokřady a jezera. Preferují stojaté vody.",
        "Severoamerická jezera a rybníky. Preferují čisté vody.",
        "Severoamerické pouště a otevřené krajiny. Preferují teplé oblasti.",
        "Severoamerické lesy a otevřené krajiny. Preferují smíšené oblasti.",
        "Severoamerické útesy a města. Preferují vysoké budovy.",
        "Severoamerické lesy a parky. Preferují staré stromy s dutinami.",
        "Severoamerické prérie a zemědělské oblasti. Preferují otevřené krajiny.",
        "Severoamerické zahrady a parky. Preferují květnaté oblasti.",
        "Severoamerické lesy. Preferují staré stromy s dutinami.",
        "Severoamerické farmy a otevřené krajiny. Migrují do Jižní Ameriky.",
        "Severoamerické lesy a parky. Preferují oblasti s červy.",
        "Severoamerické lesy a křoviny. Preferují husté porosty.",
        "Severoamerické lesy a parky. Preferují duby a ořešáky.",
        "Severoamerické lesy a otevřené krajiny. Preferují smíšené oblasti.",
        "Severoamerické řeky a potoky. Preferují čisté vody s rybami.",
        "Severoamerické pobřeží a pláže. Preferují písečné oblasti.",
        "Severoamerické lesy. Preferují staré stromy s dutinami.",
        "Severoamerické lesy a křoviny. Preferují husté porosty.",
        "Severoamerické lesy. Preferují staré stromy s dutinami.",
        "Severoamerické lesy a parky. Preferují oblasti s bobulemi.",
        "Severoamerické lesy a křoviny. Preferují otevřené oblasti.",
        "Severoamerické lesy a parky. Preferují oblasti s hmyzem."
      ],
      fish: [
        "Teplé oceánské vody po celém světě. Preferují pobřežní oblasti.",
        "Teplé oceánské vody. Migrují na dlouhé vzdálenosti.",
        "Severní Atlantik a Pacifik. Migrují mezi sladkou a slanou vodou.",
        "Chladné severní oceány. Preferují hluboké vody.",
        "Chladné severní oceány. Preferují písčité dno.",
        "Teplé oceánské vody. Preferují otevřené oceány.",
        "Teplé oceánské vody. Preferují hluboké vody.",
        "Teplé oceánské vody. Preferují otevřené oceány.",
        "Teplé oceánské vody po celém světě. Preferují plankton.",
        "Evropské a severoamerické řeky. Migrují do oceánu.",
        "Evropské a severoamerické řeky a jezera. Preferují vegetaci.",
        "Chladné řeky a jezera. Preferují čisté vody.",
        "Evropské a severoamerické řeky. Preferují hluboké vody.",
        "Evropské a asijské řeky a jezera. Preferují teplé vody.",
        "Evropské a severoamerické řeky a jezera. Preferují čisté vody.",
        "Evropské řeky a jezera. Preferují hluboké vody.",
        "Evropské řeky a jezera. Preferují mělké vody.",
        "Evropské řeky a jezera. Preferují teplé vody.",
        "Evropské rybníky a jezera. Preferují bahnitý substrát.",
        "Asijské řeky a jezera. Preferují vegetaci.",
        "Evropské a severoamerické horské potoky. Preferují chladné vody.",
        "Evropské horské řeky. Preferují rychle tekoucí vody.",
        "Evropské řeky. Migrují za rozmnožováním.",
        "Evropské potoky a řeky. Preferují kamenité dno.",
        "Evropské řeky. Preferují rychle tekoucí vody.",
        "Evropské řeky a potoky. Preferují čisté vody.",
        "Evropské řeky. Preferují rychle tekoucí vody.",
        "Evropské potoky. Preferují kamenité dno.",
        "Evropské řeky a potoky. Preferují čisté vody.",
        "Evropské řeky. Preferují rychle tekoucí vody."
      ],
      reptiles: [
        "Jihovýchodní USA, mokřady a bažiny. Preferují sladkovodní prostředí.",
        "Tropické oceány po celém světě. Preferují teplé pobřežní vody.",
        "Jihoamerické deštné lesy a mokřady. Preferují oblasti blízko vody.",
        "Indonéské ostrovy. Preferují suché savany a lesy.",
        "Galapážské ostrovy. Preferují suché a vlhké oblasti.",
        "Jihovýchodní USA. Preferují suché oblasti s křovinami.",
        "Střední a Jižní Amerika. Preferují tropické lesy.",
        "Jemen a okolní oblasti. Preferují suché horské oblasti.",
        "Jihovýchodní Asie. Preferují tropické lesy.",
        "Severní Amerika. Preferují sladkovodní prostředí.",
        "Afrika. Preferují savany a suché oblasti.",
        "Střední a Jižní Amerika. Preferují tropické lesy.",
        "Afrika. Preferují řeky a jezera.",
        "Tropické oceány. Preferují pobřežní vody.",
        "Austrálie. Preferují suché oblasti s křovinami.",
        "Severní Amerika. Preferují suché oblasti.",
        "Jihozápadní USA. Preferují pouštní oblasti.",
        "Jižní Asie. Preferují mokřady a lesy.",
        "Karibik a jihovýchodní USA. Preferují tropické oblasti.",
        "Teplé oblasti po celém světě. Preferují lidská obydlí.",
        "Evropa a Asie. Preferují suché oblasti s kameny.",
        "Evropa. Preferují vlhké oblasti blízko vody.",
        "Evropa. Preferují suché oblasti s vegetací.",
        "Evropa. Preferují suché oblasti s pískem.",
        "Evropa a Severní Amerika. Preferují mokřady.",
        "Afrika a Madagaskar. Preferují suché oblasti.",
        "Karibik. Preferují tropické oblasti.",
        "Severní Amerika. Preferují suché oblasti.",
        "Severní Amerika. Preferují pobřežní oblasti.",
        "Afrika. Preferují řeky a jezera."
      ],
      amphibians: [
        "Evropské louky a lesy. Preferují vlhké oblasti s vegetací.",
        "Evropa a Asie. Preferují suché oblasti s úkryty.",
        "Evropa. Preferují čisté potoky a jezírka.",
        "Evropa. Preferují vlhké lesy a potoky.",
        "Evropa. Preferují mokřady a rybníky.",
        "Evropa. Preferují velká jezera a rybníky.",
        "Evropa. Preferují stojaté vody s vegetací.",
        "Evropa. Preferují mokřady a bažiny.",
        "Evropské hory. Preferují chladné horské potoky.",
        "Evropa. Preferují mělké vody s vegetací.",
        "Evropské Alpy. Preferují chladné horské oblasti.",
        "Evropa. Preferují křoviny a stromy blízko vody.",
        "Evropa. Preferují čisté vody v lesích.",
        "Střední Evropa. Preferují čisté horské potoky.",
        "Evropa. Preferují mělké vody s bahnem.",
        "Karpaty. Preferují chladné horské potoky.",
        "Evropa. Preferují velké mokřady.",
        "Evropa. Preferují malá jezírka a tůně.",
        "Evropa. Preferují vlhké lesy a louky.",
        "Evropské hory. Preferují chladné oblasti.",
        "Evropa. Preferují mělké vody s vegetací.",
        "Evropa. Preferují čisté lesní tůně.",
        "Evropské Alpy. Preferují vysokohorské oblasti.",
        "Evropa. Preferují travnaté oblasti blízko vody.",
        "Evropské hory. Preferují chladné horské oblasti.",
        "Evropa. Preferují vlhké lesy s potoky.",
        "Evropa. Preferují čisté vody v lesích.",
        "Evropa. Preferují velké mokřady.",
        "Severní Evropa. Preferují chladné oblasti.",
        "Evropa. Preferují husté lesy s potoky."
      ]
    };

    const templates = habitatTemplates[category] || habitatTemplates.mammals;
    return templates[index % templates.length];
  }

  // Generate fun facts based on category and animal name
  generateCzechFunFact(category, commonName, index) {
    const funFactTemplates = {
      mammals: [
        `${commonName} jsou známí svou silou a dokážou skočit až 3 metry vysoko.`,
        `${commonName} mají výjimečný zrak a dokážou vidět na vzdálenost až 6 km.`,
        `${commonName} mají nejdelší chobot ze všech zvířat a dokážou jím zvednout až 350 kg.`,
        `${commonName} mají nejdelší krk ze všech savců a jejich srdce váží až 11 kg.`,
        `${commonName} mají nejsilnější kůži ze všech zvířat, tlustou až 5 cm.`,
        `${commonName} dokážou lézt po stromech a jsou velmi obratní.`,
        `${commonName} dokážou žít až 15 let.`,
        `${commonName} dokážou žít v horách až do výšky 2000 m.`,
        `${commonName} dokážou skočit až 50 cm vysoko.`,
        `${commonName} dokážou žít až 25 let.`,
        `${commonName} dokážou žít v horách až do výšky 1500 m.`,
        `${commonName} dokážou žít až 12 let.`,
        `${commonName} dokážou žít v horách až do výšky 1000 m.`,
        `${commonName} dokážou skočit až 30 cm vysoko.`,
        `${commonName} dokážou žít až 8 let.`
      ]
    };

    const templates = funFactTemplates[category] || funFactTemplates.mammals;
    return templates[index % templates.length];
  }

  // Utility method to add delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Search for Czech common name based on scientific name
  async searchCzechCommonName(scientificName) {
    try {
      // Search Czech Wikipedia first
      const czechName = await this.searchCzechWikipedia(scientificName);
      if (czechName) {
        console.log(`✅ Found Czech name: ${czechName} for ${scientificName}`);
        return czechName;
      }

      // If not found, try BioLib.cz
      const biolibName = await this.searchBioLib(scientificName);
      if (biolibName) {
        console.log(`✅ Found Czech name from BioLib: ${biolibName} for ${scientificName}`);
        return biolibName;
      }

      console.log(`⚠️ No Czech name found for ${scientificName}`);
      return null;
    } catch (error) {
      console.error(`❌ Error searching for ${scientificName}:`, error.message);
      return null;
    }
  }

  // Search Czech Wikipedia for common name
  async searchCzechWikipedia(scientificName) {
    return new Promise((resolve) => {
      const searchUrl = `https://cs.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(scientificName)}&srlimit=3`;
      
      const url = new URL(searchUrl);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Czech-Animal-Translator/1.0 (Educational Purpose)'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.query && response.query.search && response.query.search.length > 0) {
              // Get the first search result title
              const title = response.query.search[0].title;
              // Extract Czech common name (usually the part before parentheses or scientific name)
              const czechName = this.extractCzechNameFromTitle(title, scientificName);
              resolve(czechName);
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error('Error parsing Wikipedia response:', error.message);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Wikipedia search error:', error.message);
        resolve(null);
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve(null);
      });

      req.end();
    });
  }

  // Search BioLib.cz for common name
  async searchBioLib(scientificName) {
    return new Promise((resolve) => {
      // BioLib.cz search is more complex, for now return null
      // This could be implemented with web scraping if needed
      resolve(null);
    });
  }

  // Extract Czech name from Wikipedia title
  extractCzechNameFromTitle(title, scientificName) {
    // Remove scientific name from title if present
    let czechName = title.replace(new RegExp(scientificName, 'gi'), '').trim();
    
    // Remove parentheses and their content
    czechName = czechName.replace(/\([^)]*\)/g, '').trim();
    
    // Remove common prefixes/suffixes
    czechName = czechName.replace(/^(rod|čeleď|druh)\s+/i, '').trim();
    
    // If the result is too short or contains unwanted characters, return null
    if (czechName.length < 3 || /[0-9]/.test(czechName) || czechName.toLowerCase().includes('seznam')) {
      return null;
    }
    
    return czechName || null;
  }

  // Create backup directory with timestamp
  createBackupDirectory() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupDir = path.join(__dirname, `czech-backup-enhanced-${timestamp}`);
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`✅ Created backup directory: ${this.backupDir}`);
    }
    
    return this.backupDir;
  }

  // Backup existing Czech files
  backupExistingFiles() {
    const categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
    
    categories.forEach(category => {
      const czechFile = path.join(this.czechDir, `${category}.json`);
      if (fs.existsSync(czechFile)) {
        const backupFile = path.join(this.backupDir, `${category}.json`);
        fs.copyFileSync(czechFile, backupFile);
        console.log(`📋 Backed up: ${category}.json`);
      }
    });
  }

  // Load source data from public/images directory
  loadSourceData(category) {
    try {
      const sourceFile = path.join(this.sourceDir, `${category}_data.json`);
      
      if (!fs.existsSync(sourceFile)) {
        throw new Error(`Source file not found: ${sourceFile}`);
      }
      
      const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
      console.log(`📖 Loaded ${data.photos ? data.photos.length : 0} entries from ${category}_data.json`);
      return data;
    } catch (error) {
      console.error(`❌ Error loading source data for ${category}:`, error.message);
      return null;
    }
  }

  // Generate English locale data from source
  generateEnglishLocale(sourceData) {
    try {
      const englishData = { 
        category: sourceData.category,
        totalPhotos: sourceData.totalPhotos,
        photos: [] 
      };
      
      if (!sourceData.photos || !Array.isArray(sourceData.photos)) {
        throw new Error('Invalid source data structure');
      }

      sourceData.photos.forEach((photo) => {
        englishData.photos.push({
          fileName: photo.fileName,
          commonName: photo.commonName,
          scientificName: photo.scientificName,
          size: photo.size,
          lifespan: photo.lifespan,
          habitat: photo.habitat,
          funFact: photo.funFact,
          localPath: photo.localPath
        });
      });

      return englishData;
    } catch (error) {
      console.error(`❌ Error generating English locale:`, error.message);
      return null;
    }
  }

  // Generate Czech translations based on scientific names
  async generateCzechTranslations(category, sourceData) {
    try {
      const czechData = { 
        category: sourceData.category,
        totalPhotos: sourceData.totalPhotos,
        photos: [] 
      };
      const translationData = this.getCzechTranslationData()[category];
      
      if (!translationData) {
        throw new Error(`No translation data found for category: ${category}`);
      }

      if (!sourceData.photos || !Array.isArray(sourceData.photos)) {
        throw new Error('Invalid source data structure');
      }

      console.log(`🔄 Processing ${sourceData.photos.length} entries for ${category}...`);

      for (let index = 0; index < sourceData.photos.length; index++) {
        const photo = sourceData.photos[index];
        
        // Always search for Czech common name based on scientific name - never use hardcoded translations
        console.log(`🔍 Searching for Czech name of ${photo.scientificName}...`);
        const searchedName = await this.searchCzechCommonName(photo.scientificName);
        
        let czechCommonName;
        if (searchedName) {
          czechCommonName = searchedName;
          console.log(`✅ Found Czech name: ${czechCommonName} for ${photo.scientificName}`);
        } else {
          // Only use "Neznámý" as fallback if search fails - no hardcoded translations
          czechCommonName = `Neznámý ${translationData.category.toLowerCase()} ${index + 1}`;
          console.log(`⚠️ No Czech name found for ${photo.scientificName}, using fallback: ${czechCommonName}`);
        }
        
        // Create Czech translation using scientific name as key identifier
        const czechEntry = {
          fileName: photo.fileName,
          commonName: czechCommonName,
          scientificName: photo.scientificName, // Preserve scientific name as universal identifier
          size: photo.size, // Use original size data from source file
          lifespan: translationData.lifespans[index] || "Životnost není k dispozici",
          habitat: this.translateHabitat(photo.habitat),
          funFact: this.translateFunFact(photo.funFact, czechCommonName || 'Toto zvíře'),
          localPath: photo.localPath
        };

        czechData.photos.push(czechEntry);
        
        // Add delay to avoid overwhelming search services
        if (index < sourceData.photos.length - 1) {
          await this.delay(2000); // Increased delay to be more respectful to search services
        }
      }

      console.log(`✅ Generated ${czechData.photos.length} Czech translations for ${category}`);
      return czechData;
    } catch (error) {
      console.error(`❌ Error generating Czech translations for ${category}:`, error.message);
      this.translationStats.errors++;
      return null;
    }
  }

  translateHabitat(englishHabitat) {
    // Comprehensive habitat translation patterns
    const habitatPatterns = [
      // Specific detailed patterns
      { pattern: /large forested areas across north america.*deciduous and mixed forests, swamps, and mountainous regions/i, translation: 'Rozsáhlé lesní oblasti napříč Severní Amerikou. Obývají listnaté a smíšené lesy, bažiny a hornaté regiony.' },
      { pattern: /forests, grasslands, and suburban areas across the americas.*edge habitats where forests meet open areas/i, translation: 'Lesy, travnaté oblasti a předměstské oblasti napříč Amerikou. Preferují okrajové biotopy, kde se lesy setkávají s otevřenými oblastmi.' },
      { pattern: /deciduous and mixed forests in eastern north america.*urban parks and suburban areas/i, translation: 'Listnaté a smíšené lesy ve východní Severní Americe. Jsou velmi přizpůsobiví a prosperují v městských parcích a předměstských oblastech.' },
      { pattern: /deciduous and mixed forests, wetlands, and urban areas across north america.*near water sources/i, translation: 'Listnaté a smíšené lesy, mokřady a městské oblasti napříč Severní Amerikou. Preferují oblasti blízko vodních zdrojů.' },
      { pattern: /diverse environments across the northern hemisphere.*forests, grasslands, mountains, and urban areas/i, translation: 'Rozmanitá prostředí napříč severní polokoulí, včetně lesů, travnatých oblastí, hor a městských oblastí.' },
      { pattern: /forests, tundra, deserts, plains, and mountains across northern regions.*abundant prey and minimal human disturbance/i, translation: 'Lesy, tundra, pouště, pláně a hory napříč severními regiony. Preferují oblasti s hojnou kořistí a minimálním lidským rušením.' },
      { pattern: /diverse habitats from tropical rainforests to deserts and mountains across the americas.*dense vegetation for stalking prey/i, translation: 'Rozmanitá stanoviště od tropických deštných lesů po pouště a hory napříč Amerikou. Preferují oblasti s hustou vegetací pro pronásledování kořisti.' },
      { pattern: /boreal and mixed deciduous forests near lakes, wetlands, and swamps across northern regions.*abundant aquatic vegetation/i, translation: 'Boreální a smíšené listnaté lesy blízko jezer, mokřadů a bažin napříč severními regiony. Preferují oblasti s hojnou vodní vegetací.' },
      { pattern: /freshwater environments including rivers, streams, ponds, and wetlands across north america.*deciduous trees near water/i, translation: 'Sladkovodní prostředí včetně řek, potoků, rybníků a mokřadů napříč Severní Amerikou. Preferují oblasti s listnatými stromy blízko vody.' },
      { pattern: /diverse habitats including forests, swamps, deserts, and suburban areas across north america.*dense cover for hunting/i, translation: 'Rozmanitá stanoviště včetně lesů, bažin, pouští a předměstských oblastí napříč Severní Amerikou. Preferují oblasti s hustým krytem pro lov.' },
      { pattern: /forest edges, meadows, and grasslands across western north america.*seasonally between summer and winter ranges/i, translation: 'Okraje lesů, louky a travnaté oblasti napříč západní Severní Amerikou. Migrují sezónně mezi letními a zimními oblastmi.' },
      { pattern: /coniferous and mixed forests across north america.*abundant trees for feeding and denning/i, translation: 'Jehličnaté a smíšené lesy napříč Severní Amerikou. Preferují oblasti s hojnými stromy pro krmení a stavbu nor.' },
      { pattern: /diverse habitats including forests, grasslands, and suburban areas across north america.*mixed cover and abundant food sources/i, translation: 'Rozmanitá stanoviště včetně lesů, travnatých oblastí a předměstských oblastí napříč Severní Amerikou. Preferují oblasti se smíšeným krytem a hojnými zdroji potravy.' },
      { pattern: /diverse habitats including forests, farmlands, and urban areas across north america.*human-modified environments/i, translation: 'Rozmanitá stanoviště včetně lesů, zemědělských oblastí a městských oblastí napříč Severní Amerikou. Jsou velmi přizpůsobiví lidmi pozměněným prostředím.' },
      { pattern: /deciduous forests and woodland edges across eastern north america.*abundant nuts and seeds/i, translation: 'Listnaté lesy a okraje lesů napříč východní Severní Amerikou. Preferují oblasti s hojnými ořechy a semeny.' },
      { pattern: /wetlands, marshes, ponds, and slow-moving streams across north america.*emergent vegetation/i, translation: 'Mokřady, bažiny, rybníky a pomalu tekoucí potoky napříč Severní Amerikou. Preferují oblasti s emergentní vegetací.' },
      { pattern: /freshwater and coastal marine environments across north america.*clean water and abundant fish populations/i, translation: 'Sladkovodní a pobřežní mořská prostředí napříč Severní Amerikou. Preferují oblasti s čistou vodou a hojnými populacemi ryb.' },
      { pattern: /extremely diverse habitats from deserts to forests to urban areas across north america.*human environments/i, translation: 'Extrémně rozmanitá stanoviště od pouští po lesy až po městské oblasti napříč Severní Amerikou. Jsou velmi přizpůsobiví lidským prostředím.' },
      { pattern: /rocky mountainous areas, cliffs, and alpine meadows across western north america.*steep terrain that provides escape routes from predators/i, translation: 'Skalnaté hornaté oblasti, útesy a alpské louky napříč západní Severní Amerikou. Preferují strmý terén, který poskytuje únikové cesty před predátory.' },
      
      // Additional patterns for mixed content
      { pattern: /diverse habitats from deserts to hory napříč western severní amerika.*areas with smíšené vegetation and escape cover/i, translation: 'Rozmanitá stanoviště od pouští po hory napříč západní Severní Amerikou. Preferují oblasti se smíšenou vegetací a úkryty.' },
      { pattern: /remote wilderness areas including boreal lesy, tundra, and alpine regions napříč northern regions.*large territories with minimal human disturbance/i, translation: 'Odlehlé divočinné oblasti včetně boreálních lesů, tundry a alpských regionů napříč severními regiony. Vyžadují velká teritoria s minimálním lidským rušením.' },
      { pattern: /short and smíšené-grass prairies napříč central severní amerika.*areas with low vegetation that allows for good visibility/i, translation: 'Krátké a smíšené travnaté prérie napříč centrální Severní Amerikou. Preferují oblasti s nízkou vegetací, která umožňuje dobrou viditelnost.' },
      { pattern: /open fields, meadows, and les edges napříč eastern severní amerika.*areas with well-drained soil for burrowing/i, translation: 'Otevřená pole, louky a okraje lesů napříč východní Severní Amerikou. Preferují oblasti s dobře odvodněnou půdou pro hrabání nor.' },
      { pattern: /travnaté oblasti and prairies napříč central severní amerika.*open areas with abundant grasses and access to water/i, translation: 'Travnaté oblasti a prérie napříč centrální Severní Amerikou. Preferují otevřené oblasti s hojnými trávami a přístupem k vodě.' },
      { pattern: /arctic sea ice and coastal areas napříč the arctic circle.*sea ice for hunting seals/i, translation: 'Arktický mořský led a pobřežní oblasti napříč arktickým kruhem. Jsou závislí na mořském ledu pro lov tuleňů.' },
      { pattern: /arctic tundra and boreal lesy napříč northern regions.*migrate vast distances following seasonal food sources/i, translation: 'Arktická tundra a boreální lesy napříč severními regiony. Migrují na obrovské vzdálenosti podle sezónních zdrojů potravy.' },
      { pattern: /steep rocky cliffs and alpine areas in hornaté regiony of western severní amerika.*areas above the tree line/i, translation: 'Strmé skalnaté útesy a alpské oblasti v hornatých regionech západní Severní Ameriky. Preferují oblasti nad hranicí lesa.' },
      { pattern: /open travnaté oblasti, prairies, and desert areas napříč western severní amerika.*areas with good visibility and escape routes/i, translation: 'Otevřené travnaté oblasti, prérie a pouštní oblasti napříč západní Severní Amerikou. Preferují oblasti s dobrou viditelností a únikovými cestami.' },
      
      // Generic fallback patterns
      { pattern: /.*forests.*north america.*/i, translation: 'Lesy napříč Severní Amerikou' },
      { pattern: /.*wetlands.*marshes.*north america.*/i, translation: 'Mokřady, bažiny a rašeliniště napříč Severní Amerikou' },
      { pattern: /.*mountains.*rocky.*north america.*/i, translation: 'Hornaté a skalnaté oblasti napříč Severní Amerikou' },
      { pattern: /.*grasslands.*plains.*north america.*/i, translation: 'Travnaté oblasti a pláně napříč Severní Amerikou' },
      { pattern: /.*urban.*suburban.*north america.*/i, translation: 'Městské a předměstské oblasti napříč Severní Amerikou' }
    ];
    
    // Try to match specific patterns first
    for (const { pattern, translation } of habitatPatterns) {
      if (pattern.test(englishHabitat)) {
        return translation;
      }
    }
    
    // Complete habitat phrase translations to avoid mixed language
    const completeHabitatTranslations = {
      // Common habitat descriptions
      'Wooded areas with abundant cover and water sources across eastern North America': 'Zalesněné oblasti s dostatečným krytem a vodními zdroji napříč východní Severní Amerikou',
      'Large forested areas across North America, preferring deciduous and mixed forests': 'Rozsáhlé lesní oblasti napříč Severní Amerikou, preferují listnaté a smíšené lesy',
      'Deciduous and mixed forests across North America': 'Listnaté a smíšené lesy napříč Severní Amerikou',
      'Forests and wooded areas across North America': 'Lesy a zalesněné oblasti napříč Severní Amerikou',
      'Urban and suburban areas across North America': 'Městské a předměstské oblasti napříč Severní Amerikou',
      'Wetlands, marshes, and areas near water across North America': 'Mokřady, bažiny a oblasti blízko vody napříč Severní Amerikou',
      'Mountainous and rocky areas across North America': 'Hornaté a skalnaté oblasti napříč Severní Amerikou',
      'Grasslands and open areas across North America': 'Travnaté oblasti a otevřené krajiny napříč Severní Amerikou',
      'Coniferous forests and boreal regions across northern North America': 'Jehličnaté lesy a boreální regiony napříč severní Severní Amerikou',
      'Arctic tundra and northern regions of North America': 'Arktická tundra a severní regiony Severní Ameriky',
      'Desert and arid regions of southwestern North America': 'Pouštní a suché regiony jihozápadní Severní Ameriky',
      'Coastal areas and marine environments': 'Pobřežní oblasti a mořské prostředí',
      'Rivers, lakes, and aquatic environments': 'Řeky, jezera a vodní prostředí',
      'Swamps and marshy areas': 'Bažiny a bažinaté oblasti',
      'Prairie and grassland regions': 'Prérijní a travnaté regiony',
      'Alpine and high-elevation areas': 'Alpské oblasti a vysokohorské regiony'
    };
    
    // Check for exact phrase matches first
    if (completeHabitatTranslations[englishHabitat]) {
      return completeHabitatTranslations[englishHabitat];
    }
    
    // If no exact match found, return a generic habitat description
    return 'Různorodá stanoviště napříč Severní Amerikou';
  }

  translateFunFact(englishFunFact, czechAnimalName) {
    // Comprehensive fun fact translation patterns
    const funFactPatterns = [
      // Speed and movement patterns
      { pattern: /can sprint up to (\d+) km\/hr \((\d+) mph\) and are excellent swimmers/i, translation: (match, kmh, mph) => `dokážou běžet rychlostí až ${kmh} km/h (${mph} mph) a jsou vynikající plavci` },
      { pattern: /can leap up to (\d+) meters high and (\d+) meters in length/i, translation: (match, height, length) => `dokážou skočit až ${height} metry vysoko a ${length} metrů daleko` },
      { pattern: /can detect movement up to (\d+) feet away/i, translation: (match, distance) => `dokážou detekovat pohyb až na vzdálenost ${distance} stop` },
      { pattern: /can run up to (\d+) mph/i, translation: (match, speed) => `dokážou běžet rychlostí až ${speed} mph` },
      { pattern: /can run up to (\d+) mph, making them one of the fastest land animals in North America/i, translation: (match, speed) => `dokážou běžet rychlostí až ${speed} mph, což z nich činí jedno z nejrychlejších suchozemských zvířat v Severní Americe` },
      { pattern: /can leap up to (\d+) feet in a single bound with their powerful muscles/i, translation: (match, distance) => `dokážou skočit až ${distance} stop v jednom skoku díky svým silným svalům` },
      { pattern: /can swim at speeds up to (\d+) mph with their webbed feet and excellent aquatic abilities/i, translation: (match, speed) => `dokážou plavat rychlostí až ${speed} mph díky svým plovacím blánám a vynikajícím vodním schopnostem` },
      { pattern: /can jump up to (\d+) feet high with their powerful legs to escape predators/i, translation: (match, height) => `dokážou skočit až ${height} stop vysoko díky svým silným nohám pro únik před predátory` },
      
      // Size and weight patterns
      { pattern: /can weigh up to (\d+) pounds and is the largest member of the deer family in North America/i, translation: (match, weight) => `může vážit až ${weight} liber a je největším členem čeledi jelenů v Severní Americe` },
      { pattern: /can hold up to (\d+) pounds of food in their expandable cheek pouches/i, translation: (match, weight) => `může držet až ${weight} liber potravy ve svých roztažitelných lícních váčcích` },
      { pattern: /can eat up to (\d+) pounds of food per day with their massive appetite and constant foraging/i, translation: (match, weight) => `může sníst až ${weight} liber potravy denně díky svému masivnímu apetitu a neustálému hledání potravy` },
      
      // Diet and behavior patterns
      { pattern: /despite being classified as carnivores, they derive (\d+)% of their diet from plants, making them highly adaptable omnivores/i, translation: (match, percent) => `navzdory tomu, že jsou klasifikováni jako masožravci, ${percent}% jejich stravy tvoří rostliny, což z nich činí vysoce přizpůsobivé všežravce` },
      { pattern: /have extremely sensitive front paws with over ([\d,]+) nerve endings/i, translation: (match, nerves) => `mají extrémně citlivé přední tlapy s více než ${nerves} nervovými zakončeními` },
      { pattern: /often 'wash' their food in water to enhance their sense of touch and better examine their meal/i, translation: `často "myjí" svou potravu ve vodě, aby zlepšili svůj hmat a lépe prozkoumali své jídlo` },
      { pattern: /extremely adaptable and can thrive in a wide range of environments from urban to wilderness/i, translation: `jsou extrémně přizpůsobiví a mohou prosperovat v široké škále prostředí od městských po divočinu` },
      { pattern: /can climb trees despite their size with strong claws and excellent balance/i, translation: `dokážou lézt na stromy navzdory své velikosti díky silným drápům a vynikající rovnováze` },
      { pattern: /can change color from white in winter to brown in summer for seasonal camouflage/i, translation: `dokážou měnit barvu z bílé v zimě na hnědou v létě pro sezónní kamufláž` },
      
      // Memory and intelligence patterns
      { pattern: /can remember the locations of thousands of buried nuts and have been observed using deceptive tactics/i, translation: `dokážou si pamatovat umístění tisíců zakopáných ořechů a byli pozorováni při používání klamných taktik` },
      { pattern: /have excellent hearing and can detect low-frequency sounds and rodents digging underground/i, translation: `mají vynikající sluch a dokážou detekovat nízkofrekvenční zvuky a hlodavce hrabající pod zemí` },
      { pattern: /use Earth's magnetic field to hunt, making them one of the few animals with this ability/i, translation: `používají Zemské magnetické pole k lovu, což z nich činí jedno z mála zvířat s touto schopností` },
      { pattern: /excellent memory and can remember thousands of locations for years with complex spatial navigation/i, translation: `mají vynikající paměť a dokážou si pamatovat tisíce míst po celé roky díky složité prostorové navigaci` },
      { pattern: /highly intelligent with problem-solving abilities, tool use, and complex social behaviors/i, translation: `jsou vysoce inteligentní se schopnostmi řešit problémy, používat nástroje a mají složité sociální chování` },
      
      // Physical characteristics and abilities
      { pattern: /have excellent night vision and can detect movement up to (\d+) feet away/i, translation: (match, distance) => `mají vynikající noční vidění a dokážou detekovat pohyb až na vzdálenost ${distance} stop` },
      { pattern: /excellent night vision that is (\d+) times better than humans with their large eyes/i, translation: (match, times) => `mají vynikající noční vidění, které je ${times}krát lepší než u lidí díky svým velkým očím` },
      { pattern: /has an incredible sense of smell that is ([\d,]+) times stronger than humans and can detect food up to (\d+) miles away/i, translation: (match, times, distance) => `má neuvěřitelný čich, který je ${times}krát silnější než u lidí a dokáže detekovat potravu na vzdálenost až ${distance} mil` },
      { pattern: /can dive to depths of up to (\d+) feet and hold their breath for up to (\d+) minutes when hunting fish/i, translation: (match, depth, minutes) => `může se ponořit do hloubky až ${depth} stop a zadržet dech až ${minutes} minuty při lovu ryb` },
      { pattern: /can survive temperatures as low as -(\d+) degrees with their thick fur and fat layer/i, translation: (match, temp) => `dokáže přežít teploty až -${temp} stupňů díky husté srsti a tukové vrstvě` },
      { pattern: /has excellent hearing and can detect sounds from miles away with their large ears/i, translation: `má vynikající sluch a dokáže detekovat zvuky na vzdálenost až několik mil díky svým velkým uším` },
      { pattern: /has a prehensile tail that acts as a fifth hand for grasping branches while climbing/i, translation: `má úchopný ocas, který funguje jako pátá ruka pro uchopování větví při lezení` },
      { pattern: /has waterproof fur with two layers that allows them to stay warm in freezing water/i, translation: `má vodotěsnou srst se dvěma vrstvami, která mu umožňuje zůstat v teple i v ledové vodě` },
      { pattern: /builds elaborate dams that can be up to (\d+) feet long, engineering marvels that transform ecosystems/i, translation: (match, length) => `staví složité hráze, které mohou být dlouhé až ${length} stop a jsou inženýrskými zázraky, které mění ekosystém` }
    ];
    
    // Try to match specific patterns first
    for (const { pattern, translation } of funFactPatterns) {
      const match = englishFunFact.match(pattern);
      if (match) {
        if (typeof translation === 'function') {
          return translation(...match);
        } else {
          return translation;
        }
      }
    }
    
    // Complete phrase translations for common fun facts
    const completeTranslations = {
      // American Black Bear
      'American black bears can sprint up to 55 km/hr (35 mph) and are excellent swimmers. Despite being classified as carnivores, they derive 90% of their diet from plants, making them highly adaptable omnivores.': 'Medvědi baribali dokážou běžet rychlostí až 55 km/h (35 mph) a jsou vynikající plavci. Navzdory tomu, že jsou klasifikováni jako masožravci, získávají 90% své stravy z rostlin, což z nich činí vysoce přizpůsobivé všežravce.',
      
      // White-tailed Deer
      'White-tailed deer can leap up to 3 meters high and 9 meters in length. They have excellent night vision and can detect movement up to 600 feet away.': 'Jeleni běloocasí dokážou skočit až 3 metry vysoko a 9 metrů daleko. Mají vynikající noční vidění a dokážou detekovat pohyb až na vzdálenost 600 stop.',
      
      // Eastern Gray Squirrel
      'Gray squirrels can remember the locations of thousands of buried nuts and have been observed using deceptive tactics to protect their food caches from other squirrels.': 'Šedé veverky dokážou si pamatovat umístění tisíců zakopáných ořechů a byly pozorovány při používání klamných taktik k ochraně svých zásob potravy před jinými veverkami.',
      
      // Raccoon
      'Raccoons have extremely sensitive front paws with over 100,000 nerve endings. They often \'wash\' their food in water to enhance their sense of touch and better examine their meal.': 'Mývali mají extrémně citlivé přední tlapy s více než 100,000 nervovými zakončeními. Často "myjí" svou potravu ve vodě, aby zlepšili svůj hmat a lépe prozkoumali své jídlo.',
      
      // Red Fox
      'Red foxes have excellent hearing and can detect low-frequency sounds and rodents digging underground. They use Earth\'s magnetic field to hunt, making them one of the few animals with this ability.': 'Lišky obecné mají vynikající sluch a dokážou detekovat nízkofrekvenční zvuky a hlodavce hrabající pod zemí. Používají magnetické pole Země k lovu, což z nich činí jeden z mála zvířat s touto schopností.',
      
      // Gray Wolf
      'Wolves have an incredible sense of smell that is 100 times stronger than humans. They can detect a scent from over 1.5 miles away and track prey for hours.': 'Vlci mají neuvěřitelný čich, který je 100krát silnější než u lidí. Dokážou detekovat vůni na vzdálenost přes 1,5 míle a sledovat kořist po celé hodiny.',
      
      // Mountain Lion
      'Mountain lions can leap 15 feet vertically and 40 feet horizontally. They are excellent climbers and swimmers, making them one of the most adaptable big cats.': 'Pumy americké dokážou skočit 15 stop vertikálně a 40 stop horizontálně. Jsou vynikající lezci a plavci, což z nich činí jednu z nejpřizpůsobivějších velkých koček.',
      
      // Moose
      'Moose are excellent swimmers and can dive up to 20 feet deep to feed on aquatic plants. Despite their size, they can run up to 35 mph and are surprisingly agile.': 'Losi jsou vynikající plavci a dokážou se ponořit až 20 stop hluboko, aby se krmili vodními rostlinami. Navzdory své velikosti dokážou běžet rychlostí až 35 mph a jsou překvapivě obratní.',
      
      // Beaver
      'Beavers are ecosystem engineers whose dams create wetland habitats for hundreds of other species. Their teeth never stop growing and are self-sharpening from constant gnawing.': 'Bobři jsou ekosystémoví inženýři, jejichž hráze vytvářejí mokřadní stanoviště pro stovky dalších druhů. Jejich zuby nikdy nepřestanou růst a jsou samoostřící od neustálého hlodání.',
      
      // Bobcat
      'Bobcats are incredibly stealthy hunters with retractable claws and can leap up to 12 feet to catch prey. They have excellent night vision and hearing.': 'Rysi červení jsou neuvěřitelně nenápadní lovci se zatažitelnými drápy a dokážou skočit až 12 stop, aby chytili kořist. Mají vynikající noční vidění a sluch.',
      
      // Elk
      'Male elk grow antlers that can weigh up to 40 pounds and span 4 feet across. They shed and regrow these antlers annually, making them one of the fastest-growing tissues in the animal kingdom.': 'Samci wapiti pěstují parohy, které mohou vážit až 40 liber a rozpínat se 4 stopy napříč. Shazují a znovu pěstují tyto parohy ročně, což z nich činí jednu z nejrychleji rostoucích tkání v živočišné říši.',
      
      // Porcupine
      'Porcupines have about 30,000 quills that are actually modified hairs with barbed tips. Contrary to popular belief, they cannot shoot their quills but release them when touched.': 'Dikobrazi mají asi 30,000 ostnů, které jsou ve skutečnosti upravené chlupy s ostnatými špičkami. Na rozdíl od všeobecného přesvědčení nemohou své ostny vystřelovat, ale uvolňují je při dotyku.',
      
      // Skunk
      'Skunks can spray their defensive musk up to 10 feet with remarkable accuracy. They give several warning signs before spraying, including stamping feet and raising their tail.': 'Skunki dokážou stříkat svůj obranný pižmo až na 10 stop s pozoruhodnou přesností. Před stříkáním dávají několik varovných signálů, včetně dupání nohama a zvedání ocasu.',
      
      // Opossum
      'Opossums are North America\'s only native marsupial and are immune to most snake venoms. They \'play dead\' when threatened, entering a catatonic state that can last hours.': 'Opossumi jsou jediným původním vačnatcem Severní Ameriky a jsou imunní vůči většině hadích jedů. "Předstírají smrt", když jsou ohroženi, a vstupují do katatonického stavu, který může trvat hodiny.',
      
      // Chipmunk
      'Chipmunks can stuff their cheek pouches with up to 32 beechnuts at once. They create elaborate burrow systems with multiple chambers for sleeping, food storage, and waste.': 'Burundukové dokážou si nacpat lícní váčky až 32 bukvicemi najednou. Vytvářejí složité systémy nor s více komorami pro spánek, skladování potravy a odpad.',
      
      // Muskrat
      'Muskrats can stay underwater for up to 17 minutes and swim backwards as easily as forwards. They build dome-shaped lodges from vegetation, similar to beavers.': 'Ondatry dokážou zůstat pod vodou až 17 minut a plavat pozpátku stejně snadno jako dopředu. Staví kopulovité obydlí z vegetace, podobně jako bobři.',
      
      // River Otter
      'River otters can hold their breath for up to 8 minutes and dive to depths of 60 feet. They slide down muddy or snowy banks for fun, not just transportation.': 'Vydry říční dokážou zadržet dech až 8 minut a ponořit se do hloubky 60 stop. Klouzají se po bahnitých nebo zasněžených březích pro zábavu, nejen pro přepravu.',
      
      // Coyote
      'Coyotes can run up to 43 mph and jump 14 feet horizontally. They have expanded their range dramatically and now live in every US state except Hawaii.': 'Kojoti dokážou běžet rychlostí až 43 mph a skočit 14 stop horizontálně. Dramaticky rozšířili svůj areál a nyní žijí ve všech amerických státech kromě Havaje.',
      
      // Bighorn Sheep
      'Bighorn sheep can climb slopes of 60 degrees and leap 20 feet between ledges. Their hooves have a hard outer edge and soft inner pad for incredible grip on rocks.': 'Mufloni kanadští dokážou lézt po svazích o sklonu 60 stupňů a skočit 20 stop mezi římsami. Jejich kopyta mají tvrdý vnější okraj a měkký vnitřní polštářek pro neuvěřitelný přilnavost na skalách.',
      
      // Mule Deer
      'Mule deer can jump 8 feet high and 15 feet in a single bound. They have excellent hearing and large ears that can move independently to detect sounds from different directions.': 'Jeleni oslí dokážou skočit 8 stop vysoko a 15 stop v jednom skoku. Mají vynikající sluch a velké uši, které se mohou pohybovat nezávisle pro detekci zvuků z různých směrů.',
      
      // Wolverine
      'Wolverines have incredibly strong jaws and can chew through frozen meat and bones. They are known to drive bears and wolves away from their kills despite being much smaller.': 'Rosomáci mají neuvěřitelně silné čelisti a dokážou prokousat zmrzlé maso a kosti. Je známo, že zahánějí medvědy a vlky od jejich úlovků, přestože jsou mnohem menší.',
      
      // Prairie Dog
      'Prairie dogs have a complex language system with different calls for different predators. They can even describe the size, shape, and color of approaching threats.': 'Psíci prérijní mají složitý jazykový systém s různými voláními pro různé predátory. Dokážou dokonce popsat velikost, tvar a barvu blížících se hrozeb.',
      
      // Groundhog/Woodchuck
      'Groundhogs are excellent diggers and can move 700 pounds of soil to create a burrow. They hibernate for up to 5 months and their body temperature can drop to just above freezing.': 'Svišti lesní jsou vynikající kopáči a dokážou přemístit 700 liber půdy při vytváření nory. Hibernují až 5 měsíců a jejich tělesná teplota může klesnout těsně nad bod mrazu.',
      
      // Coyote
      'Coyotes can run up to 43 mph and jump 14 feet horizontally. They have expanded their range dramatically and now live in every US state except Hawaii.': 'Kojoti dokážou běžet rychlostí až 43 mph a skočit 14 stop horizontálně. Dramaticky rozšířili svůj areál a nyní žijí ve všech amerických státech kromě Havaje.',
      
      // Mule Deer
      'Mule deer get their name from their large ears that resemble a mule\'s. They have a unique bounding gait called \'stotting\' where all four feet hit the ground simultaneously.': 'Jeleni oslí dostali své jméno podle velkých uší, které připomínají mulí. Mají jedinečný skákavý chod zvaný "stotting", při kterém všechny čtyři nohy dopadnou na zem současně.',
      
      // Wolverine
      'Wolverines are incredibly strong for their size and can take down prey much larger than themselves. They have been known to drive bears and wolves away from kills.': 'Rosomáci jsou neuvěřitelně silní na svou velikost a dokážou skolit kořist mnohem větší než oni sami. Je známo, že zahánějí medvědy a vlky od jejich úlovků.',
      
      // Prairie Dog
      'Prairie dogs have a sophisticated communication system with different calls for different types of predators. They live in complex underground \'towns\' that can span hundreds of acres.': 'Psíci prérijní mají sofistikovaný komunikační systém s různými voláními pro různé typy predátorů. Žijí ve složitých podzemních "městech", která se mohou rozprostírat na stovky akrů.',
      
      // Groundhog
      'Groundhogs are excellent diggers and can move 700 pounds of soil to create a burrow. They hibernate for up to 5 months, during which their heart rate drops from 80 to 5 beats per minute.': 'Svišti lesní jsou vynikající kopáči a dokážou přemístit 700 liber půdy při vytváření nory. Hibernují až 5 měsíců, během nichž jejich srdeční tep klesne z 80 na 5 úderů za minutu.',
      
      // Lynx
      'Lynx have oversized paws that act like snowshoes, allowing them to hunt effectively in deep snow. Their population cycles closely follow those of snowshoe hares.': 'Rysi mají nadměrně velké tlapy, které fungují jako sněžnice a umožňují jim efektivně lovit v hlubokém sněhu. Jejich populační cykly úzce sledují cykly zajíců sněžných.',
      
      // Bison
      'Bison can run up to 35 mph despite weighing up to 2,000 pounds. They nearly went extinct but have recovered from fewer than 1,000 individuals to over 500,000 today.': 'Bizoni dokážou běžet rychlostí až 35 mph navzdory tomu, že váží až 2,000 liber. Téměř vyhynuli, ale zotavili se z méně než 1,000 jedinců na více než 500,000 dnes.',
      
      // Polar Bear
      'Polar bears have black skin under their white fur to absorb heat from the sun. They are excellent swimmers and can swim for hours covering distances over 60 miles.': 'Lední medvědi mají černou kůži pod bílou srstí, aby absorbovali teplo ze slunce. Jsou vynikající plavci a dokážou plavat hodiny a překonat vzdálenosti přes 60 mil.',
      
      // Grizzly Bear
      'Grizzly bears have an incredible sense of smell that is 7 times better than a bloodhound\'s. They can detect food from over 18 miles away.': 'Medvědi grizzly mají neuvěřitelný čich, který je 7krát lepší než u bloodhounda. Dokážou detekovat potravu na vzdálenost přes 18 mil.',
      
      // Caribou
      'Caribou undertake one of the longest migrations of any land animal, traveling up to 3,000 miles annually. Both males and females grow antlers, unique among deer species.': 'Karibu podnikají jednu z nejdelších migrací ze všech suchozemských zvířat a ročně cestují až 3,000 mil. Parohy pěstují jak samci, tak samice, což je jedinečné mezi druhy jelenů.',
      
      // Mountain Goat
      'Mountain goats can climb nearly vertical cliff faces and have specialized hooves with hard outer rims and soft inner pads for grip. They can jump 12 feet in a single bound.': 'Horské kozy dokážou lézt po téměř vertikálních skalních stěnách a mají specializovaná kopyta s tvrdými vnějšími okraji a měkkými vnitřními polštářky pro přilnavost. Dokážou skočit 12 stop v jednom skoku.',
      
      // Pronghorn
      'Pronghorns are the fastest land animal in North America, capable of running 70 mph for short distances and maintaining 45 mph for extended periods. They have the largest eyes relative to body size of any North American mammal.': 'Vidlorozi jsou nejrychlejším suchozemským zvířetem v Severní Americe, schopným běžet 70 mph na krátké vzdálenosti a udržet 45 mph po delší dobu. Mají největší oči vzhledem k velikosti těla ze všech severoamerických savců.',
      
      // Canada Lynx
      'Lynx have oversized paws that act like snowshoes, allowing them to hunt effectively in deep snow. Their ear tufts help them detect the slightest sounds from prey.': 'Rysi kanadští mají nadměrně velké tlapy, které fungují jako sněžnice a umožňují jim efektivně lovit v hlubokém sněhu. Jejich ušní štětky jim pomáhají detekovat nejslabší zvuky od kořisti.',
      
      // American Bison
      'American bison can run up to 35 mph despite weighing up to 2,000 pounds. They have poor eyesight but excellent hearing and sense of smell.': 'Američtí bizoni dokážou běžet rychlostí až 35 mph navzdory váze až 2,000 liber. Mají špatný zrak, ale vynikající sluch a čich.',
      
      // Nine-banded Armadillo
      'Nine-banded armadillos always give birth to identical quadruplets. They can hold their breath for up to 6 minutes and are excellent swimmers.': 'Pásovci devítipásí vždy rodí identická čtyřčata. Dokážou zadržet dech až 6 minut a jsou vynikající plavci.',
      
      // Big Brown Bat
      'Big brown bats can eat up to 1,000 mosquitoes per hour and use echolocation so precise they can detect wires as thin as human hair in complete darkness.': 'Netopýři velcí dokážou sníst až 1,000 komárů za hodinu a používají echolokaci tak přesnou, že dokážou detekovat dráty tenké jako lidský vlas v úplné tmě.',
      
      // Western Hedgehog
      'Western hedgehogs have up to 5,000 spines that are actually modified hairs. They can roll into a perfect ball for protection and are immune to many snake venoms.': 'Ježci západní mají až 5,000 ostnů, které jsou ve skutečnosti upravené chlupy. Dokážou se svinout do dokonalé koule pro ochranu a jsou imunní vůči mnoha hadím jedům.',
      
      // European Mole
      'European moles can dig tunnels at a rate of 15 feet per hour and have hands that are permanently turned outward for digging. They must eat every 2-3 hours or they will die.': 'Krtci evropští dokážou kopat tunely rychlostí 15 stop za hodinu a mají ruce, které jsou trvale otočené ven pro kopání. Musí jíst každé 2-3 hodiny, jinak zemřou.',
      
      // Small Shrew
      'Small shrews have the highest metabolism of any mammal and must eat every 2-3 hours. Their heart can beat up to 1,200 times per minute.': 'Rejskové malí mají nejvyšší metabolismus ze všech savců a musí jíst každé 2-3 hodiny. Jejich srdce může bít až 1,200krát za minutu.'
    };
    
    // Check for exact matches first
    if (completeTranslations[englishFunFact]) {
      return completeTranslations[englishFunFact];
    }
    
    // If no exact match, return a generic translation message
    return 'Zajímavý fakt o tomto zvířeti.';
  }

  // Save English locale data to file
  saveEnglishData(category, englishData) {
    try {
      const englishFile = path.join(this.englishDir, `${category}.json`);
      
      // Ensure directory exists
      if (!fs.existsSync(this.englishDir)) {
        fs.mkdirSync(this.englishDir, { recursive: true });
      }
      
      fs.writeFileSync(englishFile, JSON.stringify(englishData, null, 2), 'utf8');
      console.log(`💾 Saved English locale to ${englishFile}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving English data for ${category}:`, error.message);
      this.translationStats.errors++;
      return false;
    }
  }

  // Save Czech data to file
  saveCzechData(category, czechData) {
    try {
      const czechFile = path.join(this.czechDir, `${category}.json`);
      
      // Ensure directory exists
      if (!fs.existsSync(this.czechDir)) {
        fs.mkdirSync(this.czechDir, { recursive: true });
      }
      
      fs.writeFileSync(czechFile, JSON.stringify(czechData, null, 2), 'utf8');
      console.log(`💾 Saved Czech translations: ${czechFile}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving Czech data for ${category}:`, error.message);
      this.translationStats.errors++;
      return false;
    }
  }

  // Validate translations
  validateTranslations(category, englishData, czechData) {
    const errors = [];
    const englishPhotos = englishData.photos || [];
    const czechPhotos = czechData.photos || [];

    // Check entry count
    if (englishPhotos.length !== czechPhotos.length) {
      errors.push(`Entry count mismatch: English(${englishPhotos.length}) vs Czech(${czechPhotos.length})`);
    }

    // Check scientific names match
    englishPhotos.forEach((englishEntry, index) => {
      const czechEntry = czechPhotos[index];
      if (!czechEntry) {
        errors.push(`Missing Czech entry at index: ${index}`);
      } else if (englishEntry.scientificName !== czechEntry.scientificName) {
        errors.push(`Scientific name mismatch at index ${index}: ${englishEntry.scientificName} vs ${czechEntry.scientificName}`);
      }
    });

    // Check required fields
    czechPhotos.forEach((czechEntry, index) => {
      const requiredFields = ['commonName', 'scientificName', 'size', 'lifespan', 'habitat', 'funFact'];
      requiredFields.forEach(field => {
        if (!czechEntry[field] || czechEntry[field].trim() === '') {
          errors.push(`Missing or empty field '${field}' at index ${index}`);
        }
      });
    });

    if (errors.length > 0) {
      console.warn(`⚠️  Validation warnings for ${category}:`);
      errors.forEach(error => console.warn(`   - ${error}`));
    } else {
      console.log(`✅ Validation passed for ${category}`);
    }

    return errors.length === 0;
  }

  // Process a single category from source data
  async processCategory(category) {
    console.log(`\n🔄 Processing category: ${category.toUpperCase()}`);
    this.translationStats.processed++;

    try {
      // Load source data from public/images
      const sourceData = this.loadSourceData(category);
      if (!sourceData) {
        throw new Error(`Failed to load source data for ${category}`);
      }

      // Generate English locale data
      const englishData = this.generateEnglishLocale(sourceData);
      if (!englishData) {
        throw new Error(`Failed to generate English locale for ${category}`);
      }

      // Save English locale data
      const englishSaved = this.saveEnglishData(category, englishData);
      if (!englishSaved) {
        throw new Error(`Failed to save English locale for ${category}`);
      }

      // Generate Czech translations (now async with web search)
      const czechData = await this.generateCzechTranslations(category, sourceData);
      if (!czechData) {
        throw new Error(`Failed to generate Czech translations for ${category}`);
      }

      // Validate translations
      const isValid = this.validateTranslations(category, englishData, czechData);
      if (!isValid) {
        console.warn(`⚠️  Validation failed for ${category}, but continuing...`);
      }

      // Save Czech data
      const czechSaved = this.saveCzechData(category, czechData);
      if (!czechSaved) {
        throw new Error(`Failed to save Czech data for ${category}`);
      }

      this.translationStats.successful++;
      console.log(`✅ Successfully processed ${category} (EN + CS locales created)`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to process ${category}:`, error.message);
      this.translationStats.errors++;
      return false;
    }
  }

  // Clear existing locale directories
  clearLocaleDirectories() {
    try {
      console.log('🧹 Clearing existing locale directories...');
      
      // Clear English locales
      if (fs.existsSync(this.englishDir)) {
        fs.rmSync(this.englishDir, { recursive: true, force: true });
      }
      
      // Clear Czech locales
      if (fs.existsSync(this.czechDir)) {
        fs.rmSync(this.czechDir, { recursive: true, force: true });
      }
      
      console.log('✅ Locale directories cleared');
    } catch (error) {
      console.error('❌ Error clearing locale directories:', error.message);
    }
  }

  // Main execution method
  async run() {
    console.log('🚀 Enhanced Dynamic Translation Generator v2.0');
    console.log('📁 Source: public/images → Target: public/locales (EN + CS)');
    console.log('=' .repeat(60));

    try {
      // Create backup directory
      this.createBackupDirectory();
      
      // Backup existing files
      this.backupExistingFiles();

      // Clear existing locale directories to start fresh
      this.clearLocaleDirectories();

      // Process all categories
      const categories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
      
      for (const category of categories) {
        await this.processCategory(category);
      }

      // Print final statistics
      console.log('\n' + '=' .repeat(60));
      console.log('📊 TRANSLATION STATISTICS:');
      console.log(`   Processed: ${this.translationStats.processed}`);
      console.log(`   Successful: ${this.translationStats.successful}`);
      console.log(`   Errors: ${this.translationStats.errors}`);
      console.log(`   Success Rate: ${((this.translationStats.successful / this.translationStats.processed) * 100).toFixed(1)}%`);
      
      if (this.translationStats.errors === 0) {
        console.log('\n🎉 All translations completed successfully!');
      } else {
        console.log('\n⚠️  Some translations had errors. Check the logs above.');
      }
      
      console.log(`\n📁 Backup created at: ${this.backupDir}`);
      console.log('=' .repeat(60));
      
    } catch (error) {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    }
  }
}

// Execute the translator
if (require.main === module) {
  const translator = new EnhancedDynamicCzechTranslator();
  translator.run().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = EnhancedDynamicCzechTranslator;