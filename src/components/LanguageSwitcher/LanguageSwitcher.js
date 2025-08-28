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
        {t('languageSelector.english')}
      </button>
      <button
        onClick={() => changeLanguage('cs')}
        className={`lang-button ${i18n.language === 'cs' ? 'active' : ''}`}
        aria-label="Switch to Czech"
      >
        {t('languageSelector.czech')}
      </button>
    </div>
  );
}

export default LanguageSwitcher;