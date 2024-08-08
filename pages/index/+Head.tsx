import type { MeiliSearchCafe } from "@/types";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";

export function Head() {
	const data = useData<undefined | { cafeToSelect?: MeiliSearchCafe }>();
	const pageContext: any = usePageContext();

	const getDataValue = (key: string, defaultValue?: string) => {
		return (
			pageContext.data?.[key] ||
			data?.cafeToSelect?.[key as keyof MeiliSearchCafe] ||
			defaultValue
		);
	};

	const title = getDataValue(
		"name",
		"Kopimap - Discover Jakarta's Best Cafes 🗺️☕️",
	);
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
			}
		: null;

	return (
		<>
			<meta charSet="UTF-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, viewport-fit=cover"
			/>
			<title>{fullTitle}</title>
			{pageContext.data && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
				/>
			)}
			<meta
				name="description"
				content="Explore Jakarta's vibrant cafe scene with Kopimap. Find the perfect spot for coffee, work, or relaxation with our interactive map and detailed reviews."
			/>
			<meta
				name="keywords"
				content="Jakarta cafes, coffee shops, workspace, kopimap, cafe finder"
			/>
			<meta name="robots" content="index, follow" />
			<link rel="canonical" href="https://www.kopimap.com" />
			<meta
				property="og:title"
				content="Kopimap - Jakarta's Ultimate Cafe Guide"
			/>
			<meta
				property="og:description"
				content="Discover the best cafes in Jakarta for coffee, work, and relaxation. Interactive map and detailed reviews."
			/>
			<meta
				property="og:image"
				content="https://www.kopimap.com/og-image.jpg"
			/>
			<meta property="og:url" content="https://www.kopimap.com" />
			<meta name="twitter:card" content="summary_large_image" />
			<link
				href="https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css"
				rel="stylesheet"
			/>
		</>
	);
}
