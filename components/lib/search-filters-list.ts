import {
	ArmchairIcon,
	BriefcaseIcon,
	CoffeeIcon,
	HeartIcon,
	SunIcon,
	WifiIcon,
} from "lucide-react";

const searchFiltersList = [
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
