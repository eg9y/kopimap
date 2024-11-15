import { useI18nContext } from "@/src/i18n/i18n-react";
import { useRef } from "react";

import { CafeDetailedInfo } from "@/types";
import {
  ClockIcon,
  EditIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  StarIcon,
  XIcon,
} from "lucide-react";
import { siInstagram } from "simple-icons";
import { useCafeAggregatedReview } from "../hooks/use-cafe-aggregated-review";
import { useStore } from "../store";
import { AggregatedReviews } from "./aggregated-reviews";
import { Badge, BadgeButton } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";
import { Rate } from "./rate";
import { UserReview } from "./user-review";
import { ImageCarousel } from "./cafe-details/image-carousel";
import { ReviewSummaries } from "./cafe-details/review-summaries";

const isInstagramLink = (url: string) => {
  return url.includes("instagram.com") || url.includes("www.instagram.com");
};

export default function CafeDetails({
  cafeDetailedInfo,
  setOpenSubmitReviewDialog,
  userReview,
}: {
  cafeDetailedInfo?: CafeDetailedInfo;
  setOpenSubmitReviewDialog: (isOpen: boolean) => void;
  userReview: any;
}) {
  const { LL } = useI18nContext();
  const { selectedCafe, selectCafe } = useStore();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: reviewData } = useCafeAggregatedReview(
    selectedCafe ? selectedCafe.id : null
  );

  if (!selectedCafe) return null;

  const handleReviewButtonClick = () => {
    setOpenSubmitReviewDialog(true);
  };

  const carouselImages = cafeDetailedInfo?.all_image_urls ?? [];

  // Remove duplicates from carouselImages
  const uniqueCarouselImages = Array.from(new Set(carouselImages));

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      {cafeDetailedInfo ? (
        <>
          <div className="flex items-center justify-between">
            <Heading className="text-2xl text-black dark:text-white">
              {cafeDetailedInfo.name}
            </Heading>
            <BadgeButton color="zinc" onClick={() => selectCafe(null)}>
              <XIcon />
            </BadgeButton>
          </div>

          {/* Cafe Details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-wrap gap-2">
              <BadgeButton
                color="red"
                href={cafeDetailedInfo.gmaps_link || ""}
                disabled={!cafeDetailedInfo.gmaps_link}
                target="_blank"
              >
                GMaps
              </BadgeButton>
              {cafeDetailedInfo.website && (
                <BadgeButton
                  color="fuchsia"
                  href={cafeDetailedInfo.website}
                  target="_blank"
                  className="flex items-center justify-center"
                >
                  {isInstagramLink(cafeDetailedInfo.website) ? (
                    <svg viewBox="0 0 24 24" className="w-5 fill-pink-700">
                      <path d={siInstagram.path} />
                    </svg>
                  ) : (
                    "Website"
                  )}
                </BadgeButton>
              )}
              {cafeDetailedInfo.price_range && (
                <Badge className="bg-gray-200 dark:bg-gray-700">
                  {cafeDetailedInfo.price_range}
                </Badge>
              )}

              {/* Opening Hours */}
              {reviewData?.cafeDetails?.workday_timings && (
                <Badge className="text-nowrap bg-gray-200 dark:bg-gray-700">
                  <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                  <p>Open {cafeDetailedInfo.workday_timings}</p>
                </Badge>
              )}
              {reviewData?.cafeDetails?.phone && (
                <Badge color="green" className="text-nowrap">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="size-4" />
                    <a
                      href={`tel:${reviewData.cafeDetails.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {reviewData.cafeDetails.phone}
                    </a>
                  </div>
                </Badge>
              )}

              {cafeDetailedInfo.menu_link && (
                <BadgeButton href={cafeDetailedInfo.menu_link}>
                  Menu
                </BadgeButton>
              )}

              {/* Address */}
              <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900">
                <p className="text-pretty text-xs">
                  <MapPinIcon className="size-4 inline" />{" "}
                  {cafeDetailedInfo.address}
                </p>
              </div>
            </div>
            <div className="flex text-nowrap flex-col p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
              <div className="flex flex-col md:flex-row gap-1">
                <p className="text-sm">GMaps Rating</p>
                <div className="flex">
                  <StarIcon className="size-4 text-yellow-400" />
                  <p className="text-nowrap text-sm flex items-center">
                    {cafeDetailedInfo.gmaps_rating} (
                    {cafeDetailedInfo.gmaps_total_reviews})
                  </p>
                </div>
              </div>
              {cafeDetailedInfo.gmaps_reviews_per_rating && (
                <div className="mt-2 w-full max-w-[200px]">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    let reviewCount = 0;
                    try {
                      reviewCount = JSON.parse(
                        cafeDetailedInfo.gmaps_reviews_per_rating as any
                      )[rating.toString()];
                    } catch (error) {}
                    const percentage =
                      (reviewCount / cafeDetailedInfo.gmaps_total_reviews!) *
                      100;
                    return (
                      <div
                        key={rating}
                        className="flex items-center text-xs mb-1"
                      >
                        <span className="w-3">{rating}</span>
                        <div className="flex-grow mx-2 rounded-full h-2 bg-gray-200 dark:bg-gray-600">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-right">{reviewCount}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cafe Image */}
          <div className=" rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <ImageCarousel images={uniqueCarouselImages} />
          </div>

          <div className="p-3 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Heading className="text-lg text-black dark:text-white">
                {LL.cafeDetails.userReviews()}
              </Heading>
              <Rate
                rating={
                  typeof reviewData?.aggregatedReview?.avg_rating === "number"
                    ? reviewData.aggregatedReview.avg_rating
                    : 0
                }
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {LL.basedOnReviews({
                count: reviewData?.aggregatedReview?.review_count ?? 0,
              })}
              {reviewData?.aggregatedReview?.review_count &&
                reviewData.aggregatedReview.review_count > 0 && (
                  <span className="ml-1">
                    • Last:{" "}
                    {new Date(
                      reviewData.aggregatedReview.last_updated!
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                )}
            </p>
            <Button
              color={userReview ? "blue" : "emerald"}
              className="w-full mt-2 cursor-pointer"
              onClick={handleReviewButtonClick}
              ref={buttonRef}
            >
              {userReview ? (
                <>
                  <EditIcon size={16} />
                  {LL.submitReview.updateReview()}
                </>
              ) : (
                <>
                  <PlusIcon size={16} />
                  {LL.cafeDetails.writeAReview()}
                </>
              )}
            </Button>
            {userReview && (
              <p className="text-center mt-1 text-xs text-emerald-600">
                {LL.submitReview.userHaveReviewed()}
              </p>
            )}
          </div>
          {cafeDetailedInfo.parsedReviewSummaries.length > 0 && (
            <ReviewSummaries
              summaries={cafeDetailedInfo.parsedReviewSummaries}
            />
          )}

          {/* Ratings Breakdown */}
          <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <Heading className="mb-2 text-xl text-black dark:text-white">
              {LL.ratingsBreakdown()}
            </Heading>
            <AggregatedReviews
              aggregatedReview={reviewData?.aggregatedReview}
            />
          </div>

          {/* Individual Reviews */}
          <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <Heading className="mb-4 text-xl text-black dark:text-white">
              User Reviews
            </Heading>
            <div className="space-y-4">
              {reviewData?.reviews?.map((review: any) => (
                <UserReview
                  key={review.id}
                  id={review.id}
                  username={review.profiles?.username || "Anonymous"}
                  rating={review.rating!}
                  reviewText={review.review_text!}
                  createdAt={review.updated_at as string}
                  imageUrls={review.image_urls!}
                  showCafeInfo={false}
                  metadata={{
                    coffee_quality: review.coffee_quality,
                    cleanliness: review.cleanliness,
                    comfort_level: review.comfort_level,
                    food_options: review.food_options,
                    wifi_quality: review.wifi_quality,
                    work_suitability: review.work_suitability,
                    has_musholla: review.has_musholla,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <Loader2Icon
            size={100}
            className="animate-spin text-slate-300 dark:text-gray-600"
          />
        </div>
      )}
    </div>
  );
}
