import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

/**
 * Language switcher component for changing application language
 * @returns {JSX.Element} LanguageSwitcher component
 */
function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage('en')}
        className={`lang-button ${i18n.language === 'en' ? 'active' : ''}`}
        aria-label="Switch to English"
      >
        <svg width="24" height="16" viewBox="0 0 60 30" className="flag-icon">
          <rect width="60" height="30" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6"/>
        </svg>
      </button>
      <button
        onClick={() => changeLanguage('cs')}
        className={`lang-button ${i18n.language === 'cs' ? 'active' : ''}`}
        aria-label="Switch to Czech"
      >
        <svg width="24" height="16" viewBox="0 0 60 40" className="flag-icon">
          <rect width="60" height="20" fill="#fff"/>
          <rect width="60" height="20" y="20" fill="#D7141A"/>
          <path d="M0,0 L30,20 L0,40 Z" fill="#11457E"/>
        </svg>
      </button>
    </div>
  );
}

export default LanguageSwitcher;