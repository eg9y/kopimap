import React from "react";
// import logoUrl from "../assets/logo.svg";

// Default <head> (can be overridden by pages)

export default function HeadDefault() {
	return (
		<>
			<meta charSet="UTF-8" />
			{/* <link rel="icon" type="image/svg+xml" href="/vite.svg" /> */}
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, viewport-fit=cover"
			/>
			<title>Kopimap - Discover Jakarta's Best Cafes 🗺️☕️</title>
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
		</>
	);
}
