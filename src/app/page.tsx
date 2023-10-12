"use client";

import { Database } from "@/lib/database.types";
import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { fillColorArray } from "@/lib/fill-color-array";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Fragment, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useDebouncedCallback } from "use-debounce";
import { useGeolocated } from "react-geolocated";
import { Checkbox } from "@/components/ui/checkbox";
import { chains } from "@/lib/is-chain";

function useCafesQuery(
  supabase: SupabaseClient<Database>,
  rating: string,
  searchQuery: string,
  enableNearbySearch: boolean,
  showFranchises: boolean,
  coords?: GeolocationCoordinates
) {
  const countPerPage = 30;
  async function fetchCafes({ pageParam = 0 }) {
    const query = supabase
      .from("cafes")
      .select(`*`)
      .order("user_ratings_total", { ascending: false, nullsFirst: false })
      .order("rating", { ascending: false, nullsFirst: false })
      .range(pageParam * countPerPage, (pageParam + 1) * countPerPage - 1); // Assume 10 items per page

    if (rating !== "any rating") {
      query.gte("rating", rating);
    }

    if (searchQuery) {
      query.ilike("name", `%${searchQuery.trim()}%`);
      // query.textSearch("name", searchQuery);
    }

    if (!showFranchises) {
      query.eq("is_franchise", false);
    }

    if (enableNearbySearch && coords) {
      const nearbyQuery = await supabase.rpc("nearby_cafes", {
        lat: coords.latitude,
        long: coords.longitude,
        rating_filter: rating !== "any rating" ? Number(rating) : undefined,

        page_param: pageParam,
        count_per_page: countPerPage,
      });
      return nearbyQuery.data || [];
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  return useInfiniteQuery(
    [
      "cafes",
      {
        rating,
        searchQuery,
        coords,
        enableNearbySearch,
        showFranchises,
      },
    ],
    ({ pageParam = 0 }) => fetchCafes({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return; // Assume no next page if last page is empty
        return allPages.length; // Use the number of fetched pages as the next page param
      },
      // staleTime: 1000 * 60 * 60, // 1 hour
    }
  );
}

interface OpeningHours {
  day: string;
  times: string[];
}

function convertTo24Hour(time: string): string {
  const hours12 = parseInt(time.slice(0, 2), 10);
  const minutes = time.slice(2, 4);
  const amPm = time.slice(5);
  const hours24 = hours12 + (amPm === "PM" ? 12 : 0);
  return `${hours24}:${minutes}`;
}

function getOpeningStatus(openingHours: string | null): string {
  if (!openingHours) return "Hours not available";

  const now = new Date();
  // set to human readable day e.g. Sunday
  const currentDay = now.toLocaleString("en-US", { weekday: "long" });
  // define currentTime to be the current time with format 00.00 and 13.00
  const currentTime = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // set convertOpeningHours to convert openingHours to an array of json. opening hours example:
  // [{'day': 'Kamis', 'times': ['07.00–22.00']}, {'day': 'Jumat', 'times': ['07.00–22.00']}, {'day': 'Sabtu', 'times': ['07.00–22.00']}, {'day': 'Minggu', 'times': ['07.00–22.00']}, {'day': 'Senin', 'times': ['07.00–22.00']}, {'day': 'Selasa', 'times': ['07.00–22.00']}, {'day': 'Rabu', 'times': ['07.00–22.00']}]
  // notice the single quote, we need to convert it to double quote
  const convertedOpeningHours = JSON.parse(
    openingHours.replace(/'/g, '"')
  ) as OpeningHours[];
  const periodsToday = convertedOpeningHours.find((period) => {
    let translatedDay = "Sunday";
    if (period.day === "Minggu") {
      translatedDay = "Sunday";
    } else if (period.day === "Senin") {
      translatedDay = "Monday";
    } else if (period.day === "Selasa") {
      translatedDay = "Tuesday";
    } else if (period.day === "Rabu") {
      translatedDay = "Wednesday";
    } else if (period.day === "Kamis") {
      translatedDay = "Thursday";
    } else if (period.day === "Jumat") {
      translatedDay = "Friday";
    } else if (period.day === "Sabtu") {
      translatedDay = "Saturday";
    }

    return translatedDay === currentDay;
  });
  if (!periodsToday) return "-";

  const openTime = periodsToday.times[0].split("–")[0];
  const closeTime = periodsToday.times[0].split("–")[1];

  // openTime and closeTime is of type where 1pm is 13.00 and 12am is 00.00
  // return either Closes at time or Opens at time
  //  keep in mind openTime and closeTime is in 24 hour format and is a string, and that currentTime is also a string
  if (openTime == "Buka 24 jam") {
    return "Open 24 hours";
  } else if (currentTime > openTime && currentTime < closeTime) {
    return `Open until ${closeTime}`;
  } else {
    return `Closed until ${periodsToday.times[0].split("-")[0]}`;
  }
}

const ratings = ["2.0", "2.5", "3.0", "3.5", "4.0", "4.5"];

export default function Home() {
  const supabase = createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const [selectedRating, setSelectedRating] = useState<string>("any rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [enableNearbySearch, setEnableNearbySearch] = useState(false);
  const [showFranchises, setShowFranchises] = useState(true);

  const {
    coords,
    getPosition,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated({
    suppressLocationOnMount: true,
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    watchLocationPermissionChange: true,
  });

  const debounced = useDebouncedCallback((value) => {
    setSearchQuery(value);
  }, 1000);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useCafesQuery(
    supabase,
    selectedRating,
    searchQuery,
    enableNearbySearch,
    showFranchises,
    coords
  );

  return (
    <>
      <div className="flex gap-2 justify-end w-[90vw]">
        <div className="flex items-center space-x-2 px-1 py-2 rounded-md">
          <Checkbox
            defaultChecked={false}
            onCheckedChange={(isNearbySearch) => {
              getPosition();
              setEnableNearbySearch(
                isNearbySearch === "indeterminate" ? false : isNearbySearch
              );
            }}
          />
          <div className="flex flex-col gap-1">
            <p className="text-xs">Nearby Cafes</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 px-1 py-2 rounded-md">
          <Checkbox
            defaultChecked={true}
            onCheckedChange={(isShowFranchices) => {
              getPosition();
              setShowFranchises(
                isShowFranchices === "indeterminate" ? false : isShowFranchices
              );
            }}
          />
          <div className="flex flex-col gap-1">
            <p className="text-xs">
              {/* text indicating whether to show franchises/branches/chains or not */}
              Show Franchises
            </p>
          </div>
        </div>
        <Select
          onValueChange={(ratingSelected) => {
            setSelectedRating(ratingSelected);
          }}
        >
          <SelectTrigger className="w-40 text-xs md:text-xs">
            <SelectValue
              placeholder="Review Count"
              className=""
              asChild
            ></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"any count"}>
              <p className="font-semibold text-base">Any</p>
            </SelectItem>
            <SelectItem value={"50"} className="">
              <span className="font-semibold text-base text-slate-800">
                50+ Reviews
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(ratingSelected) => {
            setSelectedRating(ratingSelected);
          }}
        >
          <SelectTrigger className="w-40 text-xs">
            <SelectValue placeholder="Rating" className="" asChild>
              <div className="flex gap-1 items-center">
                {selectedRating === "any rating" ? (
                  <>
                    <StarIcon className="w-4 h-4 text-slate-900" />
                    <p>Rating</p>
                  </>
                ) : (
                  <>
                    <p>{selectedRating}+</p>
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                  </>
                )}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"any rating"}>
              <p className="font-semibold text-base">Any</p>
            </SelectItem>
            {ratings.map((rating) => (
              <SelectItem
                value={rating}
                textValue={`${rating}+`}
                key={rating}
                className="flex justify-between"
              >
                <span className="font-semibold text-base text-slate-800">
                  {rating}+
                </span>{" "}
                <Rating
                  SVGclassName="inline-block mb-1"
                  allowFraction={true}
                  size={20}
                  readonly
                  initialValue={Number(rating)}
                  fillColorArray={fillColorArray}
                />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Cari Kafe"
          className="max-w-sm text-xs"
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchQuery("");
            } else {
              debounced(e.target.value);
            }
          }}
        />
      </div>
      {/* Render your data here */}
      {status === "loading" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error loading cafes</div>
      ) : (
        <div className="grow relative">
          <ScrollArea className="h-[80svh] w-[90vw] rounded-md">
            {/* Render your list of cafes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.map((cafe) => (
                    <Link className="group" href={`/${cafe.id}`} key={cafe.id}>
                      <Card className="h-full flex flex-col">
                        {cafe.photo_urls && cafe.photo_urls.length > 0 ? (
                          <div className="w-full relative pt-[100%] overflow-hidden rounded-t-xl border border-slate-400 ">
                            {cafe.photo_urls[0]}
                            <Image
                              src={cafe.photo_urls[0]}
                              alt={`Photo of ${cafe.name}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="w-full h-full transition top-0 left-0 object-cover filter brightness-80 group-hover:opacity-90"
                            />
                          </div>
                        ) : (
                          // same aspect ratio as image but with a background color
                          <div className="w-full relative pt-[100%] overflow-hidden rounded-t-xl transition border border-stone-400 bg-stone-300 group-hover:bg-stone-200">
                            <div className="absolute inset-0 flex items-center justify-center ">
                              <p className="text-slate-900 font-semibold">
                                No Image
                              </p>
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-1">
                          <CardTitle>{cafe.name}</CardTitle>
                          {cafe.rating && (
                            <CardDescription className="flex items-baseline gap-1">
                              <span className="font-semibold text-base text-slate-800">
                                {cafe.rating}
                              </span>{" "}
                              <Rating
                                SVGclassName="inline-block mb-1"
                                allowFraction={true}
                                size={20}
                                readonly
                                initialValue={cafe.rating}
                                fillColorArray={fillColorArray}
                              />
                              <span className="text-slate-400">
                                ({cafe.user_ratings_total})
                              </span>
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 grow">
                          <p className="text-xs font-medium">
                            {getOpeningStatus(cafe.opening_hours)}
                          </p>
                          <p className="text-xs max-w-md">
                            {cafe.vicinity ||
                              (cafe.formatted_address &&
                                cafe.formatted_address
                                  .split(",")
                                  .slice(0, 3)
                                  .join(","))}
                          </p>
                        </CardContent>
                        <CardFooter className="flex">
                          {cafe.website && (
                            <Button variant={"link"} className="p-0 flex gap-1">
                              {cafe.website.split("/")[2].slice(0, 30)}
                              <ExternalLinkIcon className="w-4 h-4 " />
                            </Button>
                          )}
                          {(cafe as any).dist_meters}
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </Fragment>
              ))}
            </div>
            {/* Render a button to load more items */}
            <button
              className="pt-4"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </button>
          </ScrollArea>
        </div>
      )}
    </>
  );
}
