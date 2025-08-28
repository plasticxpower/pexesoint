import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Import UI translation files
import enCommon from './locales/en/common.json';
import enGame from './locales/en/game.json';
import enUI from './locales/en/ui.json';
import csCommon from './locales/cs/common.json';
import csGame from './locales/cs/game.json';
import csUI from './locales/cs/ui.json';

const resources = {
  en: {
    common: enCommon,
    game: enGame,
    ui: enUI
  },
  cs: {
    common: csCommon,
    game: csGame,
    ui: csUI
  }
};

i18n
  .use(Backend) // for loading content translations from public/locales
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources, // UI translations loaded directly
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation is missing
    
    // Default namespace for UI translations
    defaultNS: 'common',
    ns: ['common', 'game', 'ui'],
    
    // Backend configuration for content translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      allowMultiLoading: false
    },
    
    interpolation: {
      escapeValue: false // react already does escaping
    },
    
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;