import type { MeiliSearchCafe } from "@/types";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";

const SUPPORTED_LOCALES = ["en", "id"];

const translations = {
  en: {
    app: {
      title: "Kopimap - Discover Jakarta's Best Cafes 🗺️☕️",
      description:
        "Explore Jakarta's vibrant cafe scene with Kopimap. Find the perfect spot for coffee, work, or relaxation with our interactive map and detailed reviews.",
      shortDescription: "Cafe terdekat di DKI Jakarta",
      keywords: "Jakarta cafes, coffee shops, workspace, kopimap, cafe finder",
      ogTitle: "Kopimap - Jakarta's Ultimate Cafe Guide",
      ogDescription:
        "Discover the best cafes in Jakarta for coffee, work, and relaxation. Interactive map and detailed reviews.",
    },
  },
  id: {
    app: {
      title: "Kopimap - Temukan Cafe Terdekat di Jakarta 🗺️☕️",
      description:
        "Jelajahi cafe terdekat di Jakarta dengan Kopimap. Temukan tempat sempurna untuk ngopi, kerja, atau bersantai dengan peta interaktif dan ulasan detail kami.",
      shortDescription: "Peta cafe terdekat di DKI Jakarta",
      keywords:
        "Cafe terdekat Jakarta, kedai kopi, tempat kerja, kopimap, pencari cafe",
      ogTitle: "Kopimap - Panduan Cafe Terdekat Terlengkap di Jakarta",
      ogDescription:
        "Temukan cafe terdekat terbaik di Jakarta untuk ngopi, kerja, atau bersantai. Peta interaktif dan ulasan detail.",
    },
  },
};

export function Head() {
  const data = useData<undefined | { cafeToSelect?: MeiliSearchCafe }>();
  const pageContext: any = usePageContext();
  const locale: "en" | "id" = pageContext.locale || "en";
  const t = translations[locale].app;

  const getDataValue = (key: string, defaultValue?: string) => {
    return (
      pageContext.data?.[key] ||
      data?.cafeToSelect?.[key as keyof MeiliSearchCafe] ||
      defaultValue
    );
  };

  const title = getDataValue("name", t.title);
  const fullTitle = `Kopimap | ${title}`;

  const ldJson = pageContext.data
    ? {
        "@context": "https://schema.org",
        "@type": "CafeOrCoffeeShop",
        name: getDataValue("name", ""),
        image: getDataValue("image"),
        "@id": "",
        url: getDataValue("website"),
        telephone: getDataValue("phone"),
        menu: "",
        servesCuisine: "Cafe",
        acceptsReservations: "false",
        address: {
          "@type": "PostalAddress",
          streetAddress: "",
          addressLocality: "",
          postalCode: "",
          addressCountry: "",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: getDataValue("gmaps_rating"),
          ratingCount: getDataValue("gmaps_total_reviews"),
        },
      }
    : null;

  // Construct the current URL
  const baseUrl = "https://www.kopimap.com";
  const currentPath = pageContext.urlOriginal || "";
  const currentUrl = new URL(currentPath, baseUrl).toString();

  // Extract the path and query parameters
  const url = new URL(currentUrl);
  const pathWithParams = `${url.pathname}${url.search}`;

  return (
    <>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
      <title>{fullTitle}</title>
      {pageContext.data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      )}
      <meta name="description" content={t.description} />
      <meta name="description" content={t.shortDescription} />
      <meta name="keywords" content={t.keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      <meta property="og:title" content={t.ogTitle} />
      <meta property="og:description" content={t.ogDescription} />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
      <meta property="og:url" content={currentUrl} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* hreflang tags */}
      {SUPPORTED_LOCALES.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}/${lang}${pathWithParams.replace(/^\/[a-z]{2}/, "")}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${pathWithParams.replace(/^\/[a-z]{2}/, "")}`}
      />
    </>
  );
}
