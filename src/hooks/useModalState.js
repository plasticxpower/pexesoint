import { useState } from 'react';

/**
 * Custom hook for managing modal states
 * @returns {Object} Modal state and actions
 */
export function useModalState() {
  const [matchModal, setMatchModal] = useState(null);
  const [deckModal, setDeckModal] = useState(null);


  /**
   * Opens the deck modal for a specific player
   * @param {Object} player - The player object
   * @param {number} startIndex - Starting card index
   */
  const openDeckModal = (player, startIndex = 0) => {
    if (player.deck.length === 0) return;
    setDeckModal({ player, cards: player.deck, currentIndex: startIndex });
  };

  /**
   * Closes the deck modal
   */
  const closeDeckModal = () => {
    setDeckModal(null);
  };

  /**
   * Navigates to the next or previous card in deck modal
   * @param {string} direction - 'next' or 'prev'
   */
  const navigateDeckCard = (direction) => {
    if (!deckModal) return;
    
    const { cards, currentIndex } = deckModal;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % cards.length;
    } else {
      newIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    }
    
    setDeckModal({ ...deckModal, currentIndex: newIndex });
  };



  /**
   * Resets all modal states
   */
  const resetModals = () => {
    setMatchModal(null);
    setDeckModal(null);
  };

  return {
    // State
    matchModal,
    deckModal,
    
    // Actions
    setMatchModal,
    openDeckModal,
    closeDeckModal,
    navigateDeckCard,
    resetModals
  };
}