"use client";

import { Database } from "@/lib/database.types";
import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
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
import { Fragment, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useDebounce, useDebouncedCallback } from "use-debounce";

function useCafesQuery(
  supabase: SupabaseClient<Database>,
  rating: string,
  searchQuery: string
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

    const response = await query;

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }

  return useInfiniteQuery(
    [
      "cafes",
      {
        rating,
        searchQuery,
      },
    ],
    ({ pageParam = 0 }) => fetchCafes({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return; // Assume no next page if last page is empty
        return allPages.length; // Use the number of fetched pages as the next page param
      },
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );
}

interface Time {
  day: number;
  time: string;
}

interface Period {
  open: Time;
  close: Time;
}

interface OpeningHours {
  periods: Period[];
  open_now: boolean;
  weekday_text: string[];
}

function convertTo12Hour(time: string): string {
  const hours24 = parseInt(time.slice(0, 2), 10);
  const minutes = time.slice(2);
  const hours12 = ((hours24 + 11) % 12) + 1;
  const amPm = hours24 >= 12 ? "PM" : "AM";
  return `${hours12}:${minutes} ${amPm}`;
}

function getOpeningStatus(openingHours: OpeningHours | null): string {
  if (!openingHours) return "Hours not available";

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const periodsToday = openingHours.periods.find(
    (period) => period.open.day === currentDay
  );
  if (!periodsToday) return "Closed today";

  if (
    periodsToday.open.time <= currentTime &&
    periodsToday.close.time > currentTime
  ) {
    const closingTime = convertTo12Hour(periodsToday.close.time);
    return `Closes at ${closingTime}`;
  } else {
    const openingTime = convertTo12Hour(periodsToday.open.time);
    return `Opens at ${openingTime}`;
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
  } = useCafesQuery(supabase, selectedRating, searchQuery);

  return (
    <main className="flex flex-col items-center w-full pt-4 gap-4">
      <div className="flex gap-2 justify-end w-[90vw]">
        <Select
          onValueChange={(ratingSelected) => {
            setSelectedRating(ratingSelected);
          }}
        >
          <SelectTrigger className="w-40">
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
              <p className="font-semibold text-base">Any rating</p>
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
          className="max-w-md"
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
          <ScrollArea className="h-[85svh] w-[90vw] rounded-md">
            {/* Render your list of cafes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.map((cafe) => (
                    <Link
                      className="group"
                      href={`/${cafe.place_id}`}
                      target="_blank"
                      key={cafe.id}
                    >
                      <Card className="h-full flex flex-col">
                        {cafe.photo_urls && cafe.photo_urls.length > 0 ? (
                          <div className="w-full relative pt-[100%] overflow-hidden rounded-t-xl border border-slate-400 ">
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
                          <p className="text-sm font-medium">
                            {getOpeningStatus(
                              cafe.opening_hours as unknown as OpeningHours
                            )}
                          </p>
                          <p className="text-sm max-w-md">{cafe.vicinity}</p>
                        </CardContent>
                        <CardFooter className="flex">
                          {cafe.website && (
                            <Button variant={"link"} className="p-0 flex gap-1">
                              {cafe.website.split("/")[2].slice(0, 30)}
                              <ExternalLinkIcon className="w-4 h-4 " />
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </Fragment>
              ))}
            </div>
            {/* Render a button to load more items */}
            <button
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
    </main>
  );
}
