import { Rating, RoundedStar } from "@smastrom/react-rating";
import { useState } from "react";

const CUSTOM_GROUP_LABEL_ID = "group_label";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];
const CUSTOM_ITEM_LABELS_IDS = [
  "label_1",
  "label_2",
  "label_3",
  "label_4",
  "label_5",
];

export function Rate() {
  const [rating, setRating] = useState(4);

  return (
    <div role="group" className="-ml-2 flex items-center gap-4">
      <div className="max-w-[250px] ">
        <Rating
          value={rating}
          itemStyles={{
            itemShapes: RoundedStar,
            activeFillColor: 'white',
            inactiveFillColor: 'white',
            activeBoxBorderColor: "#000",
            inactiveBoxColor: "grey",
            activeBoxColor: ["#da1600", "#db711a", "#dcb000", "#61bb00", "#009664"],
          }}
          onChange={setRating}
          visibleLabelId={CUSTOM_GROUP_LABEL_ID}
          visibleItemLabelIds={CUSTOM_ITEM_LABELS_IDS}
          spaceBetween="small"
          spaceInside="medium"
          transition="position"
        />
      </div>
      <div
      // className="-mb-1"
      >
        <p className="font-bold text-2xl">
          {CUSTOM_ITEM_LABELS[rating - 1]}
        </p>
      </div>
    </div>
  );
}
