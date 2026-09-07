import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import ThemeSelector from './ThemeSelector';
import { Globe } from 'lucide-react';

export const ThemeLanguageToggle = () => {
  const { theme, setTheme, language, setLanguage } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1">
      <ThemeSelector />

      {/* Language Selector */}
      <div className="flex items-center gap-1">
        <Globe size={16} style={{ color: 'var(--text-muted)' }} />
        <select
          value={language}
          onChange={(e) => {
            const value = e.target.value as 'en' | 'hi' | 'ur';
            if (value === 'en' || value === 'hi' || value === 'ur') setLanguage(value);
          }}
          aria-label="Change language"
          className="px-2 py-1 rounded text-sm bg-transparent focus:outline-none border"
          style={{
            color: 'var(--text-body)',
            borderColor: 'var(--border-default)',
          }}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ur">اردو</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeLanguageToggle;