import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Localization from "expo-localization";
import i18n from "../lib/i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Initialize language based on device locale on first load
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const deviceLanguage = Localization.getLocales()[0]?.languageTag || "pt-BR";
        
        // Map common locale codes to supported languages
        let targetLanguage = "pt-BR"; // Default fallback
        
        if (deviceLanguage.startsWith("pt")) {
          targetLanguage = "pt-BR";
        } else if (deviceLanguage.startsWith("en")) {
          targetLanguage = "en";
        } else if (deviceLanguage.startsWith("es")) {
          targetLanguage = "es";
        }
        
        // Only change if different from current
        if (targetLanguage !== i18n.language) {
          await i18n.changeLanguage(targetLanguage);
          setCurrentLanguage(targetLanguage);
        }
      } catch (error) {
        console.warn("Error detecting device language:", error);
      }
    };

    initializeLanguage();
  }, []);

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
