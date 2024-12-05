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
		console.log("BUILD_FOR_MOBILE", process.env.BUILD_FOR_MOBILE);
		if (process.env.BUILD_FOR_MOBILE === "test") {
			console.log("Building for mobile");
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
			try {
				const response = await fetch(
					`https://kopimapsearch.blogstreak.com/api/cafe-list?lastId=${lastId}&limit=${BATCH_SIZE}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch cafe list");
				}

				const cafes = await response.json();

				if (cafes.length > 0) {
					allCafes = [...allCafes, ...cafes];
					lastId = cafes[cafes.length - 1].id!;
				}

				hasMore = cafes.length === BATCH_SIZE;
			} catch (error) {
				console.error("Error fetching cafes:", error);
				return [];
			}
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
