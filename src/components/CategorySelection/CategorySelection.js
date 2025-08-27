import React from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../../constants/gameConstants';
import './CategorySelection.css';

/**
 * Component for selecting game category
 * @param {Object} props - Component props
 * @param {number|null} props.numPlayers - Number of players selected
 * @param {Function} props.startGame - Function to start the game
 * @returns {JSX.Element} CategorySelection component
 */
function CategorySelection({ numPlayers, startGame }) {
  const { t } = useTranslation();
  
  return (
    <div className="setup-section">
      <h2>{t('mainMenu.step2')}</h2>
      {!numPlayers && (
        <p className="instruction-text">{t('mainMenu.selectPlayersFirst')}</p>
      )}
      <div className="menu">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.key} 
            onClick={() => startGame(cat.key)} 
            disabled={!numPlayers}
            className={`category-button ${!numPlayers ? 'disabled' : ''}`}
          >
            <div className="category-content">
              <img 
                src={`${process.env.PUBLIC_URL}/card-backs/${cat.key}.svg`} 
                alt={t(`categories.${cat.key}`)} 
                className="category-icon"
              />
              <span className="category-label">{t(`categories.${cat.key}`)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelection;