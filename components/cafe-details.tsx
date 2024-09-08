import React, { useRef, Suspense, useState, useCallback } from "react";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { StarIcon, PhoneIcon, ClockIcon } from "@heroicons/react/20/solid";
import { useImage } from "react-image";
import { ErrorBoundary } from "react-error-boundary";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";

import { useStore } from "../store";
import { Badge, BadgeButton } from "./catalyst/badge";
import { Heading } from "./catalyst/heading";
import {
  EditIcon,
  ImageIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { siInstagram } from "simple-icons";
import { useCafeAggregatedReview } from "../hooks/use-cafe-aggregated-review";
import { Button } from "./catalyst/button";
import { Rate } from "./rate";
import { AggregatedReviews } from "./aggregated-reviews";
import { CafeDetailedInfo } from "@/types";
import { UserReview } from "./user-review";

const isInstagramLink = (url: string) => {
  return url.includes("instagram.com") || url.includes("www.instagram.com");
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
    srcList: Array(5).fill(src),
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
    // ...(cafeDetailedInfo?.gmaps_images
    //   ? JSON.parse(cafeDetailedInfo?.gmaps_images as string)
    //       .slice(1)
    //       .map((gmapsImage: { link: string }) => gmapsImage.link)
    //   : []),
  ];

  // Remove duplicates from carouselImages
  const uniqueCarouselImages = Array.from(new Set(carouselImages));

  return (
    <div className="flex flex-col gap-4 p-4">
      {cafeDetailedInfo ? (
        <>
          <div className="flex items-center justify-between">
            <Heading className="text-2xl">{cafeDetailedInfo.name}</Heading>
            <BadgeButton color="zinc" onClick={() => selectCafe(null)}>
              <XIcon />
            </BadgeButton>
          </div>

          {/* Cafe Details */}
          <div className="grid grid-cols-2 gap-2 ">
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
                <Badge>{cafeDetailedInfo.price_range}</Badge>
              )}

              {/* Opening Hours */}
              {reviewData?.cafeDetails?.workday_timings && (
                <Badge className="text-nowrap">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <p>Open {cafeDetailedInfo.workday_timings}</p>
                </Badge>
              )}
              {reviewData?.cafeDetails?.phone && (
                <Badge color="green" className="text-nowrap">
                  <p>
                    <div className="flex items-center gap-2">
                      {/* <svg viewBox="0 0 24 24" className="w-5 fill-green-700">
                        <path d={siWhatsapp.path} />
                      </svg> */}
                      <PhoneIcon className="size-4" />
                      <a
                        href={`te:${reviewData.cafeDetails.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {reviewData.cafeDetails.phone}
                      </a>
                    </div>
                  </p>
                </Badge>
              )}

              {cafeDetailedInfo.menu_link && (
                <BadgeButton href={cafeDetailedInfo.menu_link}>
                  Menu
                </BadgeButton>
              )}

              {/* Address */}
              <div className="p-2 rounded-md bg-blue-100">
                <p className="text-pretty text-xs">
                  <MapPinIcon className="size-4 inline" />{" "}
                  {cafeDetailedInfo.address}
                </p>
              </div>
            </div>
            <div className="flex text-nowrap flex-col bg-white p-4 rounded-lg shadow-md">
              <div className="flex gap-1">
                <p className="text-sm">GMaps Rating</p>
                <div className="flex">
                  <StarIcon className="size-4" />
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
                        <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <CustomCarousel images={uniqueCarouselImages} />
            </div>

            {/* User Reviews Summary */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Heading className="text-xl mb-2">
                {LL.cafeDetails.userReviews()}
              </Heading>
              <Rate rating={reviewData?.aggregatedReview?.avg_rating ?? 0} />
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
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Heading className="mb-2 text-xl">{LL.ratingsBreakdown()}</Heading>
            <AggregatedReviews cafeDetailedInfo={cafeDetailedInfo} />
          </div>

          {/* Individual Reviews */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Heading className="mb-4 text-xl">User Reviews</Heading>
            <div className="space-y-4">
              {reviewData?.reviews?.map((review) => (
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
          <Loader2Icon size={100} className="animate-spin text-slate-300" />
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
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
              <a onClick={() => openModal(image)}>
                <ImageWithSuspense
                  key={index}
                  src={image}
                  alt={`Cafe Image ${index + 1}`}
                  className="object-cover w-full h-[250px] cursor-pointer"
                />
              </a>
            </Suspense>
          </ErrorBoundary>
        ))}
      </Carousel>

      {selectedImage && (
        <div
          className="fixed z-[1000] inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={selectedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeModal}
            >
              <XIcon size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
