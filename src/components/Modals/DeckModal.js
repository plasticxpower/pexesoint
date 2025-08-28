import React from 'react';
import { useTranslation } from 'react-i18next';
import './Modal.css';

/**
 * Modal component for displaying player deck cards
 * @param {Object} props - Component props
 * @param {Object|null} props.deckModal - Deck modal data
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onNavigate - Function to navigate between cards
 * @returns {JSX.Element|null} DeckModal component
 */
function DeckModal({ deckModal, onClose, onNavigate }) {
  const { t } = useTranslation('ui');
  
  if (!deckModal) return null;

  const currentCard = deckModal.cards[deckModal.currentIndex];
  const hasMultipleCards = deckModal.cards.length > 1;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content deck-modal">
        <div className="modal-image">
          <img src={currentCard.src} alt={currentCard.label} />
        </div>
        <div className="modal-body">
          <h3>{t('deckModal.playerDeck', { player: deckModal.player.name })}</h3>
           <h4>{currentCard.scientificName || currentCard.label}</h4>
          <ul className="modal-facts">
            <li><strong>{t('modal.size')}:</strong> {currentCard.facts?.size || 'N/A'}</li>
            <li><strong>{t('modal.lifespan')}:</strong> {currentCard.facts?.lifespan || 'N/A'}</li>
            <li><strong>{t('modal.habitat')}:</strong> {currentCard.facts?.habitat || 'N/A'}</li>
            <li><strong>{t('modal.funFact')}:</strong> {currentCard.facts?.fun || 'N/A'}</li>
          </ul>
          
          {hasMultipleCards && (
            <div className="deck-navigation">
              <span>
                {t('deckModal.cardCounter', { current: deckModal.currentIndex + 1, total: deckModal.cards.length })}
              </span>
            </div>
          )}
          
          <div className="modal-actions">
            {hasMultipleCards && (
              <>
                <button 
                  onClick={() => onNavigate('prev')}
                  className="nav-button"
                >
                  {t('deckModal.previousCard')}
                </button>
                <button 
                  onClick={() => onNavigate('next')}
                  className="nav-button"
                >
                  {t('deckModal.nextCard')}
                </button>
              </>
            )}
            <button onClick={onClose} className="close-button">
              {t('modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckModal;