// pages/index/+onBeforePrerenderStart.ts

import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import type { OnBeforePrerenderStartAsync } from "vike/types";
import { convert } from "url-slug";

const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const BATCH_SIZE = 1000;

// Replace the createSlug function with this:
function createSlug(name: string): string {
	return convert(name);
}

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
	async (): ReturnType<OnBeforePrerenderStartAsync> => {
		if (process.env.BUILD_FOR_MOBILE === "true") {
			// Generate only the root URL or necessary pages for mobile build
			return [
				{
					url: "/",
					pageContext: {
						locale: "en", // or your default locale
					},
				},
			];
		}

		const locales: ("en" | "id")[] = ["en", "id"];
		let allCafes: {
			id: number | null;
			name: string | null;
			place_id: string | null;
			all_image_urls: { url: string; label: string | null }[] | null;
			gmaps_featured_image: string | null;
			website: string | null;
			phone: string | null;
		}[] = [];

		let hasMore = true;
		let lastId = 0;

		while (hasMore) {
			const { data: cafes, error } = await supabase
				.from("cafe_location_view")
				.select(
					"id, name, place_id, all_image_urls, gmaps_featured_image, website, phone",
				)
				.order("id", { ascending: true })
				.gt("id", lastId)
				.limit(BATCH_SIZE);

			if (error) {
				console.error("Error fetching cafes:", error);
				return [];
			}

			if (cafes.length > 0) {
				allCafes = [...allCafes, ...cafes];
				lastId = cafes[cafes.length - 1].id!;
			}

			hasMore = cafes.length === BATCH_SIZE;
			break;
		}

		const urls: { url: string; pageContext: any }[] = [];

		for (const locale of locales) {
			// Add root URL for each locale
			urls.push({
				url: `/${locale}`,
				pageContext: {
					locale,
				},
			});

			// Add cafe-specific URLs
			for (const cafe of allCafes) {
				const cafeSlug = createSlug(cafe.name!);

				urls.push({
					url: `/${locale}/?cafe=${cafeSlug}&place_id=${encodeURIComponent(
						cafe.place_id!,
					)}`,
					pageContext: {
						locale,
						data: {
							name: cafe.name,
							image:
								cafe.all_image_urls && cafe.all_image_urls.length > 0
									? cafe.all_image_urls[0]
									: cafe.gmaps_featured_image || null,
							website: cafe.website,
							phone: cafe.phone,
						},
					},
				});
			}
		}

		return urls;
	};
