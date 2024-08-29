import React, { useRef, Suspense } from 'react';
import { useI18nContext } from "@/src/i18n/i18n-react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useImage } from 'react-image';
import { ErrorBoundary } from "react-error-boundary";
import Carousel from 'react-multi-carousel';

import 'react-multi-carousel/lib/styles.css';

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
import { CafeDetailedInfo } from '@/types';

const isInstagramLink = (url: string) => {
  return url.includes("instagram.com") || url.includes("www.instagram.com");
};


const ImageWithSuspense = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
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
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

export default function CafeDetails({ cafeDetailedInfo, setOpenSubmitReviewDialog, userReview }: {
  cafeDetailedInfo?: CafeDetailedInfo;
  setOpenSubmitReviewDialog: React.Dispatch<React.SetStateAction<boolean>>;
  userReview: any;
}) {
  const { LL } = useI18nContext();
  const { selectedCafe, selectCafe } = useStore();

  const buttonRef = useRef<HTMLButtonElement>(null);


  const { data: aggregatedReview } = useCafeAggregatedReview(
    selectedCafe ? selectedCafe.id : null,
  );

  if (!selectedCafe) return null;

  const handleReviewButtonClick = () => {
    setOpenSubmitReviewDialog(true);
  };

  const carouselImages = [
    ...(cafeDetailedInfo?.all_image_urls ?? []),
    ...((cafeDetailedInfo?.hosted_gmaps_images as string[]) ?? [cafeDetailedInfo?.gmaps_featured_image]),
    ...(cafeDetailedInfo?.gmaps_images ? JSON.parse(cafeDetailedInfo?.gmaps_images as string).slice(1).map((gmapsImage: { link: string }) => gmapsImage.link) : []),
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      {cafeDetailedInfo ? (
        <>
          <div className="flex items-center justify-between">
            <Heading className="text-2xl">{cafeDetailedInfo.name}</Heading>
            <BadgeButton
              color="zinc"
              onClick={() => selectCafe(null)}
            >
              <XIcon />
            </BadgeButton>
          </div>

          {/* Cafe Details */}
          <div className="flex flex-wrap gap-2">
            <BadgeButton
              color="red"
              href={cafeDetailedInfo.gmaps_link || ""}
              disabled={!cafeDetailedInfo.gmaps_link}
              target="_blank"
            >
              GMaps
            </BadgeButton>
            <Badge className="text-nowrap">
              <p>GMaps Rating</p>
              <StarIcon className="size-4" />
              <p>{cafeDetailedInfo.gmaps_rating}</p>
              <p>({cafeDetailedInfo.gmaps_total_reviews})</p>
            </Badge>
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
            <Badge className="text-nowrap">
              Open {cafeDetailedInfo.workday_timings}
            </Badge>
            {cafeDetailedInfo.menu_link && (
              <BadgeButton href={cafeDetailedInfo.menu_link}>Menu</BadgeButton>
            )}

            {/* Address */}
            <div className="p-2 rounded-md bg-blue-100">
              <p className="text-pretty text-xs">
                <MapPinIcon className="size-4 inline" /> {cafeDetailedInfo.address}
              </p>
            </div>
          </div>

          {/* Image and User Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr]  gap-4">
            {/* Cafe Image */}


            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Carousel responsive={responsive}>
                {carouselImages.map((cafeImage, index) => (
                  <ErrorBoundary fallback={<ImageError />} key={cafeImage}>
                    <Suspense fallback={<ImageLoader />} >
                      <ImageWithSuspense
                        key={index}
                        src={cafeImage}
                        alt={`${cafeDetailedInfo.name} - Image ${index + 1}`}
                        className="object-cover w-full h-[250px]"
                      />
                    </Suspense>
                  </ErrorBoundary>
                ))}
              </Carousel>
            </div>


            {/* User Reviews */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Heading className="text-xl mb-2">{LL.cafeDetails.userReviews()}</Heading>
              <Rate rating={aggregatedReview?.avg_rating ?? 0} />
              <p className="text-center mt-2 text-sm">
                {LL.basedOnReviews({
                  count: aggregatedReview?.review_count ?? 0,
                })}
                {aggregatedReview?.review_count && aggregatedReview?.review_count > 0 && (
                  <>
                    <br />
                    Last review:{" "}
                    {new Date(aggregatedReview?.last_updated!).toLocaleDateString("id-ID", {
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
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <Loader2Icon size={100} className="animate-spin text-slate-300" />
        </div>
      )}
    </div>
  );
}
