import type { MeiliSearchCafe } from "@/types";
import { useData } from "vike-react/useData"; // or vike-vue / vike-solid
import { usePageContext } from "vike-react/usePageContext";

export function Head() {
	const data = useData<undefined | { cafeToSelect?: MeiliSearchCafe }>();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const pageContext: any = usePageContext();

	return (
		<>
			<meta charSet="UTF-8" />
			{/* <link rel="icon" type="image/svg+xml" href="/vite.svg" /> */}
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, viewport-fit=cover"
			/>
			<title>
				{pageContext.data?.title
					? `Kopimap | ${pageContext.data.title}`
					: data?.cafeToSelect
						? `Kopimap | ${data.cafeToSelect.name}`
						: `Kopimap - Discover Jakarta's Best Cafes 🗺️☕️`}
			</title>
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
