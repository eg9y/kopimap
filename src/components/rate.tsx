import { Rating, RoundedStar } from "@smastrom/react-rating";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

export const Rate = ({ rating = 0 }: { rating: number }) => {
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
          ? "No Reviews"
          : CUSTOM_ITEM_LABELS[Math.floor(rating) - 1]}
      </span>
    </div>
  );
};
