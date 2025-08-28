import React from 'react';
import { useTranslation } from 'react-i18next';
import { PLAYER_OPTIONS } from '../../constants/gameConstants';
import './PlayerSelection.css';

/**
 * Component for selecting the number of players
 * @param {Object} props - Component props
 * @param {number|null} props.numPlayers - Currently selected number of players
 * @param {Function} props.setNumPlayers - Function to set number of players
 * @returns {JSX.Element} PlayerSelection component
 */
function PlayerSelection({ numPlayers, setNumPlayers }) {
  const { t } = useTranslation('game');
  
  return (
    <div className="setup-section">
      <h2>{t('mainMenu.step1')}</h2>
      <div className="player-selection">
        <label htmlFor="players-select">{t('mainMenu.numberOfPlayers')}</label>
        <select
          id="players-select"
          value={numPlayers || ''}
          onChange={(e) => setNumPlayers(Number(e.target.value))}
          className="player-select"
        >
          <option value="" disabled>
            {t('mainMenu.chooseNumberOfPlayers')}
          </option>
          {PLAYER_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} {n > 1 ? t('mainMenu.players') : t('mainMenu.player')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default PlayerSelection;