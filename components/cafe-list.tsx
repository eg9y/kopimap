import type React from "react";

import { useStore } from "../store";
import type { MeiliSearchCafe } from "../types";
import { Badge, BadgeButton } from "./catalyst/badge";
import {
	SidebarHeading,
	SidebarItem,
	SidebarSection,
} from "./catalyst/sidebar";

interface CafeListProps {
	searchInput: string;
	mapCafes:
		| { visibleCafes: MeiliSearchCafe[]; allCafes: MeiliSearchCafe[] }
		| undefined;
	searchCafes: MeiliSearchCafe[] | null | undefined;
}

export const CafeList: React.FC<CafeListProps> = ({
	searchInput,
	mapCafes,
	searchCafes,
}) => {
	const { selectCafe, mapRef, searchFilters, setSearchFilters } = useStore();

	const displayedCafes =
		searchInput || Object.keys(searchFilters).length > 0
			? searchCafes || []
			: mapCafes?.visibleCafes || [];

	const removeSearchFilter = (key: string) => {
		const temp = { ...searchFilters };
		delete temp[key];
		setSearchFilters(temp);
	};

	const handleCafeSelect = (cafe: MeiliSearchCafe) => {
		selectCafe(cafe);
		mapRef?.current?.flyTo({
			center: {
				lat: cafe._geo.lat,
				lon: cafe._geo.lng - 0.01,
			},
			zoom: 14,
		});

		// Create a new URL object
		const url = new URL(window.location.href);

		// Set the new parameters, replacing any existing ones
		url.searchParams.set("cafe", cafe.name);
		url.searchParams.set("place_id", cafe.id);

		// Use history.pushState to update the URL without causing a reload
		window.history.pushState({ triggeredBy: "user" }, "", url.toString());
	};

	return (
		<SidebarSection className="max-lg:hidden">
			<SidebarHeading className="flex flex-col gap-2">
				<p className="text-base">
					{searchInput || Object.keys(searchFilters).length > 0
						? "Results"
						: "Cafe Terdekat"}{" "}
					({displayedCafes.length})
				</p>
			</SidebarHeading>
			<div className="">
				{Object.entries(searchFilters).map(([key, val]) => {
					return (
						<BadgeButton key={key} onClick={() => removeSearchFilter(key)}>
							{key.replace(/_/g, " ")}: {val}
						</BadgeButton>
					);
				})}
			</div>

			{displayedCafes.map((cafe: MeiliSearchCafe) => (
				<SidebarItem
					key={cafe.id}
					onClick={() => handleCafeSelect(cafe)}
					className=""
				>
					<div className="grow w-full">
						<p className="text-nowrap text-ellipsis overflow-hidden">
							{cafe.name}
						</p>
						<div className="flex gap-2">
							<Badge className="grow">
								gmaps rating: {cafe.gmaps_rating} (
								{cafe.gmaps_total_reviews.toLocaleString("id-ID")})
							</Badge>
							<Badge className="grow">
								rating:{" "}
								{cafe.avg_rating
									? `${cafe.avg_rating} (${cafe.review_count})`
									: "-"}
							</Badge>
						</div>
						<p className="font-light text-ellipsis text-nowrap text-slate-500 overflow-hidden">
							{cafe.address}
						</p>
					</div>
				</SidebarItem>
			))}
		</SidebarSection>
	);
};
