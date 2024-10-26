import React from "react";
import {
  WifiIcon,
  UmbrellaIcon,
  HeartIcon,
  BriefcaseIcon,
  UsersIcon,
  MoonIcon
} from "lucide-react";
import { useStore } from "../../store";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../catalyst/dropdown";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

interface FilterButton {
  label: string;
  filter: { name: string; values: string[] };
  icon: React.ForwardRefExoticComponent<any>;
  color: string;
  activeColor: string;
  textColor: string;
}

export const MobileSearchFilters: React.FC = () => {
  const { searchFilters, setSearchFilters } = useStore();

  const filterButtons: FilterButton[] = [
    {
      label: "WiFi Cepat",
      filter: { name: "wifi_quality", values: ["Fast and Reliable"] },
      icon: WifiIcon,
      color: "bg-indigo-100 hover:bg-indigo-200",
      activeColor: "bg-indigo-600",
      textColor: "text-indigo-700",
    },
    {
      label: "Outdoor Luas",
      filter: { name: "outdoor_seating", values: ["Ample"] },
      icon: UmbrellaIcon,
      color: "bg-green-100 hover:bg-green-200",
      activeColor: "bg-green-600",
      textColor: "text-green-700",
    },
    {
      label: "Nyaman",
      filter: { name: "comfort_level", values: ["Comfortable", "Luxurious"] },
      icon: HeartIcon,
      color: "bg-pink-100 hover:bg-pink-200",
      activeColor: "bg-pink-600",
      textColor: "text-pink-700",
    },
    {
      label: "WFC enak",
      filter: { name: "work_suitability", values: ["Good", "Excellent"] },
      icon: BriefcaseIcon,
      color: "bg-amber-100 hover:bg-amber-200",
      activeColor: "bg-amber-600",
      textColor: "text-amber-700",
    },
    {
      label: "Ada Musolla",
      filter: { name: "has_musholla", values: ["Yes"] },
      icon: MoonIcon,
      color: "bg-emerald-100 hover:bg-emerald-200",
      activeColor: "bg-emerald-600",
      textColor: "text-emerald-700",
    },
  ];

  const handleRatingChange = (value: string): void => {
    if (value) {
      setSearchFilters({ ...searchFilters, gmaps_rating: value });
    } else {
      const newFilters = { ...searchFilters };
      delete newFilters.gmaps_rating;
      setSearchFilters(newFilters);
    }
  };

  const handleTotalReviewsChange = (value: string): void => {
    if (value) {
      setSearchFilters({ ...searchFilters, gmaps_total_reviews: value });
    } else {
      const newFilters = { ...searchFilters };
      delete newFilters.gmaps_total_reviews;
      setSearchFilters(newFilters);
    }
  };

  const handleFilterToggle = (filter: {
    name: string;
    values: string[];
  }): void => {
    const { name, values } = filter;
    const currentValues = searchFilters[name]?.split(",") || [];

    if (currentValues.length === values.length) {
      const newFilters = { ...searchFilters };
      delete newFilters[name];
      setSearchFilters(newFilters);
    } else {
      setSearchFilters({
        ...searchFilters,
        [name]: values.join(","),
      });
    }
  };

  return (
    <div className="flex-grow overflow-x-auto scrollbar-hide">
      <div className="flex space-x-3">
        {/* Rating filter */}
        <Dropdown>
          <DropdownButton className="flex items-center rounded-lg py-2 px-3 text-sm font-medium shadow-md transition-all duration-200 ease-in-out bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <span className="font-medium whitespace-nowrap">
              {searchFilters.gmaps_rating
                ? `${searchFilters.gmaps_rating}⭐️+`
                : "⭐️ Rating"}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </DropdownButton>
          <DropdownMenu>
            <DropdownItem onClick={() => handleRatingChange("")}>
              Any
            </DropdownItem>
            <DropdownItem onClick={() => handleRatingChange("4")}>
              4.0⭐️+
            </DropdownItem>
            <DropdownItem onClick={() => handleRatingChange("4.5")}>
              4.5⭐️+
            </DropdownItem>
            <DropdownItem onClick={() => handleRatingChange("5")}>
              5.0⭐️
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Total Reviews filter */}
        <Dropdown>
          <DropdownButton className="flex items-center rounded-lg py-2 px-3 text-sm font-medium shadow-md transition-all duration-200 ease-in-out bg-purple-100 text-purple-700 hover:bg-purple-200">
            <UsersIcon className="h-5 w-5" />
            <span className="font-medium whitespace-nowrap">
              {searchFilters.gmaps_total_reviews
                ? `${searchFilters.gmaps_total_reviews}+ reviews`
                : "Reviews"}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </DropdownButton>
          <DropdownMenu>
            <DropdownItem onClick={() => handleTotalReviewsChange("")}>
              Any
            </DropdownItem>
            {[10, 50, 100, 500].map((count) => (
              <DropdownItem
                key={count}
                onClick={() => handleTotalReviewsChange(count.toString())}
              >
                {count}+ reviews
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Filter Buttons */}
        {filterButtons.map((button) => {
          const isActive = searchFilters[button.filter.name];
          const Icon = button.icon;
          return (
            <button
              key={button.label}
              onClick={() => handleFilterToggle(button.filter)}
              className={`flex items-center space-x-2 rounded-lg py-2 px-3 text-sm font-medium shadow-md transition-all duration-200 ease-in-out ${
                isActive
                  ? `${button.activeColor} text-white`
                  : `${button.color} ${button.textColor}`
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
              <span className="whitespace-nowrap">{button.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
