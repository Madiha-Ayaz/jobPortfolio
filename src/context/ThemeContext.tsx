import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

type Theme = "dark" | "light";
type Language = "en" | "hi" | "ur";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface TranslationMap {
  [key: string]: Record<Language, string>;
}

// ────────────────────────────────────────────────
// Translations
// ────────────────────────────────────────────────

const translations: TranslationMap = {
  // ── Navigation ──────────────────────────────
  "nav.home": {
    en: "Home",
    hi: "होम",
    ur: "ہوم",
  },
  "nav.about": {
    en: "About",
    hi: "मेरे बारे में",
    ur: "میرے بارے میں",
  },
  "nav.projects": {
    en: "Projects",
    hi: "परियोजनाएँ",
    ur: "منصوبے",
  },
  "nav.contact": {
    en: "Contact",
    hi: "संपर्क",
    ur: "رابطہ",
  },
  "nav.blog": {
    en: "Blog",
    hi: "ब्लॉग",
    ur: "بلاگ",
  },

  // ── Hero ────────────────────────────────────
  "hero.title": {
    en: "Exploring the Cosmos, One Line of Code at a Time",
    hi: "ब्रह्मांड की खोज, एक कोड की पंक्ति एक बार में",
    ur: "کائنات کی تلاش، ایک کوڈ کی لائن ایک بار میں",
  },
  "hero.subtitle": {
    en: "Full-stack developer building experiences that are out of this world",
    hi: "पूर्ण-स्टैक डेवलपर जो दुनिया से बाहर अनुभव बनाता है",
    ur: "مکمل اسٹیک ڈویلپر جو دنیا سے باہر کے تجربات تخلیق کرتا ہے",
  },
  "hero.cta": {
    en: "View Projects",
    hi: "परियोजनाएँ देखें",
    ur: "منصوبے دیکھیں",
  },
  "hero.cta2": {
    en: "Contact Me",
    hi: "संपर्क करें",
    ur: "مجھ سے رابطہ کریں",
  },

  // ── Sections ────────────────────────────────
  "section.featured": {
    en: "Featured Projects",
    hi: "प्रमुख परियोजनाएँ",
    ur: "نمایاں منصوبے",
  },
  "section.earth": {
    en: "From Every Corner of the Earth",
    hi: "पृथ्वी के हर कोने से",
    ur: "زمین کے ہر کونے سے",
  },
  "section.ctaTitle": {
    en: "Ready to Launch Your Next Project?",
    hi: "अपना अगला प्रोजेक्ट लॉन्च करने के लिए तैयार हैं?",
    ur: "اپنا اگلا پروجیکٹ شروع کرنے کے لیے تیار ہیں؟",
  },
  "section.ctaBtn": {
    en: "Let's Build Together",
    hi: "चलिए एक साथ बनाते हैं",
    ur: "آئیے مل کر بنائیں",
  },

  // ── Footer / Misc ──────────────────────────
  "footer.copyright": {
    en: "© 2025 All rights reserved.",
    hi: "© 2025 सर्वाधिकार सुरक्षित।",
    ur: "© 2025 جملہ حقوق محفوظ ہیں۔",
  },
  "theme.toggle": {
    en: "Toggle Theme",
    hi: "थीम बदलें",
    ur: "تھیم تبدیل کریں",
  },
  "language.select": {
    en: "Language",
    hi: "भाषा",
    ur: "زبان",
  },
};

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
  }
  return "dark";
}

function getInitialLanguage(): Language {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("portfolio-lang") as Language | null;
    if (stored === "en" || stored === "hi" || stored === "ur") return stored;
  }
  return "en";
}

// ────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // ── Persist theme ──────────────────────────
  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  // ── Persist language ───────────────────────
  useEffect(() => {
    localStorage.setItem("portfolio-lang", language);
    const htmlLang = language === "en" ? "en" : language === "hi" ? "hi" : "ur";
    document.documentElement.setAttribute("lang", htmlLang);
  }, [language]);

  // ── Actions ────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // ── Translation function ───────────────────
  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) {
        console.warn(`[ThemeContext] Missing translation key: "${key}"`);
        return key;
      }
      return entry[language] ?? key;
    },
    [language],
  );

  // ── Memoised context value ─────────────────
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme, language, setLanguage, t }),
    [theme, toggleTheme, language, setLanguage, t],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return context;
}
