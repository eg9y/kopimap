import React, { useEffect, useState } from "react";
import { Locales } from "@/src/i18n/i18n-types";
import { loadLocaleAsync } from "@/src/i18n/i18n-util.async";
import { useI18nContext } from "@/src/i18n/i18n-react";

export const LanguageSwitcher: React.FC = () => {
  const [currentLocale, setCurrentLocale] = useState<Locales>('en');

  const { setLocale } = useI18nContext()
  

  useEffect(() => {
    const userLanguage = navigator.language.split("-")[0] as Locales;
    const initialLocale = userLanguage === "id" || userLanguage === "en" ? userLanguage : "en";
    
    loadLocaleAsync(initialLocale).then(() => {
      setLocale(initialLocale);
      setCurrentLocale(initialLocale);
    });
  }, []);

  const changeLanguage = async (locale: Locales) => {
    await loadLocaleAsync(locale);
    setLocale(locale);
    setCurrentLocale(locale);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
          currentLocale === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => changeLanguage("id")}
        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
          currentLocale === "id"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        🇮🇩 ID
      </button>
    </div>
  );
};