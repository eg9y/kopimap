import { PageContext } from "vike/types";
import ky from "ky";

export { data };

async function data(pageContext: PageContext) {
	const { place_id } = pageContext.urlParsed.search;

	console.log("place_id", place_id);

	if (!place_id) {
		return;
	}

	const response = await ky.get(
		`${import.meta.env.VITE_MEILISEARCH_URL!}/api/cafe/${place_id}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch cafe");
	}

	let cafeToSelect = await response.json();

	return {
		cafeToSelect,
	};
}
