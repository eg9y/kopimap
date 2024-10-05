import { useStore } from "@/store";
import { motion } from "framer-motion";
import { ArmchairIcon, CoffeeIcon, SunIcon, WifiIcon } from "lucide-react";

const FilterButton = ({ label, icon: Icon, isActive, onClick }: any) => {
	return (
		<motion.button
			onClick={onClick}
			className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-colors ${
				isActive
					? "bg-blue-500 text-white"
					: "bg-gray-100 text-gray-800 hover:bg-gray-200"
			}`}
		>
			<Icon
				className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
			/>
			<span className="font-bold">{label}</span>
		</motion.button>
	);
};

export default function MobileSearchFilters() {
	const { searchFilters, setSearchFilters } = useStore();

	const handleFilterChange = (filterName: string, filterValue: string) => {
		const isActive = searchFilters[filterName] === filterValue;
		const newFilters = { ...searchFilters };

		if (isActive) {
			delete newFilters[filterName]; // Remove filter if already active
		} else {
			newFilters[filterName] = filterValue;
		}

		setSearchFilters(newFilters);
	};

	const filters = [
		{
			label: "WiFi Cepat",
			filterName: "wifi_quality",
			filterValue: "Fast",
			icon: WifiIcon,
		},
		{
			label: "Outdoor Luas",
			filterName: "outdoor_seating",
			filterValue: "Spacious",
			icon: SunIcon,
		},
		{
			label: "Kopi Enak",
			filterName: "coffee_quality",
			filterValue: "Excellent",
			icon: CoffeeIcon,
		},
		{
			label: "Banyak Meja",
			filterName: "seating_capacity",
			filterValue: "Ample",
			icon: ArmchairIcon,
		},
	];

	return (
		<div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 py-3 px-4 flex overflow-x-auto space-x-2">
			{filters.map((filter) => {
				const isActive =
					searchFilters[filter.filterName] === filter.filterValue;
				return (
					<FilterButton
						key={filter.label}
						label={filter.label}
						icon={filter.icon}
						isActive={isActive}
						onClick={() =>
							handleFilterChange(filter.filterName, filter.filterValue)
						}
					/>
				);
			})}
		</div>
	);
}
