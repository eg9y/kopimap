import { useI18nContext } from "@/src/i18n/i18n-react";
import {
	ArmchairIcon,
	BriefcaseIcon,
	CoffeeIcon,
	HeartIcon,
	SunIcon,
	WifiIcon,
} from "lucide-react";
import { useStore } from "../store";
import { SearchFilters as SearchFiltersType } from "../types";

export default function SearchFilters() {
	const { LL } = useI18nContext();
	const { searchFilters, setSearchFilters } = useStore();

	const handleFilterChange = (
		attributeName: keyof SearchFiltersType,
		values: string[],
	) => {
		const currentValues = searchFilters[attributeName]?.split(",") || [];
		const newValues = values.filter((v) => !currentValues.includes(v));
		const updatedValues = [...currentValues, ...newValues];

		if (
			updatedValues.length === 0 ||
			updatedValues.length === currentValues.length
		) {
			const newFilters = { ...searchFilters };
			delete newFilters[attributeName];
			setSearchFilters(newFilters);
		} else {
			setSearchFilters({
				...searchFilters,
				[attributeName]: updatedValues.join(","),
			});
		}
	};

	const filterButtons = [
		{
			label: "Kopi enak",
			filter: { name: "coffee_quality", values: ["Good", "Excellent"] },
			icon: CoffeeIcon,
		},
		{
			label: "Ada Musholla",
			filter: { name: "has_musholla", values: ["Yes"] },
			icon: ArmchairIcon,
		},
		{
			label: "Banyak Meja",
			filter: { name: "seating_capacity", values: ["Spacious"] },
			icon: ArmchairIcon,
		},
		{
			label: "Outdoor Luas",
			filter: { name: "outdoor_seating", values: ["Ample"] },
			icon: SunIcon,
		},
		{
			label: "WiFi Cepat",
			filter: { name: "wifi_quality", values: ["Fast and Reliable"] },
			icon: WifiIcon,
		},
		{
			label: "Perfect buat WFC",
			filter: { name: "work_suitability", values: ["Good", "Excellent"] },
			icon: BriefcaseIcon,
		},
		{
			label: "Nyaman banget",
			filter: { name: "comfort_level", values: ["Comfortable", "Luxurious"] },
			icon: HeartIcon,
		},
	];

	return (
		<div className="h-full flex flex-col px-2 pt-16 overflow-scroll bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<h2 className="text-2xl mb-4">Filters</h2>

			<div className="flex flex-col gap-2 mt-4">
				{filterButtons.map((button) => {
					const isActive = button.filter.values.every((value) =>
						searchFilters[button.filter.name]?.includes(value),
					);
					return (
						<button
							key={button.label}
							className={`cursor-pointer p-2 rounded-md shadow-sm flex items-center gap-2 transition-colors duration-200
                ${
									isActive
										? "bg-blue-500 dark:bg-blue-600 text-white"
										: "bg-white/90 dark:bg-gray-700 text-black dark:text-white"
								}`}
							onClick={() =>
								handleFilterChange(
									button.filter.name as keyof SearchFiltersType,
									button.filter.values,
								)
							}
						>
							<button.icon
								className={`w-4 h-4 ${
									isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
								}`}
							/>
							<p className="font-bold text-xs">{button.label}</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
