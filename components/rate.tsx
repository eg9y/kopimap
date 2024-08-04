import { useI18nContext } from "@/src/i18n/i18n-react";
import { Rating, RoundedStar } from "@smastrom/react-rating";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

export const Rate = ({ rating = 0 }: { rating: number }) => {
  const { LL } = useI18nContext();

  return (
    <div className="flex flex-col items-center">
      <Rating
        value={rating}
        readOnly
        itemStyles={{
          itemShapes: RoundedStar,
          activeFillColor: "#ffb700",
          inactiveFillColor: "#fbf1a9",
        }}
        halfFillMode="svg"
      />
      <span className="text-lg font-semibold mt-2">
        {rating.toFixed(1)} -{" "}
        {rating === 0
          ? LL.noReviews()
          : CUSTOM_ITEM_LABELS[Math.floor(rating) - 1]}
      </span>
    </div>
  );
};
