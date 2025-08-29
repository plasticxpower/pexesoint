import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PAIRS } from '../constants/gameConstants';
import { stripHtml, extractCommonName, getFacts, shuffle } from '../utils/gameUtils';

/**
 * Custom hook for managing game state
 * @returns {Object} Game state and actions
 */
export function useGameState() {
  const { i18n } = useTranslation();
  const [category, setCategory] = useState(null);
  const [numPlayers, setNumPlayers] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  /**
   * Resets all game state to initial values
   */
  const resetGame = () => {
    setCategory(null);
    setNumPlayers(null);
    setPlayers([]);
    setCurrentPlayerIdx(0);
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLoading(false);
    setLoadError('');
  };

  /**
   * Starts a new game with the specified category
   * @param {string} cat - The category to start the game with
   */
  const startGame = async (cat) => {
    if (!numPlayers) {
      setLoadError('Please select number of players first.');
      return;
    }

    setCategory(cat);
    setLoading(true);
    setLoadError('');

    try {
      console.log('Starting game for category:', cat, 'PAIRS needed:', PAIRS);
      const animalCategories = ['mammals', 'birds', 'fish', 'reptiles', 'amphibians'];
      const currentLanguage = i18n.language || 'en';
      
      // Load from localized files
      let data;
      if (animalCategories.includes(cat)) {
        try {
          // Try to load localized data first
          console.log('Attempting to load localized data for', cat, 'in language', currentLanguage);
          const localizedUrl = `${process.env.PUBLIC_URL}/locales/${currentLanguage}/${cat}.json`;
          const res = await fetch(localizedUrl, { cache: 'no-store' });
          if (!res.ok) {
            throw new Error(`Failed to load localized data from ${localizedUrl}`);
          }
          data = await res.json();
          console.log('Successfully loaded localized data for', cat, 'in', currentLanguage);
        } catch (localizedError) {
          console.warn('Failed to load localized data, falling back to original:', localizedError);
          // Fallback to original data files
          const fileName = `${cat}_data.json`;
          const res = await fetch(`${process.env.PUBLIC_URL}/images/${fileName}`, { cache: 'no-store' });
          if (!res.ok) throw new Error(`Failed to load metadata for ${cat}`);
          data = await res.json();
          console.log('Loaded fallback data from', `/images/${fileName}`);
        }
      } else {
        // For non-animal categories, use original logic
        const fileName = `${cat}.json`;
        const res = await fetch(`${process.env.PUBLIC_URL}/images/${fileName}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load metadata for ${cat}`);
        data = await res.json();
      }
      console.log('Loaded data:', data);
      const images = Array.isArray(data.photos) ? data.photos : [];
      console.log('Images array:', images.length, 'items');
      
      if (images.length === 0) throw new Error(`No images found for ${cat}`);

      const selected = shuffle([...images]).slice(0, PAIRS);
      console.log('Selected images:', selected.length, 'items');
      const deck = shuffle(
        selected.flatMap((meta) => {
          const src = meta.localPath ? `${process.env.PUBLIC_URL}${meta.localPath}` : (meta.fileName ? `${process.env.PUBLIC_URL}/images-cropped/${cat}/${meta.fileName}` : '');
          const commonName = meta.commonName || meta.label || meta.originalTitle || cat;
          const scientificName = meta.scientificName || '';
          const label = scientificName 
            ? `${stripHtml(commonName)} (${scientificName})`
            : stripHtml(commonName);
          const facts = meta.size || meta.lifespan || meta.habitat || meta.funFact
            ? { size: meta.size || '', lifespan: meta.lifespan || '', habitat: meta.habitat || '', fun: meta.funFact || '' }
            : undefined;
          
          return [
            { key: `${src}-a`, src, label, commonName: stripHtml(commonName), scientificName, facts, flipped: false, matched: false, pairId: src },
            { key: `${src}-b`, src, label, commonName: stripHtml(commonName), scientificName, facts, flipped: false, matched: false, pairId: src },
          ];
        })
      );

      console.log('Final deck created:', deck.length, 'cards');
      console.log('Deck sample:', deck.slice(0, 2));
      console.log('=== SETTING CARDS STATE ===');
      console.log('About to set cards with category:', cat);
      setCards(deck);
      console.log('Cards state should be set to:', deck.length, 'items');
      console.log('Each card should have category prop as:', cat);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setCurrentPlayerIdx(0);
      setPlayers(
        Array.from({ length: numPlayers }).map((_, i) => ({
          id: i,
          name: `Player ${i + 1}`,
          score: 0,
          deck: [],
        }))
      );
    } catch (err) {
      console.error(err);
      setLoadError(err.message || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles card click logic
   * @param {number} idx - Index of the clicked card
   * @param {Function} setMatchModal - Function to set match modal state
   */
  const handleCardClick = (idx, setMatchModal) => {
    if (loading || flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;

    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) => (i === idx ? { ...card, flipped: true } : card));
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [i1, i2] = newFlipped;
      
      if (newCards[i1].pairId === newCards[i2].pairId) {
        // Match found
        setTimeout(() => {
          const pairId = newCards[i1].pairId;
          const cn = newCards[i1].commonName || extractCommonName(newCards[i1].label, category);
          const facts = newCards[i1].facts || getFacts(cn, category);
          setMatchModal({ src: newCards[i1].src, label: cn, scientificName: newCards[i1].scientificName, facts, pairId });
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === i1 || i === i2 ? { ...card, flipped: false } : card)));
          setFlipped([]);
          setCurrentPlayerIdx((idx) => (players.length ? (idx + 1) % players.length : 0));
        }, 900);
      }
    }
  };

  /**
   * Confirms a match and updates player score
   * @param {Object} matchModal - The match modal data
   * @param {Function} setMatchModal - Function to set match modal state
   */
  const confirmMatch = (matchModal, setMatchModal) => {
    if (!matchModal) return;
    
    const { pairId } = matchModal;
    setMatched((prev) => [...prev, pairId]);
    setPlayers((prevPlayers) => {
      const next = prevPlayers.map((p, idx) => {
        if (idx !== currentPlayerIdx) return p;
        const add = { 
          src: matchModal.src, 
          label: matchModal.label, 
          scientificName: matchModal.scientificName, 
          facts: matchModal.facts 
        };
        return { ...p, score: p.score + 1, deck: [...p.deck, add] };
      });
      return next;
    });
    setFlipped([]);
    setMatchModal(null);
  };

  // Effect to update matched cards
  useEffect(() => {
    if (matched.length > 0) {
      setCards((prev) => prev.map((card) => (matched.includes(card.pairId) ? { ...card, matched: true } : card)));
    }
  }, [matched]);

  // Effect to reload localized data when language changes (without restarting game)
  useEffect(() => {
    if (category && cards.length > 0) {
      console.log('Language changed to:', i18n.language, 'reloading localized data for category:', category);
      
      // Fetch new localized data
      fetch(`/locales/${i18n.language}/${category}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch localized data: ${response.status}`);
          }
          return response.json();
        })
        .then((localizedData) => {
           // Update existing cards with new localized data
           const photos = localizedData.photos || [];
           
           // Helper function to update card data
           const updateCardData = (card) => {
             // Extract filename from card.src path
             const srcParts = card.src.split('/');
             const fileName = srcParts[srcParts.length - 1];
             const animalData = photos.find(animal => animal.fileName === fileName);
             if (animalData) {
               const newCommonName = stripHtml(animalData.commonName);
               const newScientificName = animalData.scientificName;
               const newLabel = newScientificName 
                 ? `${newCommonName} (${newScientificName})`
                 : newCommonName;
               return {
                 ...card,
                 commonName: newCommonName,
                 scientificName: newScientificName,
                 label: newLabel,
                 facts: {
                   size: animalData.size,
                   lifespan: animalData.lifespan,
                   habitat: animalData.habitat,
                   fun: animalData.funFact
                 }
               };
             }
             return card;
           };
           
           // Update cards on the game board
           setCards((prevCards) => prevCards.map(updateCardData));
           
           // Update cards in player decks
           setPlayers((prevPlayers) => 
             prevPlayers.map((player) => ({
               ...player,
               deck: player.deck.map(updateCardData)
             }))
           );
        })
        .catch((error) => {
          console.warn('Failed to load localized data, keeping current data:', error);
        });
    }
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    category,
    numPlayers,
    players,
    currentPlayerIdx,
    cards,
    flipped,
    matched,
    moves,
    loading,
    loadError,
    
    // Actions
    setNumPlayers,
    resetGame,
    startGame,
    handleCardClick,
    confirmMatch
  };
}