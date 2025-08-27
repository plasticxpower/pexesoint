import React from 'react';
import './GameCard.css';

/**
 * Individual game card component
 * @param {Object} props - Component props
 * @param {Object} props.card - Card object with src, label, flipped, matched properties
 * @param {number} props.index - Card index
 * @param {string} props.category - Game category for card back styling
 * @param {Function} props.onClick - Click handler function
 * @returns {JSX.Element} GameCard component
 */
function GameCard({ card, index, category, onClick }) {
  console.log('=== GameCard RENDER ===');
  console.log('Card:', card);
  console.log('Index:', index);
  console.log('Category:', category);
  console.log('onClick:', typeof onClick);
  

  
  if (!card) {
    console.log('No card provided - returning null');
    return null;
  }

  const isFlipped = card.flipped || card.matched;
  const cardClass = `game-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`;
  console.log('Card class:', cardClass);
  console.log('Is flipped:', isFlipped);
  
  const getCardFrontStyle = () => {
    console.log('Getting card FRONT style for category:', category);
    
    if (!category) {
      console.log('No category - using brown fallback for FRONT');
      return {
        backgroundColor: '#8B4513'
      };
    }
    
    const svgUrl = `/card-backs/${category}.svg`;
    console.log('SVG URL for FRONT:', svgUrl);
    
    const style = {
      backgroundImage: `url(${svgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#8B4513' // Brown fallback
    };
    
    console.log('Card FRONT style:', style);
    return style;
  };

  const getCardBackStyle = () => {
    console.log('Getting card BACK style (for flipped cards)');
    return {
      backgroundColor: 'transparent'
    };
  };



  return (
    <div
      className={`game-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Card ${index + 1}${card.flipped ? `: ${card.scientificName || card.label}` : ''}`}
    >
      <div className="card-inner">
        <div className="card-front" style={getCardFrontStyle()}>
        </div>
        <div className="card-back" style={getCardBackStyle()}>
          <img src={card.src} alt={card.scientificName || card.label} />
        </div>
      </div>
    </div>
  );
}

export default GameCard;