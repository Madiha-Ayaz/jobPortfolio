import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { AppTheme, isAppTheme, DEFAULT_THEME } from "@/lib/themes";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

type Language = "en" | "hi" | "ur";

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
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
  "nav.home": { en: "Home", hi: "होम", ur: "ہوم" },
  "nav.about": { en: "About", hi: "मेरे बारे में", ur: "میرے بارے میں" },
  "nav.projects": { en: "Projects", hi: "परियोजनाएँ", ur: "منصوبے" },
  "nav.contact": { en: "Contact", hi: "संपर्क", ur: "رابطہ" },
  "nav.blog": { en: "Blog", hi: "ब्लॉग", ur: "بلاگ" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", ur: "ڈیش بورڈ" },
  "nav.login": { en: "Login", hi: "लॉगिन", ur: "لاگ ان" },
  "nav.logout": { en: "Logout", hi: "लॉगआउट", ur: "لاگ آؤٹ" },
  "nav.search": { en: "Search projects...", hi: "प्रोजेक्ट खोजें...", ur: "پروجیکٹ تلاش کریں..." },

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
  "hero.cta": { en: "View Projects", hi: "परियोजनाएँ देखें", ur: "منصوبے دیکھیں" },
  "hero.cta2": { en: "Contact Me", hi: "संपर्क करें", ur: "مجھ سے رابطہ کریں" },
  "hero.badge": { en: "Madiha Ayaz — Digital Portfolio", hi: "मदिहा अयाज़ — डिजिटल पोर्टफोलियो", ur: "مدیحہ ایاز — ڈیجیٹل پورٹ فولیو" },
  "hero.imA": { en: "I'm a", hi: "मैं हूँ", ur: "میں ہوں" },
  "hero.roleFrontend": { en: "Frontend Developer", hi: "फ्रंटएंड डेवलपर", ur: "فرنٹ اینڈ ڈویلپر" },
  "hero.roleAI": { en: "AI Enthusiast", hi: "AI उत्साही", ur: "AI شوقین" },
  "hero.role3D": { en: "3D Builder", hi: "3D निर्माता", ur: "3D بنانے والا" },
  "hero.blurb": {
    en: "I craft intelligent, immersive experiences — connecting people, systems and ideas through modern frontend engineering and AI.",
    hi: "मैं बुद्धिमान, इमर्सिव अनुभव बनाता हूँ — आधुनिक फ्रंटएंड इंजीनियरिंग और AI के माध्यम से लोगों, सिस्टम और विचारों को जोड़ता हूँ।",
    ur: "میں ذہین، عمیق تجربات تخلیق کرتا ہوں — جدید فرنٹ اینڈ انجینئرنگ اور AI کے ذریعے لوگوں، سسٹمز اور خیالات کو جوڑتا ہوں۔",
  },
  "hero.explore": { en: "Explore Projects", hi: "परियोजनाएँ देखें", ur: "منصوبے دیکھیں" },
  "hero.contact": { en: "Get in Touch", hi: "संपर्क में रहें", ur: "رابطہ کریں" },
  "hero.scroll": { en: "Scroll", hi: "स्क्रॉल", ur: "سکرول" },
  "card.view": { en: "View", hi: "देखें", ur: "دیکھیں" },

  "home.statsProjects": { en: "Projects Built", hi: "निर्मित परियोजनाएँ", ur: "بنائے گئے پروجیکٹس" },
  "home.statsTech": { en: "Technologies", hi: "प्रौद्योगिकियाँ", ur: "ٹیکنالوجیز" },
  "home.statsScenes": { en: "Immersive Scenes", hi: "इमर्सिव दृश्य", ur: "عمیق مناظر" },
  "home.statsCuriosity": { en: "Curiosity Driven", hi: "जिज्ञासा प्रेरित", ur: "تجسس سے کارفرما" },

  "feat.eyebrow": { en: "Featured Work", hi: "चुनिंदा कार्य", ur: "نمایاں کام" },
  "feat.title": { en: "Selected Projects", hi: "चयनित परियोजनाएँ", ur: "منتخب منصوبے" },
  "feat.sub": {
    en: "A curated set of products — explore the cards to feel the depth.",
    hi: "चुनिंदा उत्पादों का संग्रह — गहराई को महसूस करने के लिए कार्ड देखें।",
    ur: "منتخب مصنوعات کا ایک مجموعہ — گہرائی کو محسوس کرنے کے لیے کارڈز دیکھیں۔",
  },
  "net.eyebrow": { en: "Global · Connected · Live", hi: "वैश्विक · जुड़ा · लाइव", ur: "عالمی · منسلک · لائیو" },
  "net.title": { en: "One Network, Everywhere", hi: "एक नेटवर्क, हर जगह", ur: "ایک نیٹ ورک، ہر جگہ" },
  "net.sub": {
    en: "An interactive 3D visualization of people, systems and data flowing around the globe — every node a connection, every thread a story.",
    hi: "दुनिया भर में बहने वाले लोगों, सिस्टम और डेटा का इंटरैक्टिव 3D विज़ुअलाइज़ेशन — हर नोड एक कनेक्शन, हर धागा एक कहानी।",
    ur: "دنیا بھر میں بہتے لوگوں، سسٹمز اور ڈیٹا کی انٹرایکٹو 3D بصری نمائندگی — ہر نوڈ ایک ربط، ہر دھاگہ ایک کہانی۔",
  },
  "ain.eyebrow": { en: "AI × Human × Earth", hi: "AI × मानव × पृथ्वी", ur: "AI × انسان × زمین" },
  "ain.title": { en: "The AI Data Network", hi: "AI डेटा नेटवर्क", ur: "AI ڈیٹا نیٹ ورک" },
  "ain.sub": {
    en: "A living constellation of AI, humans and Earth — orbiting nodes pulse with live data, each connection a glowing thread in a digital network.",
    hi: "AI, मानव और पृथ्वी का जीवंत नक्षत्र — परिक्रमा करने वाले नोड लाइव डेटा से स्पंदित होते हैं, हर कनेक्शन एक चमकता धागा।",
    ur: "AI، انسانی اور زمین کا زندہ برج — گردش کرتے نوڈس لائیو ڈیٹا سے دھڑکتے ہیں، ہر ربط ایک چمکتا دھاگہ۔",
  },
  "earth.eyebrow": { en: "Our Planet · Animated", hi: "हमारा ग्रह · एनिमेटेड", ur: "ہمارا سیارہ · متحرک" },
  "earth.title": { en: "One Planet, Endless Orbit", hi: "एक ग्रह, अनंत कक्षा", ur: "ایک سیارہ، لامحدود مدار" },
  "earth.sub": {
    en: "A pure-CSS spinning Earth — a quiet, continuous reminder that everything revolves and renews.",
    hi: "विशुद्ध CSS से घूमती पृथ्वी — एक शांत, निरंतर याद दिलाना कि सब कुछ घूमता और नवीनीकृत होता है।",
    ur: "خالص CSS سے گھومتی زمین — خاموش، مسلسل یاد دہانی کہ ہر چیز گردش کرتی اور نئی ہوتی ہے۔",
  },

  "section.featured": {
    en: "Featured Projects",
    hi: "प्रमुख परियोजनाएँ",
    ur: "نمایاں منصوبے",
  },
  "section.ctaTitle": {
    en: "Let's build something great",
    hi: "चलिए कुछ बेहतरीन बनाते हैं",
    ur: "آئیے کچھ عمدہ بنائیں",
  },
  "section.ctaSub": {
    en: "I'm available for frontend engineering, AI-powered products and immersive 3D experiences.",
    hi: "मैं फ्रंटएंड इंजीनियरिंग, AI-संचालित उत्पादों और इमर्सिव 3D अनुभवों के लिए उपलब्ध हूँ।",
    ur: "میں فرنٹ اینڈ انجینئرنگ، AI سے چلنے والی مصنوعات اور عمیق 3D تجربات کے لیے دستیاب ہوں۔",
  },
  "section.ctaBtn": {
    en: "Let's Work Together",
    hi: "चलिए साथ काम करते हैं",
    ur: "آئیے مل کر کام کریں",
  },

  "footer.copyright": {
    en: "All rights reserved.",
    hi: "सर्वाधिकार सुरक्षित।",
    ur: "جملہ حقوق محفوظ ہیں۔",
  },
  "footer.tagline": { en: "Frontend Developer • AI Enthusiast", hi: "फ्रंटएंड डेवलपर • AI उत्साही", ur: "فرنٹ اینڈ ڈویلپر • AI شوقین" },
  "footer.builtWith": { en: "Built with React, Three.js & precision", hi: "React, Three.js और सटीकता के साथ निर्मित", ur: "React، Three.js اور درستگی کے ساتھ بنایا گیا" },
  "theme.toggle": { en: "Toggle Theme", hi: "थीम बदलें", ur: "تھیم تبدیل کریں" },
  "language.select": { en: "Language", hi: "भाषा", ur: "زبان" },

  // ── Projects page ───────────────────────────────────────────
  "projects.badge": { en: "Mission Control", hi: "मिशन नियंत्रण", ur: "مشن کنٹرول" },
  "projects.title": { en: "My Projects", hi: "मेरे परियोजनाएँ", ur: "میرے منصوبے" },
  "projects.subtitle": {
    en: "A curated collection of products I've designed and engineered — from AI-powered tools to immersive 3D experiences.",
    hi: "मेरे द्वारा डिज़ाइन और इंजीनियर किए गए उत्पादों का संग्रह — AI-संचालित टूल से लेकर 3D अनुभवों तक।",
    ur: "میرے ڈیزائن کردہ مصنوعات کا ایک منتخب مجموعہ — AI سے چلنے والے ٹولز سے لے کر عمیق 3D تجربات تک۔",
  },
  "projects.statProjects": { en: "Projects", hi: "परियोजनाएँ", ur: "منصوبے" },
  "projects.statTech": { en: "Technologies", hi: "प्रौद्योगिकियाँ", ur: "ٹیکنالوجیز" },
  "projects.statDemos": { en: "Live Demos", hi: "लाइव डेमो", ur: "لائیو ڈیمو" },
  "projects.allTitle": { en: "All Projects", hi: "सभी परियोजनाएँ", ur: "تمام منصوبے" },
  "projects.allSub": {
    en: "Browse every project · Live demos & source code included",
    hi: "हर प्रोजेक्ट देखें · लाइव डेमो और सोर्स कोड शामिल",
    ur: "ہر پروجیکٹ دیکھیں · لائیو ڈیمو اور سورس کوڈ شامل ہیں",
  },
  "projects.live": { en: "Live Demo", hi: "लाइव डेमो", ur: "لائیو ڈیمو" },
  "projects.github": { en: "GitHub", hi: "गिटहब", ur: "گٹ ہب" },
  "projects.ctaTitle": { en: "Have a project in mind?", hi: "कोई प्रोजेक्ट विचार में है?", ur: "کیا آپ کے ذہن میں کوئی پروجیکٹ ہے؟" },
  "projects.ctaSub": { en: "Let's build something great together.", hi: "चलिए कुछ बेहतरीन मिलकर बनाते हैं।", ur: "آئیے مل کر کچھ عمدہ بنائیں۔" },
  "projects.ctaBtn": { en: "Get in Touch", hi: "संपर्क में रहें", ur: "رابطہ کریں" },
  "projects.healthPrefix": { en: "Content health", hi: "कंटेंट स्वास्थ्य", ur: "مواد کی صحت" },
  "projects.improvement": { en: "improvement", hi: "सुधार", ur: "بہتری" },
  "projects.improvements": { en: "improvements", hi: "सुधार", ur: "بہتریاں" },
  "projects.detected": { en: "detected", hi: "मिला", ur: "ملی" },
  "projects.healthTip": {
    en: "Ask me to polish the descriptions, add live demo links or fill in missing tags",
    hi: "मुझसे विवरण सुधारने, लाइव डेमो लिंक जोड़ने या टैग भरने के लिए कहें",
    ur: "میرے ذریعے تفصیل بہتر کریں، لائیو ڈیمو لنک یا ٹیگز شامل کریں",
  },
  "projects.fixWithAI": { en: "Fix with AI", hi: "AI से सुधारें", ur: "AI سے درست کریں" },

  // ── Blog page ───────────────────────────────────────────────
  "blog.badge": { en: "Articles & Insights", hi: "लेख और अंतर्दृष्टि", ur: "مضامین اور بصیرتیں" },
  "blog.title": { en: "From the Blog", hi: "ब्लॉग से", ur: "بلاگ سے" },
  "blog.subtitle": {
    en: "Thoughts on web development, technology, and creative coding.",
    hi: "वेब विकास, तकनीक और क्रिएटिव कोडिंग पर विचार।",
    ur: "ویب ڈیولپمنٹ، ٹیکنالوجی اور تخلیقی کوڈنگ پر خیالات۔",
  },
  "blog.statArticles": { en: "Articles", hi: "लेख", ur: "مضامین" },
  "blog.statTopics": { en: "Topics", hi: "विषय", ur: "موضوعات" },
  "blog.statMinutes": { en: "Min to read all", hi: "सब पढ़ने में मिनट", ur: "سب پڑھنے کے منٹ" },
  "blog.all": { en: "All", hi: "सभी", ur: "سب" },
  "blog.minRead": { en: "min read", hi: "मिन पढ़ें", ur: "منٹ پڑھیں" },
  "blog.featured": { en: "Featured", hi: "प्रमुख", ur: "نمایاں" },
  "blog.readMore": { en: "Read More", hi: "और पढ़ें", ur: "مزید پڑھیں" },
  "blog.readFull": { en: "Read the full article", hi: "पूरा लेख पढ़ें", ur: "پورا مضمون پڑھیں" },
  "blog.emptyTitle": { en: "No articles match", hi: "कोई लेख नहीं मिला", ur: "کوئی مضمون نہیں ملا" },
  "blog.emptySub": { en: "Try a different topic or clear your search.", hi: "कोई और विषय आज़माएँ या खोज हटाएँ।", ur: "کوئی اور موضوع آزمائیں یا تلاش صاف کریں۔" },
  "blog.ctaTitle": { en: "Want to publish an article?", hi: "लेख प्रकाशित करना चाहते हैं?", ur: "مضمون شائع کرنا چاہتے ہیں؟" },
  "blog.ctaSub": {
    en: "Ask Nova to draft or polish a post right from your dashboard.",
    hi: "अपने डैशबोर्ड से ही Nova से लेख लिखने या सुधारने के लिए कहें।",
    ur: "اپنے ڈیش بورڈ سے ہی نووا سے مضمون لکھنے یا بہتر کرنے کے لیے کہیں۔",
  },
  "blog.openDashboard": { en: "Open Dashboard", hi: "डैशबोर्ड खोलें", ur: "ڈیش بورڈ کھولیں" },
  "blog.quoteBadge": { en: "Wisdom", hi: "प्रेरणा", ur: "حکمت" },
  "blog.quoteTitle": { en: "Words that inspire the work", hi: "वे शब्द जो काम को प्रेरित करते हैं", ur: "ایسے الفاظ جو کام کو متاثر کرتے ہیں" },
  "blog.quoteSub": {
    en: "Timeless thinking from the minds behind science, software and ideas.",
    hi: "विज्ञान, सॉफ़्टवेयर और विचारों के पीछे के दिमाग़ों से बेजोड़ सोच।",
    ur: "سائنس، سافٹ ویئر اور نظریات کے پیچھے موجود ذہنوں کی لازوال سوچ۔",
  },

  // ── Blog post page ──────────────────────────────────────────
  "post.back": { en: "Back to Blog", hi: "ब्लॉग पर वापस", ur: "بلاگ پر واپس" },
  "post.by": { en: "By", hi: "द्वारा", ur: "از" },
  "post.notFoundTitle": { en: "Post not found", hi: "लेख नहीं मिला", ur: "مضمون نہیں ملا" },
  "post.notFoundSub": {
    en: "The article you're looking for doesn't exist or was removed.",
    hi: "जिस लेख की आप तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
    ur: "جس مضمون کی آپ تلاش کر رہے ہیں وہ موجود نہیں یا ہٹا دیا گیا ہے۔",
  },
  "post.polishTitle": {
    en: "Want a tighter intro, better tags, or a stronger conclusion?",
    hi: "बेहतर परिचय, बेहतर टैग, या मज़बूत निष्कर्ष चाहते हैं?",
    ur: "بہتر تعارف، بہتر ٹیگز، یا مضبوط نتیجہ چاہتے ہیں؟",
  },
  "post.polishBtn": { en: "Ask Nova to polish this article", hi: "लेख सुधारने के लिए Nova से पूछें", ur: "مضمون بہتر کرنے کے لیے نووا سے پوچھیں" },
  "post.keepReading": { en: "Keep reading", hi: "पढ़ना जारी रखें", ur: "پڑھنا جاری رکھیں" },
  "post.assistantTitle": {
    en: "Ask the Article",
    hi: "लेख से पूछें",
    ur: "مضمون سے پوچھیں",
  },
  "post.assistantSub": {
    en: "Nova has read this article. Ask anything about it and get a grounded answer.",
    hi: "Nova ने यह लेख पढ़ लिया है। इसके बारे में कुछ भी पूछें और सटीक उत्तर पाएँ।",
    ur: "نووا نے یہ مضمون پڑھ لیا ہے۔ اس کے بارے میں کچھ بھی پوچھیں اور بنیاد پر جواب پائیں۔",
  },
  "post.askExplain": { en: "What does this mean in simple words?", hi: "इसका सीधे शब्दों में क्या मतलब है?", ur: "اس کا سادہ الفاظ میں کیا مطلب ہے؟" },
  "post.askSimple": { en: "Explain this article in 3 sentences", hi: "इस लेख को 3 वाक्यों में समझाएँ", ur: "اس مضمون کو 3 جملوں میں سمجھائیں" },
  "post.askExample": { en: "Give me a real-world example", hi: "मुझे एक वास्तविक उदाहरण दें", ur: "مجھے ایک حقیقی مثال دیں" },
  "post.askSummary": { en: "Summarize this article", hi: "इस लेख का सार बताएँ", ur: "اس مضمون کا خلاصہ دیں" },
  "post.assistantPlaceholder": { en: "Ask about this article...", hi: "इस लेख के बारे में पूछें...", ur: "اس مضمون کے بارے میں پوچھیں..." },
  "post.assistantSend": { en: "Ask", hi: "पूछें", ur: "پوچھیں" },
  "post.assistantThinking": { en: "Reading the article...", hi: "लेख पढ़ रहा है...", ur: "مضمون پڑھ رہا ہے..." },
  "post.assistantOffline": {
    en: "AI mode is off (no API key configured), so here is the article excerpt instead.",
    hi: "AI मोड बंद है (कोई API कुंजी नहीं), इसलिए यहाँ लेख का सारांश है।",
    ur: "AI موڈ بند ہے (کوئی API کلید نہیں)، اس لیے یہاں مضمون کا اقتباس ہے۔",
  },
  "post.prevArticle": { en: "Previous article", hi: "पिछला लेख", ur: "پچھلا مضمون" },
  "post.nextArticle": { en: "Next article", hi: "अगला लेख", ur: "اگلا مضمون" },

  // ── Contact page ────────────────────────────────────────────
  "contact.badge": { en: "Get In Touch", hi: "संपर्क में रहें", ur: "رابطہ کریں" },
  "contact.title": { en: "Contact Me", hi: "मुझसे संपर्क करें", ur: "مجھ سے رابطہ کریں" },
  "contact.subtitle": {
    en: "Have a project inquiry or want to discuss opportunities? I'd be happy to hear from you. Let's connect and explore possibilities.",
    hi: "प्रोजेक्ट पूछताछ या अवसरों पर चर्चा करना चाहते हैं? आपकी बात सुनकर मुझे खुशी होगी। आइए जुड़ें और संभावनाएँ तलाशें।",
    ur: "پراجیکٹ کے بارے میں استفسار یا مواقع پر بات کرنا چاہتے ہیں؟ مجھے آپ کی بات سن کر خوشی ہوگی۔ آئیے جڑیں اور امکانات تلاش کریں۔",
  },
  "contact.send": { en: "Send Your Message", hi: "अपना संदेश भेजें", ur: "اپنا پیغام بھیجیں" },
  "contact.secure": { en: "Your message is secure and confidential", hi: "आपका संदेश सुरक्षित और गोपनीय है", ur: "آپ کا پیغام محفوظ اور خفیہ ہے" },
  "contact.otherWays": { en: "Looking for other ways to connect?", hi: "जुड़ने के अन्य तरीके ढूंढ रहे हैं?", ur: "جلنے کے اور طریقے تلاش کر رہے ہیں؟" },
  "contact.socials": { en: "Check out my social profiles", hi: "मेरे सोशल प्रोफाइल देखें", ur: "میرے سوشل پروفائلز دیکھیں" },
  "contact.formStatusSubmitting": { en: "Submitting...", hi: "भेजा जा रहा है...", ur: "بھیجا جا رہا ہے..." },
  "contact.subscribeBadge": { en: "Stay In Orbit", hi: "कक्षा में बने रहें", ur: "مدار میں رہیں" },
  "contact.subscribeTitle": { en: "Join the Signal", hi: "सिग्नल से जुड़ें", ur: "سگنل سے جڑیں" },
  "contact.subscribeSub": {
    en: "Drag the little explorer, drop an email, and let updates travel faster than light.",
    hi: "छोटे खोजकर्ता को खींचें, ईमेल डालें, और अपडेट को प्रकाश से तेज़ पाएँ।",
    ur: "چھوٹے ایکسپلورر کو گھسیٹیں، ای میل درج کریں، اور اپ ڈیٹس کو روشنی سے تیز پائیں۔",
  },
  "contact.subscribePlaceholder": { en: "Enter email", hi: "ईमेल दर्ज करें", ur: "ای میل درج کریں" },
  "contact.subscribeBtn": { en: "Subscribe", hi: "सदस्यता लें", ur: "سبسکرائب کریں" },
  "contact.subscribeError": { en: "Oops! Email, please!", hi: "अरे! ईमेल चाहिए!", ur: "افسوس! ای میل درج کریں!" },
  "contact.subscribeSuccess": { en: "Subscribed · You're in the orbit", hi: "सदस्यता ली गई · आप कक्षा में हैं", ur: "سبسکرائب ہوگیا · آپ مدار میں ہیں" },

  // ── Dashboard ───────────────────────────────────────────────
  "dash.badge": { en: "Dashboard", hi: "डैशबोर्ड", ur: "ڈیش بورڈ" },
  "dash.analytics": { en: "Analytics", hi: "विश्लेषण", ur: "تجزیات" },
  "dash.title": { en: "Portfolio Dashboard", hi: "पोर्टफोलियो डैशबोर्ड", ur: "پورٹ فولیو ڈیش بورڈ" },
  "dash.liveNote": {
    en: "Everything here is computed live from your real portfolio content — no invented numbers. Use it to spot gaps, and ask Nova to fix them.",
    hi: "यहाँ सब कुछ आपके वास्तविक पोर्टफोलियो कंटेंट से लाइव गणना किया गया है — कोई मनगढ़ंत संख्या नहीं। कमियाँ खोजने और Nova से सुधारने के लिए कहें।",
    ur: "یہ سب کچھ آپ کے حقیقی پورٹ فولیو سے لائیو حساب کیا جاتا ہے — کوئی مصنوعی اعداد نہیں۔ خامیوں کو دیکھیں اور نووا سے درست کرنے کو کہیں۔",
  },
  "dash.subtitle": {
    en: "Live health-check of your portfolio, straight from your data.",
    hi: "आपके डेटा से सीधे पोर्टफोलियो की लाइव जाँच।",
    ur: "آپ کے ڈیٹا سے براہ راست پورٹ فولیو کی لائیو صحت۔",
  },
  "dash.healthScore": { en: "Content health", hi: "कंटेंट स्वास्थ्य", ur: "مواد کی صحت" },
  "dash.askNova": { en: "Ask Nova", hi: "Nova से पूछें", ur: "نووا سے پوچھیں" },
  "dash.aiStatus": { en: "AI Status", hi: "AI स्थिति", ur: "AI کی حیثیت" },
  "dash.statProjects": { en: "Projects", hi: "परियोजनाएँ", ur: "منصوبے" },
  "dash.statPosts": { en: "Blog posts", hi: "ब्लॉग पोस्ट", ur: "بلاگ پوسٹس" },
  "dash.statSkills": { en: "Skills", hi: "कौशल", ur: "مہارتیں" },
  "dash.statCerts": { en: "Certifications", hi: "प्रमाणपत्र", ur: "سرٹیفیکیشنز" },
  "dash.statEducation": { en: "Education", hi: "शिक्षा", ur: "تعلیم" },
  "dash.statAssistant": { en: "AI assistant", hi: "AI सहायक", ur: "AI معاون" },
  "dash.haveLiveLink": { en: "of projects have a live link", hi: "प्रोजेक्ट्स के पास लाइव लिंक है", ur: "پروجیکٹس کے پاس لائیو لنک ہے" },
  "dash.needUrl": { en: "need URL", hi: "URL चाहिए", ur: "URL چاہیے" },
  "dash.acrossCategories": { en: "Across 5 categories", hi: "5 श्रेणियों में", ur: "5 زمروں میں" },
  "dash.articlesWritten": { en: "Articles written on your journey", hi: "आपकी यात्रा पर लिखे गए लेख", ur: "آپ کے سفر پر لکھے گئے مضامین" },
  "dash.fromIssuers": { en: "From real issuers", hi: "वास्तविक जारीकर्ताओं से", ur: "حقیقی جاری کنندگان سے" },
  "dash.singleDegree": { en: "Single degree", hi: "एकल डिग्री", ur: "ایک ڈگری" },
  "dash.noEducation": { en: "No education listed", hi: "कोई शिक्षा सूचीबद्ध नहीं", ur: "کوئی تعلیم درج نہیں" },
  "dash.model": { en: "Model", hi: "मॉडल", ur: "ماڈل" },
  "dash.addKey": { en: "Add OPENROUTER_API_KEY to enable", hi: "सक्षम करने के लिए OPENROUTER_API_KEY जोड़ें", ur: "فعال کرنے کے لیے OPENROUTER_API_KEY شامل کریں" },
  "dash.checking": { en: "Checking…", hi: "जाँच हो रही है…", ur: "جانچ ہو رہی ہے…" },
  "dash.available": { en: "AI available", hi: "AI उपलब्ध", ur: "AI دستیاب" },
  "dash.byCategory": { en: "Skills by category", hi: "श्रेणी के अनुसार कौशल", ur: "زمرہ کے لحاظ سے مہارتیں" },
  "dash.topTech": { en: "Most used technologies", hi: "सबसे अधिक उपयोग की जाने वाली प्रौद्योगिकियाँ", ur: "سب سے زیادہ استعمال شدہ ٹیکنالوجیز" },
  "dash.topSkillsBy": { en: "Top skills by proficiency", hi: "दक्षता के अनुसार शीर्ष कौशल", ur: "مہارت کے لحاظ سے مقبول مہارتیں" },
  "dash.noTags": { en: "No tags found on any project.", hi: "किसी भी प्रोजेक्ट पर टैग नहीं मिले।", ur: "کسی بھی پروجیکٹ پر ٹیگز نہیں ملے۔" },
  "dash.fix": { en: "Fix", hi: "सुधारें", ur: "درست کریں" },
  "dash.novaReady": { en: "Nova is ready to help", hi: "Nova मदद के लिए तैयार है", ur: "نووا مدد کے لیے تیار ہے" },
  "dash.novaDesc": {
    en: "Nova can plan content improvements, rewrite project descriptions, draft blog posts and keep your portfolio consistent — it always asks before changing anything. Try saying:",
    hi: "Nova कंटेंट सुधार की योजना बना सकता है, प्रोजेक्ट विवरण फिर से लिख सकता है, ब्लॉग पोस्ट का मसौदा तैयार कर सकता है — यह कुछ भी बदलने से पहले हमेशा पूछता है। कहने की कोशिश करें:",
    ur: "نووا مواد کی بہتری کا منصوبہ بنا سکتا ہے، پروجیکٹ کی تفصیل دوبارہ لکھ سکتا ہے، بلاگ پوسٹس تیار کر سکتا ہے — یہ کچھ بدلنے سے پہلے ہمیشہ پوچھتا ہے۔ کہنے کی کوشش کریں:",
  },
  "dash.suggImprove": { en: "What should I improve?", hi: "मुझे क्या सुधारना चाहिए?", ur: "مجھے کیا بہتر کرنا چاہیے؟" },
  "dash.suggDesc": {
    en: "Make my top project description more professional",
    hi: "मेरे मुख्य प्रोजेक्ट का विवरण अधिक पेशेवर बनाएं",
    ur: "میرے اہم پروجیکٹ کی تفصیل مزید پیشہ ور بنائیں",
  },
  "dash.suggPost": { en: "Publish a post about my portfolio", hi: "मेरे पोर्टफोलियो के बारे में पोस्ट प्रकाशित करें", ur: "میرے پورٹ فولیو کے بارے میں پوسٹ شائع کریں" },
  "dash.reviewProjects": { en: "Review your projects", hi: "अपने प्रोजेक्ट देखें", ur: "اپنے پروجیکٹ دیکھیں" },
  "dash.issueUrl": { en: "Projects with an invalid live URL", hi: "अमान्य लाइव URL वाले प्रोजेक्ट", ur: "غلط لائیو URL والے پروجیکٹ" },
  "dash.issueDesc": { en: "Projects with a missing description", hi: "विवरण रहित प्रोजेक्ट", ur: "بغیر تفصیل والے پروجیکٹ" },
  "dash.issueTags": { en: "Projects with no tags", hi: "बिना टैग वाले प्रोजेक्ट", ur: "بغیر ٹیگز والے پروجیکٹ" },
  "dash.issueCover": { en: "Blog posts with no cover image", hi: "कवर इमेज के बिना ब्लॉग पोस्ट", ur: "بغیر کور تصویر کے بلاگ پوسٹس" },
  "dash.online": { en: "Online", hi: "ऑनलाइन", ur: "آن لائن" },
  "dash.offline": { en: "Offline", hi: "ऑफ़लाइन", ur: "آف لائن" },

  // ── About page ──────────────────────────────────────────────
  "about.title": { en: "About Me", hi: "मेरे बारे में", ur: "میرے بارے میں" },
  "about.intro1": {
    en: "Hello! I'm a professional Frontend Web Developer building lightning-fast and intelligent web applications.",
    hi: "नमस्ते! मैं एक पेशेवर फ्रंटएंड वेब डेवलपर हूँ जो तेज़ और स्मार्ट वेब एप्लिकेशन बनाता हूँ।",
    ur: "ہیلو! میں ایک پیشہ ور فرنٹ اینڈ ویب ڈویلپر ہوں جو تیز اور ذہین ویب ایپلی کیشنز بناتا ہوں۔",
  },
  "about.intro2": {
    en: "I specialize in Next.js, Tailwind CSS, TypeScript, and integrating smart solutions like AI Chatbots and Firebase Authentication.",
    hi: "मैं Next.js, Tailwind CSS, TypeScript, और AI चैटबॉट्स और Firebase Authentication जैसे स्मार्ट समाधानों को एकीकृत करने में विशेषज्ञ हूँ।",
    ur: "میں Next.js، Tailwind CSS، TypeScript، اور AI چیٹ باتس اور Firebase Authentication جیسمارٹ حل کو انٹیگریٹ کرنے میں مہارت رکھتا ہوں۔",
  },
  "about.intro3": {
    en: "Certified by PIAIC, GIAIC, and SMIT — continuously learning and growing.",
    hi: "PIAIC, GIAIC, और SMIT द्वारा प्रमाणित — लगातार सीख रहे हैं और बढ़ रहे हैं।",
    ur: "PIAIC، GIAIC، اور SMIT سے تصدیق شدہ — مسلسل سیکھ رہے ہیں اور بڑھ رہے ہیں۔",
  },
  "about.skillsTitle": { en: "My Skillset", hi: "मेरा कौशल सेट", ur: "میرا مہارت سیٹ" },
  "about.skillsSub": { en: "Technologies I work with daily", hi: "तकनीकें जिनका मैं रोज़ उपयोग करता हूँ", ur: "ٹیکنالوجیز جن کا میں روزانہ استعمال کرتا ہوں" },
  "about.certsTitle": { en: "Certifications", hi: "प्रमाणपत्र", ur: "سرٹیفیکیشنز" },
  "about.certsSub": { en: "Validated expertise from leading programs", hi: "प्रमुख कार्यक्रमों से मान्यता प्राप्त विशेषज्ञता", ur: "پیش قدم پروگراموں سے تصدیق شدہ مہارت" },
  "about.projects": { en: "Projects", hi: "परियोजनाएँ", ur: "منصوبے" },
  "about.technologies": { en: "Technologies", hi: "प्रौद्योगिकियाँ", ur: "ٹیکنالوجیز" },
  "about.commitment": { en: "Commitment", hi: "प्रतिबद्धता", ur: "عزم" },
  "about.education": { en: "Education", hi: "शिक्षा", ur: "تعلیم" },
  "about.graduated": { en: "Graduated", hi: "स्नातक", ur: "گریجویٹ" },
  "about.online": { en: "Online", hi: "ऑनलाइन", ur: "آن لائن" },
  "about.available": { en: "Available for work", hi: "काम के लिए उपलब्ध", ur: "کام کے لیے دستیاب" },

  // ── Common ──────────────────────────────────────────────────
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है...", ur: "لوڈ ہو رہا ہے..." },
  "common.online": { en: "Online", hi: "ऑनलाइन", ur: "آن لائن" },
  "common.offline": { en: "Offline", hi: "ऑफ़लाइन", ur: "آف لائن" },
  "common.unknown": { en: "unknown", hi: "अज्ञात", ur: "نامعلوم" },
  "common.skills": { en: "skills", hi: "कौशल", ur: "مہارتیں" },

  // ── Contact Form ────────────────────────────────────────────
  "contact.formName": { en: "Full Name", hi: "पूरा नाम", ur: "پورا نام" },
  "contact.formNamePlaceholder": { en: "Your full name", hi: "आपका पूरा नाम", ur: "آپ کا پورا نام" },
  "contact.formEmail": { en: "Email Address", hi: "ईमेल पता", ur: "ای میل ایڈریس" },
  "contact.formSubject": { en: "Subject", hi: "विषय", ur: "موضوع" },
  "contact.formSubjectPlaceholder": { en: "Project or inquiry topic", hi: "प्रोजेक्ट या पूछताछ विषय", ur: "پراجیکٹ یا استفسار کا موضوع" },
  "contact.formMessage": { en: "Message", hi: "संदेश", ur: "پیغام" },
  "contact.formMessagePlaceholder": { en: "Please share details about your inquiry...", hi: "कृपया अपनी पूछताछ के बारे में विवरण साझा करें...", ur: "براہ کرم اپنے استفسار کے بارے میں تفصیل بتائیں..." },
  "contact.formSending": { en: "Sending...", hi: "भेजा जा रहा है...", ur: "بھیجا جا رہا ہے..." },
  "contact.formSend": { en: "Send Message", hi: "संदेश भेजें", ur: "پیغام بھیجیں" },
  "contact.formSent": { en: "Message Sent!", hi: "संदेश भेजा गया!", ur: "پیغام بھیج دیا گیا!" },
  "contact.formSuccessTitle": { en: "Message sent", hi: "संदेश भेजा गया", ur: "پیغام بھیج دیا گیا" },
  "contact.formSuccessMsg": { en: "Your message has been delivered — I usually reply within 24 hours.", hi: "आपका संदेश भेज दिया गया है — मैं आमतौर पर 24 घंटे के भीतर जवाब देता हूँ।", ur: "آپ کا پیغام بھیج دیا گیا ہے — میں عام طور پر 24 گھنٹوں کے اندر جواب دیتا ہوں۔" },
  "contact.formErrorTitle": { en: "Message failed to send", hi: "संदेश भेजने में विफल", ur: "پیغام بھیجنے میں ناکامی" },
  "contact.formErrorMsg": { en: "Please try again.", hi: "कृपया पुनः प्रयास करें।", ur: "براہ کرم دوبارہ کوشش کریں۔" },
  "contact.formMethods": { en: "Contact Methods", hi: "संपर्क विधियाँ", ur: "رابطہ کے طریقے" },
  "contact.formResponseTime": { en: "Response Time:", hi: "प्रतिक्रिया समय:", ur: "جواب کا وقت:" },
  "contact.formResponseDetail": { en: "I typically respond within", hi: "मैं आमतौर पर जवाब देता हूँ", ur: "میں عام طور پر جواب دیتا ہوں" },
  "contact.formResponseHours": { en: "24-48 hours", hi: "24-48 घंटे", ur: "24-48 گھنٹے" },

  // ── Agent Panel ─────────────────────────────────────────────
  "agent.title": { en: "Nova Assistant", hi: "Nova सहायक", ur: "نووا معاون" },
  "agent.placeholder": { en: "Ask me anything…", hi: "मुझसे कुछ भी पूछें…", ur: "مجھ سے کچھ بھی پوچھیں…" },
  "agent.explainPage": { en: "Explain this page", hi: "इस पेज को समझाएँ", ur: "اس صفحے کو سمجھائیں" },
  "agent.findProblem": { en: "Find the problem", hi: "समस्या खोजें", ur: "مسئلہ تلاش کریں" },
  "agent.improveContent": { en: "Improve this content", hi: "इस सामग्री को सुधारें", ur: "اس مواد کو بہتر بنائیں" },
  "agent.showProjects": { en: "Show Projects", hi: "परियोजनाएँ दिखाएँ", ur: "منصوبے دکھائیں" },
  "agent.goDashboard": { en: "Go to Dashboard", hi: "डैशबोर्ड पर जाएँ", ur: "ڈیش بورڈ پر جائیں" },
  "agent.whereAmI": { en: "Where am I?", hi: "मैं कहाँ हूँ?", ur: "میں کہاں ہوں؟" },
  "agent.confirmAction": { en: "Confirm action", hi: "क्रिया की पुष्टि करें", ur: "عمل کی تصدیق کریں" },
  "agent.yesApply": { en: "Yes, apply", hi: "हाँ, लागू करें", ur: "ہاں، لاگو کریں" },
  "agent.applying": { en: "Applying…", hi: "लागू हो रहा है…", ur: "لاگو ہو رہا ہے…" },
  "agent.cancel": { en: "Cancel", hi: "रद्द करें", ur: "منسوخ کریں" },
  "agent.clearChat": { en: "Clear conversation", hi: "बातचीत साफ़ करें", ur: "گفتگو صاف کریں" },

  // ── AI Showcase ─────────────────────────────────────────────
  "ai.title": { en: "AI-Powered Portfolio", hi: "AI-संचालित पोर्टफोलियो", ur: "AI سے چلنے والا پورٹ فولیو" },
  "ai.builtWith": { en: "Built With Intelligence", hi: "बुद्धिमत्ता से निर्मित", ur: "ذہانت سے بنایا گیا" },
  "ai.sub": {
    en: "Every corner of this portfolio is wired to a custom AI backend — a grounded agent, semantic search, RAG article reader and career intelligence. Ask the floating Nova orb anything.",
    hi: "इस पोर्टफोलियो का हर कोना एक कस्टम AI बैकएंड से जुड़ा है — एक ग्राउंडेड एजेंट, सिमेंटिक खोज, RAG लेख रीडर और करियर इंटेलिजेंस। तैरते Nova ऑर्ब से कुछ भी पूछें।",
    ur: "اس پورٹ فولیو کا ہر کونا ایک کسٹم AI بیک اینڈ سے جڑا ہوا ہے — ایک بنیاد پر ایجنٹ، سیمنٹک تلاش، RAG آرٹیکل ریڈر اور کیریئر انٹیلیجنس۔ تیرتے ہوئے نووا اورب سے کچھ بھی پوچھیں۔",
  },
  "ai.tryIt": { en: "Try it", hi: "आज़माएँ", ur: "آزمائیں" },
  "ai.seeProjects": { en: "See AI projects", hi: "AI प्रोजेक्ट देखें", ur: "AI پروجیکٹس دیکھیں" },
  "ai.systemsOnline": { en: "AI systems online", hi: "AI सिस्टम ऑनलाइन", ur: "AI سسٹمز آن لائن" },

  // ── AI Showcase features ───────────────────────────────────
  "ai.f1.title": { en: "Nova AI Assistant", hi: "Nova AI सहायक", ur: "نووا AI معاون" },
  "ai.f1.desc": {
    en: "A grounded agentic chatbot that answers questions about the portfolio, navigates pages, opens projects, reads blog posts, toggles the theme, and even listens to voice commands.",
    hi: "एक ग्राउंडेड एजेंटिक चैटबॉट जो पोर्टफोलियो के बारे में सवालों के जवाब देता है, पेज नेविगेट करता है, प्रोजेक्ट खोलता है, ब्लॉग पोस्ट पढ़ता है, थीम बदलता है और वॉयस कमांड भी सुनता है।",
    ur: "ایک بنیاد ایجنٹک چیٹ بات جو پورٹ فولیو کے بارے میں سوالوں کے جواب دیتا ہے، صفحات پر تشریف لے جاتا ہے، پروجیکٹ کھولتا ہے، بلاگ پوسٹس پڑھتا ہے، تھیم تبدیل کرتا ہے اور صوتی کمانڈز بھی سنتا ہے۔",
  },
  "ai.f1.badge": { en: "Agentic Chatbot", hi: "एजेंटिक चैटबॉट", ur: "ایجنٹک چیٹ بات" },
  "ai.f2.title": { en: "AI Semantic Search", hi: "AI सिमेंटिक खोज", ur: "AI سیمنٹک تلاش" },
  "ai.f2.desc": {
    en: "Natural-language search over every project, skill and blog post. Type \"AI projects\" or \"hackathon work\" and the engine understands intent, not just keywords.",
    hi: "हर प्रोजेक्ट, कौशल और ब्लॉग पोस्ट पर प्राकृतिक-भाषा खोज। \"AI projects\" या \"hackathon work\" लिखें और इंजन सिर्फ कीवर्ड नहीं, बल्कि इरादा समझता है।",
    ur: "ہر پروجیکٹ، مہارت اور بلاگ پوسٹ پر قدرتی زبان کی تلاش۔ \"AI projects\" یا \"hackathon work\" لکھیں اور انجن صرف کلیدی الفاظ نہیں بلکہ ارادہ سمجھتا ہے۔",
  },
  "ai.f2.badge": { en: "Semantic Search", hi: "सिमेंटिक खोज", ur: "سیمنٹک تلاش" },
  "ai.f3.title": { en: "Job Compatibility Analyzer", hi: "नौकरी अनुकूलता विश्लेषक", ur: "نوکری مماثلت تجزیہ کار" },
  "ai.f3.desc": {
    en: "Recruiters paste any job description and get an instant AI compatibility score, matched skills, missing skills and a tailored cover-letter opening.",
    hi: "भर्तीकर्ता कोई भी नौकरी विवरण पेस्ट करते हैं और तुरंत AI अनुकूलता स्कोर, मेल खाते कौशल, गायब कौशल और अनुकूलित कवर-लेटर प्रस्तावना प्राप्त करते हैं।",
    ur: "بھرتی کرنے والے کوئی بھی نوکری کی تفصیل چسپاں کرتے ہیں اور فوری AI مماثلت اسکور، مماثل مہارتیں، غائب مہارتیں اور موزوں کور لیٹر کا آغاز حاصل کرتے ہیں۔",
  },
  "ai.f3.badge": { en: "Career Intelligence", hi: "करियर इंटेलिजेंस", ur: "کیریئر انٹیلیجنس" },
  "ai.f4.title": { en: "Article Q&A & Summaries", hi: "लेख प्रश्नोत्तर और सारांश", ur: "مضمون سوال و جواب اور خلاصے" },
  "ai.f4.desc": {
    en: "Every blog post comes with AI-generated summaries, key takeaways and a grounded Q&A reader that answers from the article content itself.",
    hi: "हर ब्लॉग पोस्ट के साथ AI-जनित सारांश, मुख्य बिंदु और एक ग्राउंडेड प्रश्नोत्तर रीडर आता है जो लेख सामग्री से ही उत्तर देता है।",
    ur: "ہر بلاگ پوسٹ کے ساتھ AI سے تیار خلاصے، اہم نکات اور ایک بنیاد پر سوال و جواب قاری آتا ہے جو مضمون کے مواد سے ہی جواب دیتا ہے۔",
  },
  "ai.f4.badge": { en: "RAG Reader", hi: "RAG रीडर", ur: "RAG قاری" },
  "ai.f5.title": { en: "Contact AI Co-writer", hi: "संपर्क AI सह-लेखक", ur: "رابطہ AI شریک مصنف" },
  "ai.f5.desc": {
    en: "The contact form is backed by an intent classifier that triages leads, flags spam and drafts a polished message so every inquiry reaches the right place.",
    hi: "संपर्क फॉर्म एक इरादा वर्गीकरणकर्ता द्वारा समर्थित है जो लीड को छाँटता है, स्पैम को चिह्नित करता है और एक बेहतर संदेश तैयार करता है ताकि हर पूछताछ सही जगह पहुँचे।",
    ur: "رابطہ فارم ایک ارادی درجہ بندی کنندہ کے ذریعے تعاون یافتہ ہے جو لیڈز کو ترتیب دیتا ہے، اسپام کو نشان زد کرتا ہے اور ایک بہتر پیغام تیار کرتا ہے تاکہ ہر استفسار صحیح جگہ پہنچے۔",
  },
  "ai.f5.badge": { en: "Lead Intelligence", hi: "लीड इंटेलिजेंस", ur: "لیڈ انٹیلیجنس" },
  "ai.f6.title": { en: "3D AI Data Network", hi: "3D AI डेटा नेटवर्क", ur: "3D AI ڈیٹا نیٹ ورک" },
  "ai.f6.desc": {
    en: "A real-time, interactive 3D visualization of AI, humans and Earth — 800+ particles, orbiting neural nodes and energy rings rendered with Three.js.",
    hi: "AI, मानव और पृथ्वी का रीयल-टाइम, इंटरैक्टिव 3D विज़ुअलाइज़ेशन — Three.js से रेंडर किए गए 800+ कण, परिक्रमा करने वाले तंत्रिका नोड और ऊर्जा वलय।",
    ur: "AI، انسان اور زمین کی ریئل ٹائم، انٹرایکٹو 3D بصری نمائندگی — Three.js سے بنائے گئے 800+ ذرات، گردش کرتے عصبی نوڈس اور توانائی کے حلقے۔",
  },
  "ai.f6.badge": { en: "Realtime 3D", hi: "रीयलटाइम 3D", ur: "ریئل ٹائم 3D" },

  // ── Time ────────────────────────────────────────────────────
  "time.justNow": { en: "just now", hi: "अभी", ur: "ابھی" },
  "time.minutesAgo": { en: "min ago", hi: "मिन पहले", ur: "منٹ پہلے" },
  "time.hoursAgo": { en: "h ago", hi: "घंटे पहले", ur: "گھنٹے پہلے" },
  "time.daysAgo": { en: "d ago", hi: "दिन पहले", ur: "دن پہلے" },
};

// ────────────────────────────────────────────────
// Initialization helpers
// ────────────────────────────────────────────────

function getInitialTheme(): AppTheme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored && isAppTheme(stored)) return stored;
  }
  return DEFAULT_THEME;
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

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(getInitialTheme);
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Exposure of tokens: set `data-theme` (browser CSS variables) + legacy
  // Tailwind `dark` variant classes + `color-scheme`.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme !== "light");
    root.classList.toggle("light", theme === "light");
  }, [theme]);

  // Persist theme.
  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  // Persist language.
  useEffect(() => {
    localStorage.setItem("portfolio-lang", language);
    const htmlLang = language === "en" ? "en" : language === "hi" ? "hi" : "ur";
    document.documentElement.setAttribute("lang", htmlLang);
  }, [language]);

  // ── Actions ────────────────────────────────
  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? DEFAULT_THEME : "light"));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, []);

  // ── Translation function ───────────────────
  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) {
        return key;
      }
      return entry[language] ?? key;
    },
    [language],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme, language, setLanguage, t }),
    [theme, setTheme, toggleTheme, language, setLanguage, t],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return context;
}