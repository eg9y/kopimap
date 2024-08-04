import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en/translation.json";
import idTranslations from "./locales/id/translation.json";

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

const initialI18nStore = {
  en: {
    translation: enTranslations,
  },
  id: {
    translation: idTranslations,
  },
};
const initialLanguage = 'en'; // or detect from request

export {i18n, initialI18nStore, initialLanguage};
