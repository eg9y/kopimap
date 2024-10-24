import { useInfiniteQuery } from "@tanstack/react-query";

export const useLatestReviews = (pageSize = 10) => {
	const fetchLatestReviews = async ({ pageParam = 0 }) => {
		const response = await fetch(`${import.meta.env.VITE_MEILISEARCH_URL}/api/user-reviews?limit=${pageSize}&offset=${pageParam}`, {
			mode: 'cors',
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		return response.json();
	};

	const {
		status,
		data,
		error,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["latestReviews"],
		queryFn: fetchLatestReviews,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < pageSize) {
				return undefined; // No more pages
			}
			return allPages.length * pageSize;
		},
		initialPageParam: 0,
	});

	const allReviews = data ? data.pages.flatMap((page) => page) : [];

	return {
		status,
		data: allReviews,
		error,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	};
};
