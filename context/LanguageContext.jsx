import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const getAvailableLanguages = () => {
    return [
      { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
    ];
  };

  const getCurrentLanguageInfo = () => {
    const languages = getAvailableLanguages();
    return (
      languages.find((lang) => lang.code === currentLanguage) || languages[0]
    );
  };

  const isRTL = () => {
    return false; // Add RTL support if needed in the future
  };

  const value = {
    t,
    currentLanguage,
    changeLanguage,
    getAvailableLanguages,
    getCurrentLanguageInfo,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
