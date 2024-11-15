import { useI18nContext } from "@/src/i18n/i18n-react";
import { Rating, RoundedStar } from "@smastrom/react-rating";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

export const Rate = ({ rating = 0 }: { rating: number }) => {
  const { LL } = useI18nContext();

  return (
    <div className="flex flex-row gap-2 items-center">
      <Rating
        value={rating}
        readOnly
        itemStyles={{
          itemShapes: RoundedStar,
          activeFillColor: "#ffb700",
          inactiveFillColor: "rgba(171, 140, 5, 0.3)", //make darker
        }}
        halfFillMode="svg"
        style={{ maxWidth: 100 }}
      />
      <span className={`text-sm font-semibold`}>
        {rating.toFixed(1)} -{" "}
        {rating === 0
          ? LL.noReviews()
          : CUSTOM_ITEM_LABELS[Math.floor(rating) - 1]}
      </span>
    </div>
  );
};
