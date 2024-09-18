import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { UserReview } from "@/components/user-review";
import { useLatestReviews } from "@/hooks/use-latest-reviews";

export default function Feed() {
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useLatestReviews();

  const allReviews = data || [];

  const parentRef = React.useRef<HTMLDivElement>(null);

  // Number of columns in the grid
  const columnCount = 3;

  // Split the data into rows, each containing 'columnCount' items
  const rows = React.useMemo(() => {
    const newRows = [];
    for (let i = 0; i < allReviews.length; i += columnCount) {
      newRows.push(allReviews.slice(i, i + columnCount));
    }
    return newRows;
  }, [allReviews]);

  // Define the vertical gap between rows (e.g., 16px)
  const rowGap = 16; // Adjust as needed

  // Virtualizer for the rows
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: React.useCallback(() => 300 + rowGap, [rowGap]), // Include gap in estimate
    overscan: 5,
    measureElement: (el) => {
      const height = el.getBoundingClientRect().height;
      const style = getComputedStyle(el);
      const marginBottom = parseFloat(style.marginBottom || "0");
      return height + marginBottom;
    },
  });

  // Fetch more data when the last item is visible
  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rows.length,
  ]);

  if (isFetching && !allReviews.length) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-[calc(100dvh_-_56px-0.5rem)] max-w-6xl mx-auto">
      <div className="px-6 py-4 gap-4">
        <h1 className="text-3xl font-bold">Kopi Feed</h1>
        <h2 className="text-lg font-medium">What's brewing</h2>
      </div>
      <div ref={parentRef} className="w-full">
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowReviews = rows[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  marginBottom: `${rowGap}px`, // Add gap between rows
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rowReviews
                    ? rowReviews.map((review) => (
                        <UserReview
                          key={review.id}
                          id={review.id}
                          username={review.user?.username || "Anonymous"}
                          cafeName={review.cafe?.name || undefined}
                          cafeAddress={review.cafe?.address || undefined}
                          rating={review.rating || 0}
                          reviewText={review.review_text || undefined}
                          createdAt={review.updated_at || ""}
                          imageUrls={review.image_urls || undefined}
                          metadata={{
                            coffee_quality: review.coffee_quality,
                            cleanliness: review.cleanliness,
                            comfort_level: review.comfort_level,
                            food_options: review.food_options,
                            wifi_quality: review.wifi_quality,
                            work_suitability: review.work_suitability,
                            has_musholla: review.has_musholla,
                          }}
                          cafeGmapsRating={
                            review.cafe?.gmaps_rating || undefined
                          }
                          cafeGmapsTotalReviews={
                            review.cafe?.gmaps_total_reviews || undefined
                          }
                          cafePriceRange={review.cafe?.price_range || undefined}
                          placeId={review.cafe?.place_id || undefined}
                        />
                      ))
                    : // Placeholder for loading state
                      Array.from({ length: columnCount }).map((_, idx) => (
                        <div
                          key={`placeholder-${idx}`}
                          style={{ height: 300 }} // Adjust based on your item height
                          className="bg-gray-200 animate-pulse"
                        >
                          Loading...
                        </div>
                      ))}
                </div>
              </div>
            );
          })}
        </div>
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  );
}
