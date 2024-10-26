import React from "react";
import { WifiIcon, UmbrellaIcon, HeartIcon, BriefcaseIcon } from "lucide-react";
import { useStore } from "../../store";

interface FilterButton {
  label: string;
  filter: { name: string; values: string[] };
  icon: React.ForwardRefExoticComponent<any>;
  color: string;
  activeColor: string;
}

export const MobileSearchFilters: React.FC = () => {
  const { searchFilters, setSearchFilters } = useStore();

  const filterButtons: FilterButton[] = [
    {
      label: "WiFi Cepat",
      filter: { name: "wifi_quality", values: ["Fast and Reliable"] },
      icon: WifiIcon,
      color: "bg-indigo-100 text-indigo-700",
      activeColor: "bg-indigo-600 text-white",
    },
    {
      label: "Outdoor Luas",
      filter: { name: "outdoor_seating", values: ["Ample"] },
      icon: UmbrellaIcon,
      color: "bg-green-100 text-green-700",
      activeColor: "bg-green-600 text-white",
    },
    {
      label: "Nyaman",
      filter: { name: "comfort_level", values: ["Comfortable", "Luxurious"] },
      icon: HeartIcon,
      color: "bg-pink-100 text-pink-700",
      activeColor: "bg-pink-600 text-white",
    },
    {
      label: "WFC enak",
      filter: { name: "work_suitability", values: ["Good", "Excellent"] },
      icon: BriefcaseIcon,
      color: "bg-amber-100 text-amber-700",
      activeColor: "bg-amber-600 text-white",
    },
  ];

  const handleFilterToggle = (filter: { name: string; values: string[] }) => {
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
        {filterButtons.map((button) => {
          const isActive = searchFilters[button.filter.name];
          const Icon = button.icon;
          return (
            <button
              key={button.label}
              onClick={() => handleFilterToggle(button.filter)}
              className={`flex items-center space-x-2 rounded-lg py-2 px-3 text-sm font-medium shadow-md transition-all duration-200 ease-in-out ${
                isActive
                  ? `${
                      button.activeColor
                    } ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ${button.activeColor.replace(
                      "bg-",
                      "ring-"
                    )}`
                  : `${button.color} hover:bg-opacity-80`
              } transform active:translate-y-0`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
              <span className="font-medium whitespace-nowrap">
                {button.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
