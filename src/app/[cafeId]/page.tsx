"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { fillColorArray } from "@/lib/fill-color-array";
import { getDollarSigns } from "@/lib/getDollarSigns";
import { isChain } from "@/lib/is-chain";
import { cn } from "@/lib/utils";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Carousel from "nuka-carousel";
import { Rating } from "react-simple-star-rating";

function useReviewsQuery(
  supabase: SupabaseClient<Database>,
  cafeId: string | null
) {
  async function fetchReviews() {
    if (!cafeId) {
      return null;
    }

    const response = await supabase
      .from("reviews")
      .select(`*`)
      .eq("cafe_id", cafeId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }

  return useQuery(["reviews", cafeId], fetchReviews, {
    // 4 days
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!cafeId,
  });
}

function useCafeDetailsQuery(
  supabase: SupabaseClient<Database>,
  cafeId: string | null
) {
  async function fetchPlaceDetails() {
    if (!cafeId) {
      return null;
    }

    const response = await supabase
      .from("cafes")
      .select(`*`)
      .eq("id", cafeId)
      .single();

    if (response.error) {
      throw new Error(response.error.message);
    }
    console.log("response data", response.data);
    return response.data;
  }

  return useQuery(["cafes", cafeId], fetchPlaceDetails, {
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!cafeId,
  });
}

export const RenderCenterLeftControls = ({
  previousDisabled,
  previousSlide,
}: {
  previousDisabled: boolean;
  previousSlide: () => void;
}) => (
  <button
    className={cn(
      "bg-transparent border-none",
      "cursor-pointer disabled:cursor-not-allowed",
      "appearance-none flex items-center m-3",
      "text-black opacity-70 hover:opacity-100 disabled:opacity-30"
    )}
    disabled={previousDisabled}
    onClick={previousSlide}
    aria-label="Go to previous slide"
  >
    <ArrowLeftCircleIcon className="h-10 w-10" />
  </button>
);

export const RenderCenterRightControls = ({
  nextDisabled,
  nextSlide,
}: {
  nextDisabled: boolean;
  nextSlide: () => void;
}) => (
  <button
    className={cn(
      "bg-transparent border-none",
      "cursor-pointer disabled:cursor-not-allowed",
      "appearance-none flex items-center my-3 mx-5",
      "text-black opacity-70 hover:opacity-100 disabled:opacity-30"
    )}
    disabled={nextDisabled}
    onClick={nextSlide}
    aria-label="Go to next slide"
  >
    <ArrowRightCircleIcon className="h-10 w-10" />
  </button>
);

export default function DetailsComponent({
  params,
}: {
  params: {
    cafeId: string;
  };
}) {
  const supabase = createClientComponentClient<Database>();

  const reviews = useReviewsQuery(supabase, params.cafeId);
  const cafeDetails = useCafeDetailsQuery(supabase, params.cafeId);

  return (
    <div className="py-10 px-5">
      {cafeDetails.status === "success" && cafeDetails.data && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-5xl font-bold">{cafeDetails.data.name}</h1>
            </div>
            <div className="flex gap-1 items-end">
              {cafeDetails.data.price_level && (
                <Badge
                  variant={"secondary"}
                  className="h-8 border border-slate-400 "
                >
                  {getDollarSigns(cafeDetails.data.price_level)}
                </Badge>
              )}
              {cafeDetails.data.phone_number && (
                <Badge
                  variant={"secondary"}
                  className="h-8 border border-slate-400 "
                >
                  {cafeDetails.data.phone_number}
                </Badge>
              )}
              {cafeDetails.data.url && (
                <Link href={cafeDetails.data.url} target="_blank">
                  <Badge
                    variant={"secondary"}
                    className="h-8 p-1 flex gap-1 border border-slate-400 "
                  >
                    <Image
                      src="/google_maps_icon.webp"
                      height={10}
                      width={10}
                      alt="Google Maps Icon"
                    />{" "}
                    Google Maps
                  </Badge>
                </Link>
              )}
              {cafeDetails.data.website && (
                <Link href={cafeDetails.data.website} target="_blank">
                  <Button
                    variant={"link"}
                    className="truncate max-w-[200px] p-1"
                  >
                    {cafeDetails.data.website.length > 30 ? (
                      <span>
                        {
                          // get domain name and slice it to 30 chars
                          cafeDetails.data.website.split("/")[2].slice(0, 30)
                        }
                      </span>
                    ) : (
                      <span>{cafeDetails.data.website}</span>
                    )}
                  </Button>
                </Link>
              )}
            </div>
            <div className="relative">
              {cafeDetails.data.photo_urls &&
                cafeDetails.data.photo_urls.length > 1 && (
                  <Carousel
                    wrapAround={true}
                    autoplay={true}
                    slidesToShow={2}
                    autoplayInterval={10000}
                    className="rounded-md"
                    renderCenterLeftControls={RenderCenterLeftControls}
                    renderCenterRightControls={RenderCenterRightControls}
                    defaultControlsConfig={{
                      nextButtonText: ">",
                      prevButtonText: "<",
                      pagingDotsClassName: "hidden",
                    }}
                    style={{
                      height: "100%",
                    }}
                  >
                    {cafeDetails.data.photo_urls &&
                      cafeDetails.data.photo_urls.map((photo, photoIndex) => (
                        <div className=" h-auto pr-4 pl-2">
                          <div className="w-full relative pt-[100%]">
                            <Image
                              src={photo}
                              alt={`Photo #${photoIndex} of ${cafeDetails.data?.name}`}
                              layout="fill"
                              className="w-full h-full object-cover top-0 left-0 rounded-xl drop-shadow-lg border-2 border-slate-800"
                            />
                          </div>
                        </div>
                      ))}
                  </Carousel>
                )}
              {cafeDetails.data.photo_urls &&
                cafeDetails.data.photo_urls.length === 1 && (
                  <div className="relative">
                    <Image
                      src={cafeDetails.data.photo_urls[0]}
                      width={500}
                      height={500}
                      alt={`Photo of ${cafeDetails.data?.name}`}
                      className=" object-cover rounded-xl drop-shadow-lg border-2 border-slate-800"
                    />
                  </div>
                )}
            </div>
            {cafeDetails.data.adr_address && (
              <div
                className="text-md max-w-md font-semibold"
                dangerouslySetInnerHTML={{
                  __html: cafeDetails.data.adr_address,
                }}
              />
            )}

            <p>📶 Wifi Speed</p>
            <p>🔌 Plugs</p>
            <p>🎵 Live Music</p>
            <p>🪑 Seating Spots</p>
            <p>🚌 Near Public Transport</p>
            <p>🅿️ Parking Spots</p>
            <p>🏞️ Outdoor Seating</p>
            <p>🐶 Pet Friendly</p>
            {cafeDetails.data.name && (
              <p>
                🏡 Cafe Type:{" "}
                <span>
                  {isChain(cafeDetails.data.name) ? "Chain" : "Independent"}
                </span>
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-2xl">Reviews</h2>
              {cafeDetails.data.rating && (
                <Badge
                  variant={"secondary"}
                  className="text-base h-8 flex items-baseline gap-1 justify-center border border-slate-400"
                >
                  <span className="font-semibold  text-slate-800">
                    {cafeDetails.data.rating}
                  </span>{" "}
                  <Rating
                    SVGclassName="inline-block"
                    allowFraction={true}
                    size={20}
                    readonly
                    initialValue={cafeDetails.data.rating}
                    fillColorArray={fillColorArray}
                    className="mb-2"
                  />
                  <span className="text-slate-400">
                    ({cafeDetails.data.user_ratings_total})
                  </span>
                </Badge>
              )}
            </div>
            <div className="pt-4">
              {reviews.status === "loading" && <div>Loading...</div>}
              {reviews.status === "error" && <div>Error</div>}
              {reviews.status === "success" && reviews.data && (
                <div className="flex flex-col gap-4">
                  {reviews.data.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-4 bg-white p-4 rounded-md"
                    >
                      <div className="flex flex-col gap-2">
                        <div className=" flex items-baseline gap-1 justify-center">
                          <span className="font-semibold  text-slate-800">
                            {review.rating}
                          </span>
                          <Rating
                            SVGclassName="inline-block mb-1"
                            allowFraction={true}
                            size={20}
                            readonly
                            initialValue={review.rating}
                            fillColorArray={fillColorArray}
                          />
                        </div>
                        <p className="text-sm">
                          {review.relative_time_description}
                        </p>
                        <p>{review.author_name}</p>
                      </div>
                      <p>{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {cafeDetails.status === "loading" && <div>Loading...</div>}
      {cafeDetails.status === "error" && <div>Error</div>}
    </div>
  );
}
