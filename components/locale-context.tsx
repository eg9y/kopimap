import TypesafeI18n from "@/src/i18n/i18n-react";
import { detectLocale } from "@/src/i18n/i18n-util";
import { loadLocaleAsync } from "@/src/i18n/i18n-util.async";
import { useState, useEffect } from "react";
import { navigatorDetector } from "typesafe-i18n/detectors";

export const LocaleContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Detect locale
  const locale = detectLocale(navigatorDetector);

  // Load locales
  const [localesLoaded, setLocalesLoaded] = useState(false);
  useEffect(() => {
    loadLocaleAsync(locale).then(() => setLocalesLoaded(true));
  }, [locale]);

  if (!localesLoaded) {
    return null;
  }

  return (
    <TypesafeI18n locale={locale}>
      {children}
    </TypesafeI18n>
  )

}
