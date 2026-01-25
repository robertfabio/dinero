import * as Localization from "expo-localization";
import * as i18next from "i18next";
import { initReactI18next } from "react-i18next";

// Translations
import en from "../translations/en.json";
import es from "../translations/es.json";
import ptBR from "../translations/pt-BR.json";

const resources = {
  en: {
    translation: en,
  },
  "pt-BR": {
    translation: ptBR,
  },
  pt: {
    translation: ptBR,
  },
  es: {
    translation: es,
  },
};

const deviceLocale = Localization.getLocales()[0]?.languageTag || "pt-BR";

const i18n = i18next?.default ?? i18next;

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLocale,
  fallbackLng: "pt-BR",

  keySeparator: ".",

  interpolation: {
    escapeValue: false,
  },

  compatibilityJSON: "v3",
});

export default i18n;
