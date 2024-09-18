import { useState } from "react";

const UserReview = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const reviewText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan tortor.
  Curabitur vehicula, libero at interdum faucibus, sapien justo facilisis tortor, eget aliquam
  eros lorem ac nisl. Nullam in enim quis lorem ultrices finibus. Vivamus euismod, odio eu
  aliquam placerat, quam sapien aliquam massa, in dignissim sapien augue ac orci. Fusce
  hendrerit, massa non condimentum sagittis, ligula massa facilisis nulla, vitae aliquam velit
  nisl sit amet urna. Praesent ac massa at dolor condimentum varius. Aenean nec magna
  fermentum, tristique elit nec, ultrices purus.`;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-xl font-semibold mb-4">User Review</h2>
      <p className={`text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}>
        {reviewText}
      </p>
      <button
        onClick={toggleExpand}
        className="mt-2 text-blue-500 hover:underline focus:outline-none"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default UserReview;
