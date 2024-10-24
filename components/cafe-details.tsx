import { useI18nContext } from "@/src/i18n/i18n-react";
import { ClockIcon, PhoneIcon, StarIcon } from "@heroicons/react/20/solid";
import React, {
  useRef,
  Suspense,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useImage } from "react-image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { CafeDetailedInfo } from "@/types";
import {
  EditIcon,
  ImageIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { siInstagram } from "simple-icons";
import { useCafeAggregatedReview } from "../hooks/use-cafe-aggregated-review";
import { useStore } from "../store";
import { AggregatedReviews } from "./aggregated-reviews";
import { Badge, BadgeButton } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";
import { Rate } from "./rate";
import { UserReview } from "./user-review";

const transformImageUrl = (url: string) => {
  const imagePath = url.split("/storage/v1/object/public/")[1];
  if (!imagePath) return url;

  return `https://kopimap-cdn.b-cdn.net/${imagePath}?height=300&sharpen=true`;
};
const isInstagramLink = (url: string) => {
  return url.includes("instagram.com") || url.includes("www.instagram.com");
};

const transformImageUrlFull = (url: string) => {
  const imagePath = url.split("/storage/v1/object/public/")[1];
  if (!imagePath) return url;

  return `https://kopimap-cdn.b-cdn.net/${imagePath}?width=346&sharpen=true`;
};

const ImageWithSuspense = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const { src: loadedSrc } = useImage({
    srcList: [src],
  });
  return <img src={loadedSrc} alt={alt} className={className} />;
};

const ImageError = () => (
  <div className="flex flex-col items-center justify-center h-full w-[250px] bg-gray-200 text-gray-400">
    <ImageIcon size={48} />
    <p className="mt-2 text-sm">Failed to load image</p>
  </div>
);

const ImageLoader = () => (
  <div className="flex items-center justify-center h-full w-[250px] bg-gray-200">
    <Loader2Icon className="animate-spin text-gray-400" size={48} />
  </div>
);

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
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

  const carouselImages = [
    ...(cafeDetailedInfo?.all_image_urls ?? []),
    ...((cafeDetailedInfo?.hosted_gmaps_images as string[]) ?? []),
  ];

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
                    const reviewCount = JSON.parse(
                      cafeDetailedInfo.gmaps_reviews_per_rating as string
                    )[rating.toString()];
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

          {/* Image and User Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
            {/* Cafe Image */}
            <div className="rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
              <CustomCarousel images={uniqueCarouselImages} />
            </div>

            {/* User Reviews Summary */}
            <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
              <Heading className="text-xl mb-2 text-black dark:text-white">
                {LL.cafeDetails.userReviews()}
              </Heading>
              <Rate
                rating={
                  typeof reviewData?.aggregatedReview?.avg_rating === "number"
                    ? reviewData.aggregatedReview.avg_rating
                    : 0
                }
              />
              <p className="text-center mt-2 text-sm">
                {LL.basedOnReviews({
                  count: reviewData?.aggregatedReview?.review_count ?? 0,
                })}
                {reviewData?.aggregatedReview?.review_count &&
                  reviewData.aggregatedReview.review_count > 0 && (
                    <>
                      <br />
                      Last review:{" "}
                      {new Date(
                        reviewData.aggregatedReview.last_updated!
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </>
                  )}
              </p>
              <Button
                color={userReview ? "blue" : "emerald"}
                className="w-full mt-4 cursor-pointer"
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
                <p className="text-center mt-2 text-sm text-emerald-600">
                  {LL.submitReview.userHaveReviewed()}
                </p>
              )}
            </div>
          </div>

          {/* Ratings Breakdown */}
          <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <Heading className="mb-2 text-xl text-black dark:text-white">
              {LL.ratingsBreakdown()}
            </Heading>
            <AggregatedReviews cafeDetailedInfo={cafeDetailedInfo} />
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

interface CustomCarouselProps {
  images: string[];
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ images }) => {
  const [isSwipingHorizontally, setIsSwipingHorizontally] =
    useState<boolean>(false);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      touchStartY.current = e.touches[0].clientY;
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isSwipingHorizontally) {
        e.preventDefault();
      } else {
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = Math.abs(touchCurrentY - touchStartY.current);
        if (deltaY > 10) {
          setIsSwipingHorizontally(false);
        } else {
          setIsSwipingHorizontally(true);
        }
      }
    },
    [isSwipingHorizontally]
  );

  const handleTouchEnd = useCallback(() => {
    setIsSwipingHorizontally(false);
  }, []);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;
    const newIndex =
      direction === "prev"
        ? (selectedImageIndex - 1 + images.length) % images.length
        : (selectedImageIndex + 1) % images.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Carousel responsive={responsive} swipeable={true} draggable={false}>
        {images.map((image, index) => (
          <ErrorBoundary fallback={<ImageError />} key={image}>
            <Suspense fallback={<ImageLoader />}>
              <a onClick={() => openModal(index)}>
                <ImageWithSuspense
                  key={index}
                  src={transformImageUrl(image)}
                  alt={`Cafe Image ${index + 1}`}
                  className="object-cover w-full h-[250px] cursor-pointer"
                />
              </a>
            </Suspense>
          </ErrorBoundary>
        ))}
      </Carousel>

      {selectedImageIndex !== null && (
        <div
          className="fixed top-0 left-0 z-[1000] w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="w-[90vw] h-[90vh] max-w-4xl max-h-[80vh] relative bg-black flex items-center justify-center">
            <img
              src={transformImageUrlFull(images[selectedImageIndex])}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeModal}
            >
              <XIcon size={24} />
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
            >
              <ChevronLeftIcon size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
            >
              <ChevronRightIcon size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to generate the resized image URL
function generateResizedImageUrl(
  originalUrl: string,
  sizeSuffix: string
): string {
  const lastSlashIndex = originalUrl.lastIndexOf("/");
  const path = originalUrl.substring(0, lastSlashIndex + 1);
  const filename = originalUrl.substring(lastSlashIndex + 1);

  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) {
    // No extension, cannot generate resized URL
    return originalUrl;
  }

  const name = filename.substring(0, dotIndex);
  const extension = filename.substring(dotIndex);

  const resizedFilename = `${name}_${sizeSuffix}${extension}`;

  const resizedUrl = `${path}${resizedFilename}`;

  return resizedUrl;
}
