import React from 'react';
import { useTranslation } from 'react-i18next';
import './Modal.css';

/**
 * Modal component for displaying match information
 * @param {Object} props - Component props
 * @param {Object|null} props.matchModal - Match modal data
 * @param {Function} props.onConfirm - Function to confirm the match
 * @returns {JSX.Element|null} MatchModal component
 */
function MatchModal({ matchModal, onConfirm }) {
  const { t } = useTranslation();
  
  if (!matchModal) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-image">
          <img src={matchModal.src} alt={matchModal.label} />
        </div>
        <div className="modal-body">
            <h3>{matchModal.scientificName || matchModal.label}</h3>
          <ul className="modal-facts">
            <li><strong>{t('modal.size')}:</strong> {matchModal.facts.size}</li>
            <li><strong>{t('modal.lifespan')}:</strong> {matchModal.facts.lifespan}</li>
            <li><strong>{t('modal.habitat')}:</strong> {matchModal.facts.habitat}</li>
            <li><strong>{t('modal.funFact')}:</strong> {matchModal.facts.fun}</li>
          </ul>
          <div className="modal-actions">
            <button onClick={onConfirm} className="confirm-button">
              {t('modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;