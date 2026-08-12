import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      localStorage.setItem('portfolio-language', lng);
    },
    [i18n]
  );

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    availableLanguages: i18n.options.resources
      ? Object.keys(i18n.options.resources)
      : ['en', 'hi'],
  };
};
