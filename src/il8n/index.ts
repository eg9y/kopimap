import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./en.json";
import idTranslations from "./id.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    id: { translation: idTranslations },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
