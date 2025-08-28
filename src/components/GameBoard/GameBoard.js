import React from 'react';
import { useTranslation } from 'react-i18next';
import PlayerInfo from '../PlayerInfo/PlayerInfo';
import GameCard from '../GameCard/GameCard';
import './GameBoard.css';

/**
 * Main game board component
 * @param {Object} props - Component props
 * @param {string} props.category - Current game category
 * @param {Array} props.players - Array of player objects
 * @param {number} props.currentPlayerIdx - Index of current player
 * @param {Array} props.cards - Array of game cards
 * @param {number} props.moves - Number of moves made
 * @param {boolean} props.loading - Loading state
 * @param {string} props.loadError - Error message if any
 * @param {Function} props.resetGame - Function to reset the game
 * @param {Function} props.handleCardClick - Function to handle card clicks
 * @param {Function} props.openDeckModal - Function to open deck modal
 * @returns {JSX.Element} GameBoard component
 */
function GameBoard({ 
  category, 
  players, 
  currentPlayerIdx, 
  cards, 
  moves, 
  loading, 
  loadError, 
  resetGame, 
  handleCardClick,
  openDeckModal 
}) {
  const { t: tGame } = useTranslation('game');
  const { t: tCommon } = useTranslation('common');
  const categoryLabel = tGame(`categories.${category}`);

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>{tGame('gameInterface.title', { category: categoryLabel })}</h1>
        <button 
          onClick={resetGame} 
          className="back-button"
          disabled={loading}
        >
          {tGame('gameInterface.backToMenu')}
        </button>
        <div className="moves-counter">{tGame('gameInterface.moves', { count: moves })}</div>
      </div>

      <PlayerInfo 
        players={players}
        currentPlayerIdx={currentPlayerIdx}
        openDeckModal={openDeckModal}
      />

      {loading && <div className="loading-message">{tGame('gameInterface.loadingImages')}</div>}
      {loadError && (
        <div className="error-message">
          {tCommon('errors.loadError')}
        </div>
      )}

      <div className="card-grid">
        {cards.map((card, idx) => (
          <GameCard
            key={card.key}
            card={card}
            index={idx}
            category={category}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;