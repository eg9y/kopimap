import { useQuery } from "@tanstack/react-query";
import type { CafeDetailedInfo } from "../types";

const parseReviewSummaries = (summariesString: string | null): string[] => {
	if (!summariesString) return [];
	try {
		return JSON.parse(summariesString);
	} catch {
		return [];
	}
};

const fetchCafeDetailedInfo = async (
	cafeId: string,
): Promise<CafeDetailedInfo> => {
	const response = await fetch(
		`${import.meta.env.VITE_MEILISEARCH_URL}/api/cafe-detailed-info/${cafeId}`,
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data = await response.json();

	// Parse the review summaries before returning
	return {
		...data,
		parsedReviewSummaries: parseReviewSummaries(data.review_summaries),
	};
};

export const useCafeDetailedInfo = (cafeId: string | null) => {
	return useQuery<CafeDetailedInfo>({
		queryKey: ["cafeDetailedInfo", cafeId],
		queryFn: () => fetchCafeDetailedInfo(cafeId!),
		enabled: !!cafeId,
	});
};
