import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { Moon, Sun, Globe } from 'lucide-react';

export const ThemeLanguageToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className="flex items-center gap-4 p-2">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 group"
        title="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-gray-900" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-yellow-400" />
        )}
      </button>

      {/* Language Selector */}
      <div className="flex items-center gap-1">
        <Globe className="w-4 h-4 text-gray-700 dark:text-gray-200" />
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="px-2 py-1 rounded text-sm bg-transparent text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none"
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang === 'en' ? '🇬🇧 English' : lang === 'hi' ? '🇮🇳 हिन्दी' : lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
