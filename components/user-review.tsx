import React from 'react';
import { Star, MapPin, User } from 'lucide-react';

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
}

const trimAddress = (address: string) => {
  const parts = address.split(',');
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
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <User size={24} className="mr-2" />
        <span className="font-semibold">{username || 'Anonymous'}</span>
      </div>
      {showCafeInfo && cafeName && (
        <p className="text-sm text-gray-600 mb-2">
          <MapPin size={16} className="inline mr-1" />
          {cafeName} - {trimAddress(cafeAddress || "")}
        </p>
      )}
      <div className="flex items-center mb-2">
        <Star className="text-yellow-400 mr-1" />
        <span>{rating.toFixed(1)}</span>
      </div>
      {reviewText && (
        <p className="text-sm text-gray-800 mb-2">{reviewText}</p>
      )}
      {imageUrls && imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};
