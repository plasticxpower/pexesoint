import React from 'react';
import { useTranslation } from 'react-i18next';
import './PlayerInfo.css';

/**
 * Component to display player information and their decks
 * @param {Object} props - Component props
 * @param {Array} props.players - Array of player objects
 * @param {number} props.currentPlayerIdx - Index of current player
 * @param {Function} props.openDeckModal - Function to open deck modal
 * @returns {JSX.Element} PlayerInfo component
 */
function PlayerInfo({ players, currentPlayerIdx, openDeckModal }) {
  const { t } = useTranslation();
  
  return (
    <div className="players-container">
      {players.map((player, idx) => (
        <div 
          key={player.id} 
          className={`player-info ${idx === currentPlayerIdx ? 'active' : ''}`}
        >
          <div className="player-header">
            <strong>{player.name}</strong> — {player.score} {t('gameInterface.pts')}
            {idx === currentPlayerIdx && (
              <span className="player-turn"> • {t('gameInterface.currentPlayer')}</span>
            )}
          </div>
          
          <div className="player-deck">
            {player.deck.map((card, cardIdx) => (
              <div 
                key={`${player.id}-${cardIdx}`} 
                className="player-card" 
                title={`${t('gameInterface.viewDeck')} ${card.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  openDeckModal(player, cardIdx);
                }}
              >
                <img src={card.src} alt={card.label} />
              </div>
            ))}
            
            {player.deck.length === 0 && (
              <div className="empty-deck">{t('modal.deck')}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlayerInfo;