import { CategoryAttributes } from "../../types";

export const reviewAttributes: CategoryAttributes[] = [
  {
    color: "orange",
    category: "Atmosphere",
    attributes: [
      {
        name: "Overall Vibe",
        options: ["Relaxed", "Energetic", "Cozy", "Modern", "Artistic"],
        icon: "HomeIcon",
      },
      {
        name: "Seating Comfort",
        options: ["Basic", "Comfortable", "Luxurious"],
        icon: "ArmchairIcon",
      },
    ],
  },
  {
    color: "blue",
    category: "Work-Friendly",
    attributes: [
      {
        name: "WiFi Reliability",
        options: ["No WiFi", "Unreliable", "Mostly Reliable", "Very Reliable"],
        icon: "WifiIcon",
      },
      {
        name: "Power Outlets",
        options: ["None Visible", "Limited", "Plenty"],
        icon: "PlugIcon",
      },
      {
        name: "Work Space",
        options: ["Not Suitable", "Okay", "Good", "Excellent"],
        icon: "BriefcaseIcon",
      },
    ],
  },
  {
    color: "emerald",
    category: "Food & Drinks",
    attributes: [
      {
        name: "Coffee Quality",
        options: ["Poor", "Average", "Good", "Excellent"],
        icon: "CoffeeIcon",
      },
      {
        name: "Non-Coffee Options",
        options: ["Very Limited", "Some Options", "Great Variety"],
        icon: "CupSodaIcon",
      },
      {
        name: "Food Options",
        options: ["No Food", "Snacks Only", "Light Meals", "Full Menu"],
        icon: "UtensilsIcon",
      },
    ],
  },
  {
    color: "purple",
    category: "Value",
    attributes: [
      {
        name: "Value for Money",
        options: ["Poor", "Fair", "Good", "Excellent"],
        icon: "ScaleIcon",
      },
    ],
  },
  {
    color: "fuchsia",
    category: "Facilities",
    attributes: [
      {
        name: "Parking",
        options: ["No Parking", "Limited", "Ample"],
        icon: "CarIcon",
      },
      {
        name: "Cleanliness",
        options: ["Poor", "Acceptable", "Clean", "Very Clean"],
        icon: "SparklesIcon",
      },
      {
        name: "Bathroom Availability",
        options: ["No Bathroom", "For Customers", "Public Access"],
        icon: "ShowerHeadIcon",
      },
      {
        name: "Accessibility",
        options: ["Not Accessible", "Partially Accessible", "Fully Accessible"],
        icon: "AccessibilityIcon",
      },
    ],
  },
  {
    color: "zinc",
    category: "Special Features",
    attributes: [
      {
        name: "Outdoor Seating",
        options: ["None", "Limited", "Ample"],
        icon: "SunIcon",
      },
      {
        name: "Instagram-worthy",
        options: ["Not Really", "Somewhat", "Very"],
        icon: "CameraIcon",
      },
      {
        name: "Pet-friendly",
        options: ["no", "meow"],
        icon: "StarIcon",
      },
      {
        name: "Unique Offering",
        options: ["Standard", "Interesting", "Very Unique"],
        icon: "StarIcon",
      },
    ],
  },
];
