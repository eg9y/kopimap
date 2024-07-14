import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const userLanguage = navigator.language.split("-")[0];
    if (userLanguage === "id" || userLanguage === "en") {
      i18n.changeLanguage(userLanguage);
    } else {
      i18n.changeLanguage("en"); // Default to English if not Indonesian or English
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
          i18n.language === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => changeLanguage("id")}
        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
          i18n.language === "id"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        🇮🇩 ID
      </button>
    </div>
  );
};
