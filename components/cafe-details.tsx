import React, { useState, useRef } from 'react';
import { motion } from "framer-motion";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { StarIcon } from "@heroicons/react/20/solid";
import Confetti from "react-confetti";
import useWindowSize from "react-use/esm/useWindowSize";
import { useStore } from "../store";
import { Badge, BadgeButton } from "./catalyst/badge";
import { Heading } from "./catalyst/heading";
import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  EditIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
} from "lucide-react";
import { siInstagram } from "simple-icons";
import { useCafeAggregatedReview } from "../hooks/use-cafe-aggregated-review";
import { useCafeDetailedInfo } from "../hooks/use-cafe-detailed-info";
import { useUser } from "../hooks/use-user";
import { useUserReview } from "../hooks/use-user-review";
import { CafeImages } from "./cafe-images";
import { Button } from "./catalyst/button";
import { Rate } from "./rate";
import { SubmitReviewDialog } from "./submit-review-dialog";
import { AggregatedReviews } from "./aggregated-reviews";
import { cn } from "./lib/utils";

const isInstagramLink = (url: string) => {
  return url.includes("instagram.com") || url.includes("www.instagram.com");
};

export default function CafeDetails() {
  const { LL } = useI18nContext();
  const { selectedCafe, expandDetails, setExpandDetails } = useStore();
  const [letsParty, setLetsParty] = useState(false);
  const [openSubmitReviewDialog, setOpenSubmitReviewDialog] = useState(false);
  const { width, height } = useWindowSize();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });
  const { loggedInUser } = useUser();

  const { data: userReview } = useUserReview(
    loggedInUser?.id || null,
    selectedCafe?.id || null,
  );

  const { data: cafeDetailedInfo } = useCafeDetailedInfo(
    selectedCafe?.id || null,
  );

  const { data: aggregatedReview } = useCafeAggregatedReview(
    selectedCafe ? selectedCafe.id : null,
  );

  if (!selectedCafe) return null;

  const handleReviewButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setConfettiPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setOpenSubmitReviewDialog(true);
  };

  return (
    <>
      <motion.div
        className={cn(
          "ml-[300px] h-[calc(100%_-_1rem)] top-2 overflow-y-scroll pointer-events-auto bg-slate-50 rounded-l-md absolute ring-1 ring-slate-300 shadow-md flex flex-col gap-2",
          expandDetails ? "w-full" : "min-w-[400px] w-[30vw]",
        )}
        animate={{
          width: expandDetails ? "100%" : "30vw",
          minWidth: expandDetails ? "" : "500px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="flex flex-col gap-4 p-4">
          {cafeDetailedInfo ? (
            <>
              {/* Cafe Name and Expand/Collapse Button */}
              <div className="flex items-center justify-between">
                <Heading className="text-2xl">{cafeDetailedInfo.name}</Heading>
                <BadgeButton
                  color="zinc"
                  onClick={() => setExpandDetails(!expandDetails)}
                >
                  {expandDetails ? (
                    <ArrowLeftFromLineIcon className="size-4" />
                  ) : (
                    <ArrowRightFromLineIcon className="size-4" />
                  )}
                </BadgeButton>
              </div>

              {/* Cafe Description */}
              {expandDetails && (
                <p className="text-balance text-sm">{cafeDetailedInfo.description}</p>
              )}

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
              </div>

              {/* Address */}
              <div className="p-2 rounded-md bg-blue-100">
                <p className="text-pretty text-xs">
                  <MapPinIcon className="size-4 inline" /> {cafeDetailedInfo.address}
                </p>
              </div>

              {/* Image and User Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cafe Image */}
                <div className="w-full h-[300px] bg-white rounded-lg shadow-md overflow-hidden">
                  {(cafeDetailedInfo.gmaps_featured_image ||
                    cafeDetailedInfo.hosted_gmaps_images ||
                    cafeDetailedInfo.all_image_urls) && (
                      <img
                        src={
                          cafeDetailedInfo.all_image_urls &&
                            cafeDetailedInfo.all_image_urls.length > 0
                            ? cafeDetailedInfo.all_image_urls[0]
                            : ((cafeDetailedInfo.hosted_gmaps_images as string[] | undefined) &&
                              (cafeDetailedInfo.hosted_gmaps_images as string[]).length > 0 &&
                              (cafeDetailedInfo.hosted_gmaps_images as string[])[0]) ||
                            cafeDetailedInfo.gmaps_featured_image!
                        }
                        className="w-full h-full object-cover"
                        alt={cafeDetailedInfo.name!}
                      />
                    )}
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
      </motion.div>

      <SubmitReviewDialog
        isOpen={openSubmitReviewDialog}
        setIsOpen={setOpenSubmitReviewDialog}
        cafeDetailedInfo={cafeDetailedInfo}
        userReview={userReview}
      />
      <Confetti
        style={{
          pointerEvents: "none",
          zIndex: 696969,
          position: "fixed",
          left: 0,
          top: 0,
        }}
        width={width}
        height={height}
        numberOfPieces={letsParty ? 500 : 0}
        recycle={false}
        confettiSource={{
          x: confettiPosition.x,
          y: confettiPosition.y,
          w: 0,
          h: 0,
        }}
        initialVelocityX={5}
        initialVelocityY={20}
        tweenFunction={(t, b, _c, d) => {
          const c = _c - b;
          return -c * (t /= d) * (t - 2) + b;
        }}
        onConfettiComplete={(confetti) => {
          setLetsParty(false);
          confetti?.reset();
        }}
      />
    </>
  );
}
