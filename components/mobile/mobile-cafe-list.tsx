import { useCafes } from "@/hooks/use-cafes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FilterIcon } from "lucide-react";
import React, {
	useCallback,
	RefObject,
	useState,
	useEffect,
	useRef,
} from "react";
import useMedia from "react-use/esm/useMedia";
import { useStore } from "../../store";
import { MeiliSearchCafe } from "../../types";
import { Badge } from "../catalyst/badge";

interface CafeListProps {
	searchInput: string;
	setIsOpen: (x: boolean) => void;
	isOpen: boolean;
	inputRef: RefObject<HTMLInputElement>;
}

export const MobileCafeList: React.FC<CafeListProps> = ({
	searchInput,
	setIsOpen,
	isOpen,
	inputRef,
}) => {
	const { selectCafe, mapRef, mapCenter, searchFilters, setSearchFilters } =
		useStore();
	const isWide = useMedia("(min-width: 640px)");
	const parentRef = useRef<HTMLDivElement>(null);
	const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility

	const {
		data,
		isLoading,
		isFetching,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useCafes(mapCenter.lat, mapCenter.long, searchInput);

	const allCafes = data?.pages.flatMap((page) => page.cafes) ?? [];

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allCafes.length + 1 : allCafes.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 200,
		overscan: 5,
	});

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

		if (!lastItem) {
			return;
		}

		if (
			lastItem.index >= allCafes.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [
		hasNextPage,
		fetchNextPage,
		allCafes.length,
		isFetchingNextPage,
		rowVirtualizer.getVirtualItems(),
	]);

	const handleCafeClick = useCallback(
		(cafe: MeiliSearchCafe) => {
			selectCafe(cafe);
			mapRef?.current?.flyTo({
				center: {
					lat: cafe._geo.lat! - (isWide ? 0 : 0.005),
					lon: cafe._geo.lng! - (isWide ? 0.01 : 0.0),
				},
				zoom: 14,
			});
		},
		[selectCafe, mapRef, isWide],
	);

	const handleClose = () => {
		setIsOpen(false);
		setTimeout(() => {
			inputRef.current?.blur();
		}, 100);
	};

	const filterButtons = [
		{
			label: "WiFi Cepat",
			filter: { name: "wifi_quality", values: ["Fast and Reliable"] },
		},
		{
			label: "Outdoor Luas",
			filter: { name: "outdoor_seating", values: ["Ample"] },
		},
		{
			label: "Nyaman",
			filter: { name: "comfort_level", values: ["Comfortable", "Luxurious"] },
		},
		{
			label: "Perfect buat WFC",
			filter: { name: "work_suitability", values: ["Good", "Excellent"] },
		},
	];

	const handleFilterToggle = (filter: any) => {
		const { name, values } = filter;
		const currentValues = searchFilters[name]?.split(",") || [];
		const newValues = values.filter((v: string) => !currentValues.includes(v));
		const updatedValues = [...currentValues, ...newValues];
		setSearchFilters({
			...searchFilters,
			[name]: updatedValues.join(","),
		});
	};

	const handleRemoveFilter = (filterName: string) => {
		const newFilters = { ...searchFilters };
		delete newFilters[filterName];
		setSearchFilters(newFilters);
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="z-30 pointer-events-auto absolute inset-x-0 top-16 bottom-14 flex flex-col p-4">
			<div className="size-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl max-h-full flex flex-col">
				{/* Header with Filter Icon */}
				<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
					<p className="text-lg font-semibold dark:text-white">
						Cafes ({allCafes.length})
					</p>
					<div className="flex items-center">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
						>
							<FilterIcon className="h-6 w-6" />
						</button>
						<button
							onClick={handleClose}
							className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
						>
							<XMarkIcon className="h-6 w-6" />
						</button>
					</div>
				</div>

				{/* Show Selected Filters */}
				{Object.keys(searchFilters).length > 0 && (
					<div className="px-4 py-2 flex flex-wrap gap-2 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
						{Object.keys(searchFilters).map((filterName) => (
							<Badge
								key={filterName}
								color="red"
								className="cursor-pointer"
								onClick={() => handleRemoveFilter(filterName)}
							>
								{filterName}: {searchFilters[filterName]}
							</Badge>
						))}
					</div>
				)}

				{/* Filter List */}
				{showFilters && (
					<div className="p-4 bg-gray-50 dark:bg-gray-900">
						<div className="flex flex-col gap-2">
							{filterButtons.map((button) => {
								const isActive = searchFilters[button.filter.name];
								return (
									<button
										key={button.label}
										onClick={() => handleFilterToggle(button.filter)}
										className={`flex items-center justify-between p-3 rounded-md shadow-sm cursor-pointer transition-colors duration-200
                          ${
														isActive
															? "bg-blue-500 text-white"
															: "bg-white dark:bg-gray-700 text-black dark:text-white"
													}`}
									>
										<span>{button.label}</span>
										{isActive && <XMarkIcon className="w-4 h-4 text-white" />}
									</button>
								);
							})}
						</div>
					</div>
				)}

				{/* Cafe List */}
				<div ref={parentRef} className="flex-grow overflow-y-auto">
					{searchInput && (
						<div className="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
							<p className="text-sm text-blue-700 dark:text-blue-200">
								Showing results for "{searchInput}"
							</p>
						</div>
					)}
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const cafe = allCafes[virtualRow.index];
							const isLoaderRow = virtualRow.index > allCafes.length - 1;

							return (
								<div
									key={virtualRow.index}
									data-index={virtualRow.index}
									ref={rowVirtualizer.measureElement}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: `${virtualRow.size}px`,
										transform: `translateY(${virtualRow.start}px)`,
									}}
								>
									{isLoaderRow ? (
										hasNextPage ? (
											<div className="p-4 text-center">Loading more...</div>
										) : (
											<div className="p-4 text-center">
												No more cafes to load
											</div>
										)
									) : (
										<div
											onClick={() => handleCafeClick(cafe)}
											className="flex flex-col gap-2 justify-between p-4 border-b grab border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors cursor-pointer"
										>
											<div className="flex gap-2 overflow-scroll scrollbar-hide">
												{cafe.images.slice(0, 4).map((image) => (
													<img
														key={image}
														src={image}
														className="w-24 h-24 object-cover rounded-md shadow-sm flex-shrink-0"
														alt={cafe.name}
													/>
												))}
											</div>
											<div className="grow overflow-hidden">
												<p className="font-semibold text-nowrap text-ellipsis dark:text-white">
													{cafe.name}
												</p>
												<div className="flex gap-2 my-1">
													<Badge color="red" className="text-xs">
														{cafe.gmaps_rating} ★ (
														{cafe.gmaps_total_reviews.toLocaleString("id-ID")})
													</Badge>
													{cafe.avg_rating && (
														<Badge color="red" className="text-xs">
															Our rating: {cafe.avg_rating} ({cafe.review_count}
															)
														</Badge>
													)}
												</div>
												<p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis text-nowrap overflow-hidden">
													{cafe.address}
												</p>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
				{isFetching && (
					<div className="flex-shrink-0 p-2 text-center">Updating...</div>
				)}
			</div>
		</div>
	);
};
