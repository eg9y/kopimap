import { CategoryAttributes } from "../../types";
import {
  ArmchairIcon,
  WifiIcon,
  PlugIcon,
  BriefcaseIcon,
  CoffeeIcon,
  CupSodaIcon,
  UtensilsIcon,
  ScaleIcon,
  CarIcon,
  SparklesIcon,
  ShowerHeadIcon,
  AccessibilityIcon,
  SunIcon,
  CameraIcon,
  CatIcon,
} from "lucide-react";

export const reviewAttributes: CategoryAttributes[] = [
  {
    color: "orange",
    category: "Ambiance",
    attributes: [
      {
        name: "comfort_level",
        options: ["Minimal", "Adequate", "Comfortable", "Luxurious"],
        icon: ArmchairIcon,
      },
      {
        name: "seating_capacity",
        options: ["Limited", "Moderate", "Spacious"],
        icon: ArmchairIcon,
      },
    ],
  },
  {
    color: "blue",
    category: "Work-Friendly",
    attributes: [
      {
        name: "wifi_quality",
        options: ["No WiFi", "Unreliable", "Decent", "Fast and Reliable"],
        icon: WifiIcon,
      },
      {
        name: "outlet_availability",
        options: ["None Visible", "Scarce", "Adequate", "Plentiful"],
        icon: PlugIcon,
      },
      {
        name: "work_suitability",
        options: ["Not Suitable", "Tolerable", "Good", "Excellent"],
        icon: BriefcaseIcon,
      },
    ],
  },
  {
    color: "emerald",
    category: "Food & Drinks",
    attributes: [
      {
        name: "coffee_quality",
        options: ["Subpar", "Average", "Good", "Excellent"],
        icon: CoffeeIcon,
      },
      {
        name: "non_coffee_options",
        options: ["Very Limited", "Some Options", "Wide Variety"],
        icon: CupSodaIcon,
      },
      {
        name: "food_options",
        options: ["No Food", "Snacks Only", "Light Meals", "Full Menu"],
        icon: UtensilsIcon,
      },
    ],
  },
  {
    color: "purple",
    category: "Value",
    attributes: [
      {
        name: "price_quality_ratio",
        options: ["Overpriced", "Fair", "Good Value", "Excellent Value"],
        icon: ScaleIcon,
      },
    ],
  },
  {
    color: "fuchsia",
    category: "Facilities",
    attributes: [
      {
        name: "parking_options",
        options: [
          "No Parking",
          "Limited Street Parking",
          "Adequate Parking",
          "Ample Parking",
        ],
        icon: CarIcon,
      },
      {
        name: "cleanliness",
        options: ["Needs Improvement", "Acceptable", "Clean", "Spotless"],
        icon: SparklesIcon,
      },
      {
        name: "restroom_quality",
        options: [
          "No Restroom",
          "Needs Improvement",
          "Acceptable",
          "Clean",
          "Exceptionally Clean",
        ],
        icon: ShowerHeadIcon,
      },
      {
        name: "accessibility",
        options: ["Not Accessible", "Partially Accessible", "Fully Accessible"],
        icon: AccessibilityIcon,
      },
    ],
  },
  {
    color: "lime",
    category: "Special Features",
    attributes: [
      {
        name: "outdoor_seating",
        options: ["None", "Limited", "Ample"],
        icon: SunIcon,
      },
      {
        name: "instagram_worthiness",
        options: [
          "Not Particularly",
          "Somewhat Photogenic",
          "Very Instagrammable",
        ],
        icon: CameraIcon,
      },
      {
        name: "pet_friendly",
        options: ["no", "yes"],
        icon: CatIcon,
      },
    ],
  },
];
