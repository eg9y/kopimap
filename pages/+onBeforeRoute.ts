// /renderer/+onBeforeRoute.ts

import type { OnBeforeRouteSync } from "vike/types";

function extractLocale(url: URL): {
  urlWithoutLocale: string;
  locale: "en" | "id";
} {
  const locales = ["en", "id"];
  const defaultLocale = "en";

  const pathParts = url.pathname.split("/").filter(Boolean);
  const maybeLocale = pathParts[0];

  if (locales.includes(maybeLocale)) {
    const locale = maybeLocale as "en" | "id";
    const urlWithoutLocale = url.pathname.slice(3) + url.search; // Remove locale and ensure it starts with /
    return { urlWithoutLocale, locale };
  }

  return { urlWithoutLocale: url.pathname + url.search, locale: defaultLocale };
}

export const onBeforeRoute: OnBeforeRouteSync = (
  pageContext,
): ReturnType<OnBeforeRouteSync> => {
  const url = new URL(pageContext.urlOriginal, "http://localhost");
  const { urlWithoutLocale, locale } = extractLocale(url);

  return {
    pageContext: {
      locale,
      urlOriginal: urlWithoutLocale.startsWith("/")
        ? urlWithoutLocale
        : "/" + urlWithoutLocale,
    },
  };
};
