import { useI18nContext } from "@/src/i18n/i18n-react";
import React, {
  useRef,
  Suspense,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useImage } from "react-image";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/popover";

import { CafeDetailedInfo } from "@/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EditIcon,
  ImageIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  StarIcon,
  XIcon,
  ListChecksIcon,
  InfoIcon,
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

const isInstagramLink = (url: string) => {
  return url.includes("instagram.com") || url.includes("www.instagram.com");
};

const ImageWithSuspense = ({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className: string;
  onClick: () => void;
}) => {
  const { src: loadedSrc } = useImage({
    srcList: [src],
  });
  return (
    <img src={loadedSrc} alt={alt} className={className} onClick={onClick} />
  );
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

const ReviewSummaries = ({ summaries }: { summaries: string[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (summaries.length === 0) return null;

  const displayedSummaries = isExpanded ? summaries : summaries.slice(0, 2);

  return (
    <div className="space-y-2">
      {displayedSummaries.map((summary, index) => (
        <p
          key={index}
          className="text-xs dark:text-slate-300 p-2 bg-gray-100 dark:bg-slate-800 rounded-md"
        >
          {summary}
        </p>
      ))}
      {summaries.length > 2 && (
        <Button
          plain
          className="text-xs w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : `Show ${summaries.length - 2} More`}
        </Button>
      )}
    </div>
  );
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
            {cafeDetailedInfo.parsedReviewSummaries.length > 0 && (
              <div className="flex flex-col gap-1 col-span-2">
                <div className="flex justify-between">
                  <p
                    className="text-sm text-slate-500 dark:text-slate-300 flex items-center gap-1 cursor-help"
                    title="Ringkasan ulasan dibuat menggunakan AI berdasarkan ulasan-ulasan di Google Maps dan KopiMap"
                  >
                    <ListChecksIcon className="size-4" />
                    Ringkasan Ulasan
                  </p>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent>
                      Ringkasan ulasan dibuat menggunakan AI berdasarkan
                      ulasan-ulasan di Google Maps dan KopiMap
                    </PopoverContent>
                  </Popover>
                </div>
                <ReviewSummaries
                  summaries={cafeDetailedInfo.parsedReviewSummaries}
                />
              </div>
            )}
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

interface CustomCarouselProps {
  images: { url: string; label: string | null }[];
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ images }) => {
  const { selectedImageModalIndex, setSelectedImageModalIndex } = useStore();
  const [imageDimensions, setImageDimensions] = useState<
    { width: number; height: number }[]
  >([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensions = await Promise.all(
        images.map(
          (image) =>
            new Promise<{ width: number; height: number }>((resolve) => {
              const img = new Image();
              img.onload = () => {
                resolve({ width: img.width, height: img.height });
              };
              img.src = `${image.url}?height=300&sharpen=true`;
            })
        )
      );
      setImageDimensions(dimensions);
    };

    loadImageDimensions();
  }, [images]);

  useEffect(() => {
    if (selectedImageModalIndex === null) return;

    // Preload previous and next images
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = `${url}?width=1024&sharpen=true`; // Increased width for better quality
    };

    const prevIndex =
      (selectedImageModalIndex - 1 + images.length) % images.length;
    const nextIndex = (selectedImageModalIndex + 1) % images.length;

    preloadImage(images[prevIndex].url);
    preloadImage(images[nextIndex].url);
  }, [selectedImageModalIndex, images]);

  const openModal = (index: number) => {
    setSelectedImageModalIndex(index);
  };

  const closeModal = () => {
    setSelectedImageModalIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageModalIndex === null) return;
    const newIndex =
      direction === "prev"
        ? (selectedImageModalIndex - 1 + images.length) % images.length
        : (selectedImageModalIndex + 1) % images.length;
    setSelectedImageModalIndex(newIndex);
  };

  const scrollCarousel = useCallback((direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount =
        direction === "left" ? -container.offsetWidth : container.offsetWidth;
      const targetScrollPosition = container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScrollPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const containerHeight = 250; // Fixed container height

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollSnapType: "x mandatory",
          height: `${containerHeight}px`,
        }}
      >
        {images.map((image, index) => {
          const aspectRatio = imageDimensions[index]
            ? imageDimensions[index].width / imageDimensions[index].height
            : 1;
          const imageWidth = containerHeight * aspectRatio;

          return (
            <div
              key={image.url}
              className="flex-shrink-0 snap-center p-2"
              style={{
                height: `${containerHeight}px`,
                width: `${imageWidth}px`,
              }}
            >
              <ErrorBoundary fallback={<ImageError />}>
                <Suspense fallback={<ImageLoader />}>
                  <ImageWithSuspense
                    src={`${image.url}?height=300&sharpen=true`}
                    alt={`Cafe Image ${index + 1}`}
                    className="h-full w-full object-cover cursor-pointer rounded-lg"
                    onClick={() => openModal(index)}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          );
        })}
      </div>
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
        onClick={() => scrollCarousel("left")}
      >
        <ChevronLeftIcon size={24} />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
        onClick={() => scrollCarousel("right")}
      >
        <ChevronRightIcon size={24} />
      </button>

      {selectedImageModalIndex !== null && (
        <div
          className="fixed top-0 left-0 z-[1000] w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="w-[90vw] h-[90vh] max-w-4xl max-h-[80vh] relative bg-black flex items-center justify-center">
            <img
              src={`${images[selectedImageModalIndex].url}?width=1024&sharpen=true`}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              loading="eager"
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
