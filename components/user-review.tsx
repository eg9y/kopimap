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

const trimAddress = (address: string) => {
  const parts = address.split(",");
  return parts.length > 2 ? `${parts[0]}, ${parts[1]}...` : address;
};

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
  cafeGmapsRating,
  cafeGmapsTotalReviews,
  cafePriceRange,
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
      <div className="flex items-center">
        {icon}
        <span className="ml-1">
          {label}: {value === true ? "Yes" : value === false ? "No" : value}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex items-center mb-2">
        <User size={20} className="mr-2 text-gray-600" />
        <span className="font-semibold text-base">
          {username || "Anonymous"}
        </span>
      </div>
      {showCafeInfo && cafeName && (
        <div className="text-sm text-gray-600 mb-2 pb-2 border-b border-gray-200">
          <p className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>
              {cafeName} - {trimAddress(cafeAddress || "")}
            </span>
          </p>
          <p className="mt-1 flex items-center">
            <Star size={14} className="mr-1 text-yellow-400" />
            <span>
              {cafeGmapsRating} ({cafeGmapsTotalReviews} reviews) •{" "}
              {cafePriceRange}
            </span>
          </p>
        </div>
      )}
      <div className="flex items-center mb-2">
        <Star className="text-yellow-400 mr-1" size={18} />
        <span className="text-base font-medium">{rating.toFixed(1)}</span>
      </div>
      {reviewText && <p className="text-sm text-gray-800 mb-2">{reviewText}</p>}
      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
        {renderMetadataItem(
          <Coffee className="inline mr-1" size={14} />,
          "Coffee",
          metadata.coffee_quality
        )}
        {renderMetadataItem(
          <Wifi className="inline mr-1" size={14} />,
          "WiFi",
          metadata.wifi_quality
        )}
      </div>
      {expanded && (
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
          {renderMetadataItem(
            <Briefcase className="inline mr-1" size={14} />,
            "Work",
            metadata.work_suitability
          )}
          {renderMetadataItem(
            <Utensils className="inline mr-1" size={14} />,
            "Food",
            metadata.food_options
          )}
          {renderMetadataItem(
            <Star className="inline mr-1" size={14} />,
            "Cleanliness",
            metadata.cleanliness
          )}
          {renderMetadataItem(
            <Star className="inline mr-1" size={14} />,
            "Comfort",
            metadata.comfort_level
          )}
          {renderMetadataItem(
            <Star className="inline mr-1" size={14} />,
            "Musholla",
            metadata.has_musholla
          )}
        </div>
      )}
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
      <p className="text-xs text-gray-500 mt-2">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};
