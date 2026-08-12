import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('portfolio-language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
