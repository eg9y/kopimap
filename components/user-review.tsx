import { Database } from "@/components/lib/database.types";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  Coffee,
  ExternalLinkIcon,
  MapPin,
  Star,
  User,
  Utensils,
  Wifi,
} from "lucide-react";
import React, { useState } from "react";
import convert from "url-slug";
import { Badge } from "./catalyst/badge";
import { Link } from "./catalyst/link";
import { cn } from "./lib/utils";

type ReviewMetadata = {
  coffee_quality: Database["public"]["Enums"]["quality_rating"] | null;
  cleanliness: Database["public"]["Enums"]["cleanliness"] | null;
  comfort_level: Database["public"]["Enums"]["comfort_level"] | null;
  food_options: Database["public"]["Enums"]["food_options"] | null;
  wifi_quality: Database["public"]["Enums"]["wifi_quality"] | null;
  work_suitability: Database["public"]["Enums"]["work_suitability"] | null;
  has_musholla: "Yes" | "No" | null;
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
  placeId?: string;
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
  placeId,
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
      <Badge
        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        key={label}
      >
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

  const transformImageUrl = (url: string) => {
    const imagePath = url.split("/storage/v1/object/public/")[1];
    if (!imagePath) return url;

    return `https://kopimap-cdn.b-cdn.net/${imagePath}?width=346&sharpen=true`;
  };

  return (
    <div className="p-4 flex flex-col border rounded-md shadow-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-center">
          <User size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-sm">
            {username || "Anonymous"}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(createdAt).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {showCafeInfo && cafeName && (
        <Link href={`/?cafe=${convert(cafeName)}&place_id=${placeId}`}>
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            <p className="flex items-center">
              <MapPin size={12} className="mr-1" />
              <span>{cafeName}</span>
              <ExternalLinkIcon size={12} className="ml-1" />
            </p>
          </div>
        </Link>
      )}
      <div
        className={cn(
          "flex flex-col overflow-hidden",
          !expanded && "max-h-[4rem] line-clamp-4 md:line-clamp-8 md:max-h-max"
        )}
      >
        {reviewText && (
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
            {reviewText}
          </p>
        )}
        <div className="flex flex-wrap items-baseline gap-2 mb-2 text-xs">
          <Badge color="yellow" className="flex items-center">
            <Star
              className="text-orange-400 mr-1"
              fill="rgb(251 146 60)"
              size={14}
            />
            <span className="text-base font-medium">{rating.toFixed(1)}</span>
          </Badge>
          {metadataItems.map((item, index) =>
            renderMetadataItem(item.icon, item.label, item.value)
          )}
        </div>
        {showCafeInfo && (
          <p className="text-sm text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap text-ellipsis tracking-tight mb-2">
            @{cafeAddress}
          </p>
        )}
      </div>

      <button
        onClick={toggleExpanded}
        className="text-xs text-blue-500 dark:text-blue-400 flex items-center mt-2 hover:underline focus:outline-none"
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
      <div className="grow flex flex-col justify-end mt-2">
        {imageUrls && imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2 ">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={transformImageUrl(url)}
                alt={`Review image ${index + 1}`}
                className="object-contain"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
