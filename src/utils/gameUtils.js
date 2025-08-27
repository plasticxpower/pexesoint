import { ANIMAL_KEYWORDS } from '../constants/gameConstants';

/**
 * Removes HTML tags from a string
 * @param {string} input - The input string
 * @returns {string} - Clean string without HTML tags
 */
export function stripHtml(input) {
  if (!input) return '';
  return String(input).replace(/<[^>]*>/g, '').trim();
}

/**
 * Extracts common name from label based on category
 * @param {string} label - The label to extract from
 * @param {string} category - The category type
 * @returns {string} - Extracted common name
 */
export function extractCommonName(label, category) {
  const l = String(label || '').toLowerCase();
  const isAnimalCategory = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'].includes(category);
  
  if (isAnimalCategory) {
    for (const k of ANIMAL_KEYWORDS) {
      const key = k.toLowerCase().replace(/\s+/g, '');
      const compact = l.replace(/\s+/g, '');
      if (compact.includes(key)) return k.replace(/\s+/g, k.includes(' ') ? ' ' : '');
      if (l.includes(k.toLowerCase())) return k;
    }
  }
  
  const simple = l.replace(/[^a-z\s]/g, ' ').trim().split(/\s+/)[0] || 'Unknown';
  return simple.charAt(0).toUpperCase() + simple.slice(1);
}

/**
 * Gets facts for an animal based on common name and category
 * @param {string} commonName - The common name
 * @param {string} category - The category
 * @returns {Object} - Facts object
 */
export function getFacts(commonName, category) {
  const isAnimalCategory = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'].includes(category);
  
  if (isAnimalCategory) {
    return { 
      size: 'Size varies by species', 
      lifespan: 'Lifespan varies widely', 
      habitat: 'Found in diverse habitats worldwide', 
      fun: 'Many animals have unique adaptations to survive.' 
    };
  }
  
  return { 
    size: 'Unknown', 
    lifespan: 'Unknown', 
    habitat: 'Unknown', 
    fun: 'No information available.' 
  };
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}