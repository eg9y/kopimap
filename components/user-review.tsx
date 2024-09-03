import React, { useState } from "react";
import {
  Star,
  MapPin,
  User,
  Coffee,
  Wifi,
  Briefcase,
  Utensils,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Database } from "@/components/lib/database.types";
import { Badge } from "./catalyst/badge";

type ReviewMetadata = {
  coffee_quality: Database["public"]["Enums"]["quality_rating"] | null;
  cleanliness: Database["public"]["Enums"]["cleanliness"] | null;
  comfort_level: Database["public"]["Enums"]["comfort_level"] | null;
  food_options: Database["public"]["Enums"]["food_options"] | null;
  wifi_quality: Database["public"]["Enums"]["wifi_quality"] | null;
  work_suitability: Database["public"]["Enums"]["work_suitability"] | null;
  has_musholla: boolean | null;
};

interface UserReviewProps {
  id: string;
  username: string;
  cafeName?: string;
  cafeAddress?: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
  imageUrls?: string[];
  showCafeInfo?: boolean;
  metadata: ReviewMetadata;
  cafeGmapsRating?: string;
  cafeGmapsTotalReviews?: number;
  cafePriceRange?: string;
}

export const UserReview: React.FC<UserReviewProps> = ({
  username,
  cafeName,
  cafeAddress,
  rating,
  reviewText,
  createdAt,
  imageUrls,
  showCafeInfo = true,
  metadata,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const renderMetadataItem = (
    icon: React.ReactNode,
    label: string,
    value: string | null | boolean
  ) => {
    if (value === null || value === undefined) return null;
    return (
      <Badge className="flex items-center gap-1">
        {icon}
        <p>{label}:</p>
        <p>{value === true ? "Yes" : value === false ? "No" : value}</p>
      </Badge>
    );
  };

  const metadataItems = [
    {
      icon: <Coffee className="inline" size={14} />,
      label: "Coffee",
      value: metadata.coffee_quality,
    },
    {
      icon: <Wifi className="inline" size={14} />,
      label: "WiFi",
      value: metadata.wifi_quality,
    },
    {
      icon: <Briefcase className="inline" size={14} />,
      label: "Work",
      value: metadata.work_suitability,
    },
    {
      icon: <Utensils className="inline" size={14} />,
      label: "Food",
      value: metadata.food_options,
    },
    {
      icon: <Star className="inline" size={14} />,
      label: "Cleanliness",
      value: metadata.cleanliness,
    },
    {
      icon: <Star className="inline" size={14} />,
      label: "Comfort",
      value: metadata.comfort_level,
    },
    {
      icon: <Star className="inline" size={14} />,
      label: "Musholla",
      value: metadata.has_musholla,
    },
  ];

  const visibleItems = expanded ? metadataItems : metadataItems.slice(0, 4);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-baseline">
        <div className="flex items-center mb-2">
          <User size={20} className="mr-1 mt-1 text-gray-600" />
          <span className="font-semibold text-base">
            {username || "Anonymous"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(createdAt).toLocaleDateString("id", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      {showCafeInfo && cafeName && (
        <div className="text-sm text-gray-600 mb-2 pb-2 border-b border-gray-200">
          <p className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{cafeName}</span>
          </p>
        </div>
      )}
      {reviewText && <p className="text-sm text-gray-800 mb-2">{reviewText}</p>}
      <div className="flex flex-wrap items-baseline gap-2 pb-2 text-xs">
        <Badge color="yellow" className="flex items-center">
          <Star
            className="text-orange-400 mr-1"
            fill="rgb(251 146 60)"
            size={18}
          />
          <span className="text-base font-medium">{rating.toFixed(1)}</span>
        </Badge>
        {visibleItems.map((item, index) =>
          renderMetadataItem(item.icon, item.label, item.value)
        )}
      </div>
      {expanded && showCafeInfo && (
        <p className="text-sm text-slate-500 overflow-hidden whitespace-nowrap text-ellipsis tracking-tight mb-2">
          @{cafeAddress}
        </p>
      )}
      {metadataItems.length > 4 && (
        <button
          onClick={toggleExpanded}
          className="text-xs text-blue-500 flex items-center mt-2 hover:underline focus:outline-none"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} className="mr-1" /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={14} className="mr-1" /> Show more
            </>
          )}
        </button>
      )}
      {imageUrls && imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Review image ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};
