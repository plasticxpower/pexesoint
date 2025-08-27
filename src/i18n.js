import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import csTranslation from './locales/cs/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  cs: {
    translation: csTranslation
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation is missing
    
    interpolation: {
      escapeValue: false // react already does escaping
    },
    
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;