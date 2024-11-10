import { useCafes } from "@/hooks/use-cafes";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  BriefcaseIcon,
  UmbrellaIcon,
  WifiIcon,
  HeartIcon,
  ArmchairIcon,
  PlugIcon,
  CoffeeIcon,
  UtensilsIcon,
  ScaleIcon,
  CarIcon,
  LucideProps,
  ImageIcon,
  Loader2Icon,
} from "lucide-react";
import React, {
  useCallback,
  RefObject,
  useState,
  useEffect,
  useRef,
  memo,
  Suspense,
} from "react";
import useMedia from "react-use/esm/useMedia";
import { useStore } from "../../store";
import { MeiliSearchCafe } from "../../types";
import { Badge, BadgeProps } from "../catalyst/badge";
import { MapRef } from "react-map-gl";
import { MobileSearchFilters } from "./mobile-search-filters";
import { useImage } from "react-image";
import { ErrorBoundary } from "react-error-boundary";

interface CafeListProps {
  searchInput: string;
  setIsOpen: (x: boolean) => void;
  isOpen: boolean;
  inputRef: RefObject<HTMLInputElement>;
  containerRef?: RefObject<HTMLDivElement>;
}

const attributeMapping = {
  wifi_quality: {
    "Fast and Reliable": "WiFi Cepat",
    Decent: "WiFi OK",
    Unreliable: "WiFi Lambat",
    "No WiFi": "Tanpa WiFi",
  },
  outdoor_seating: {
    Ample: "Outdoor Luas",
    Limited: "Outdoor Terbatas",
    None: "Tanpa Outdoor",
  },
  comfort_level: {
    Comfortable: "Nyaman",
    Luxurious: "Sangat Nyaman",
    Adequate: "Cukup Nyaman",
    Minimal: "Kurang Nyaman",
  },
  work_suitability: {
    Excellent: "WFC Enak",
    Good: "WFC OK",
    Tolerable: "WFC Cukup",
    "Not Suitable": "Bukan untuk WFC",
  },
  seating_capacity: {
    Spacious: "Tempat Luas",
    Moderate: "Tempat Cukup",
    Limited: "Tempat Terbatas",
  },
  outlet_availability: {
    Plentiful: "Banyak Colokan",
    Adequate: "Colokan Cukup",
    Scarce: "Colokan Terbatas",
    "None Visible": "Tanpa Colokan",
  },
  coffee_quality: {
    Excellent: "Kopi Enak",
    Good: "Kopi OK",
    Average: "Kopi Biasa",
    Subpar: "Kopi Kurang",
  },
  non_coffee_options: {
    Excellent: "Non-Kopi Enak",
    Good: "Non-Kopi OK",
    Average: "Non-Kopi Biasa",
    Subpar: "Non-Kopi Kurang",
  },
  food_options: {
    Excellent: "Makanan Enak",
    Good: "Makanan OK",
    Average: "Makanan Biasa",
    Subpar: "Makanan Kurang",
  },
  price_quality_ratio: {
    "Excellent Value": "Harga Murah",
    "Good Value": "Harga OK",
    Fair: "Harga Wajar",
    Overpriced: "Harga Mahal",
  },
  has_musholla: {
    Yes: "Ada Musholla",
    No: "Tanpa Musholla",
  },
  parking_options: {
    "Ample Parking": "Parkir Luas",
    "Adequate Parking": "Parkir Cukup",
    "Limited Street Parking": "Parkir Terbatas",
    "No Parking": "Tanpa Parkir",
  },
  cleanliness: {
    Spotless: "Sangat Bersih",
    Clean: "Bersih",
    Acceptable: "Cukup Bersih",
    "Needs Improvement": "Kurang Bersih",
  },
  restroom_quality: {
    "Exceptionally Clean": "Toilet Sangat Bersih",
    Clean: "Toilet Bersih",
    Acceptable: "Toilet Cukup",
    "Needs Improvement": "Toilet Kurang",
    "No Restroom": "Tanpa Toilet",
  },
  accessibility: {
    "Fully Accessible": "Akses Mudah",
    "Partially Accessible": "Akses Cukup",
    "Not Accessible": "Akses Sulit",
  },
  instagram_worthiness: {
    "Very Instagrammable": "Instagramable",
    "Somewhat Photogenic": "Cukup Fotogenik",
    "Not Particularly": "Kurang Fotogenik",
  },
  pet_friendly: {
    yes: "Ramah Hewan",
    no: "Tidak Ramah Hewan",
  },
};

// Add these type definitions
type AttributeKey = keyof typeof attributeMapping;

interface Attribute {
  key: AttributeKey;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: BadgeProps["color"];
}

interface FilterButton {
  label: string;
  filter: { name: string; values: string[] };
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  activeColor: string;
}

// Update the CafeListItem props interface
interface CafeListItemProps {
  cafe: MeiliSearchCafe;
  handleCafeClick: (cafe: MeiliSearchCafe) => void;
}

// Update the AttributeBadge component
const AttributeBadge: React.FC<{
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value: string;
  color: BadgeProps["color"];
}> = ({ icon: Icon, value, color }) => (
  <Badge
    color={color}
    className="text-xs flex items-center gap-1 px-2 py-1 whitespace-nowrap h-min"
  >
    <Icon size={12} />
    <span>{value}</span>
  </Badge>
);

// Add these new components and functions
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
  <div className="flex flex-col items-center justify-center h-full w-full bg-gray-200 text-gray-400">
    <ImageIcon size={24} />
    <p className="mt-2 text-xs">Failed to load image</p>
  </div>
);

const ImageLoader = () => (
  <div className="flex items-center justify-center h-full w-full bg-gray-200">
    <Loader2Icon className="animate-spin text-gray-400" size={24} />
  </div>
);

// Update the CafeListItem component
const CafeListItem: React.FC<CafeListItemProps> = memo(
  ({ cafe, handleCafeClick }) => {
    const attributes: Attribute[] = [
      { key: "wifi_quality", icon: WifiIcon, color: "indigo" },
      { key: "outdoor_seating", icon: UmbrellaIcon, color: "green" },
      { key: "comfort_level", icon: HeartIcon, color: "pink" },
      { key: "work_suitability", icon: BriefcaseIcon, color: "amber" },
      { key: "seating_capacity", icon: ArmchairIcon, color: "purple" },
      { key: "outlet_availability", icon: PlugIcon, color: "blue" },
      { key: "coffee_quality", icon: CoffeeIcon, color: "yellow" },
      { key: "non_coffee_options", icon: CoffeeIcon, color: "yellow" },
      { key: "food_options", icon: UtensilsIcon, color: "orange" },
      { key: "price_quality_ratio", icon: ScaleIcon, color: "teal" },
      { key: "has_musholla", icon: UtensilsIcon, color: "orange" },
      { key: "parking_options", icon: CarIcon, color: "red" },
    ];

    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
    const [imageDimensions, setImageDimensions] = useState<
      { width: number; height: number }[]
    >([]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = imageRefs.current.indexOf(
                entry.target as HTMLDivElement
              );
              if (index !== -1) {
                setLoadedImages((prev) => {
                  const newLoadedImages = [...prev];
                  newLoadedImages[index] = true;
                  return newLoadedImages;
                });
              }
            }
          });
        },
        { root: null, rootMargin: "0px", threshold: 0.1 }
      );

      imageRefs.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, []);

    useEffect(() => {
      const loadImageDimensions = async () => {
        const dimensions = await Promise.all(
          cafe.images.map(
            (image) =>
              new Promise<{ width: number; height: number }>((resolve) => {
                const img = new Image();
                img.onload = () => {
                  resolve({ width: img.width, height: img.height });
                };
                img.src = `${image}?height=96&sharpen=true`;
              })
          )
        );
        setImageDimensions(dimensions);
      };

      loadImageDimensions();
    }, [cafe.images]);

    const containerHeight = 96; // Fixed container height

    return (
      <div
        onClick={() => handleCafeClick(cafe)}
        className="flex flex-col gap-2 justify-between p-4 border-b grab border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors cursor-pointer"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="grid grid-rows-[auto_min-content] gap-y-2 auto-cols-max grid-flow-col">
            <div className="flex gap-2">
              {cafe.images.map((image, index) => {
                const aspectRatio = imageDimensions[index]
                  ? imageDimensions[index].width / imageDimensions[index].height
                  : 1;
                const imageWidth = containerHeight * aspectRatio;

                return (
                  <div
                    key={image.url}
                    ref={(el) => (imageRefs.current[index] = el)}
                    className="flex-shrink-0"
                    style={{
                      height: `${containerHeight}px`,
                      width: `${imageWidth}px`,
                    }}
                  >
                    {loadedImages[index] && (
                      <ErrorBoundary fallback={<ImageError />}>
                        <Suspense fallback={<ImageLoader />}>
                          <ImageWithSuspense
                            src={`${image.url}?height=96&sharpen=true`}
                            alt={cafe.name}
                            className="w-full h-full object-cover rounded-md shadow-sm"
                          />
                        </Suspense>
                      </ErrorBoundary>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 items-start">
              {attributes.map((attr, index) => {
                const key = `${attr.key}_mode` as keyof MeiliSearchCafe;
                const value = cafe[key];
                if (value) {
                  const mappedValue =
                    typeof value === "string" && attr.key in attributeMapping
                      ? attributeMapping[attr.key][
                          value as keyof (typeof attributeMapping)[typeof attr.key]
                        ] || value
                      : value;
                  return (
                    <AttributeBadge
                      key={attr.key}
                      icon={attr.icon}
                      value={mappedValue as string}
                      color={attr.color}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        <div className="grow overflow-hidden">
          <p className="font-semibold text-nowrap text-ellipsis dark:text-white">
            {cafe.name}
          </p>
          <div className="flex gap-2 my-1">
            <Badge color="red" className="text-xs shrink-0">
              {cafe.gmaps_rating} ★ (
              {cafe.gmaps_total_reviews.toLocaleString("id-ID")})
            </Badge>
            {cafe.avg_rating > 0 && (
              <Badge color="red" className="text-xs shrink-0">
                Our rating: {cafe.avg_rating} ({cafe.review_count})
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis text-nowrap overflow-hidden">
            {cafe.address}
          </p>
        </div>
      </div>
    );
  }
);

export const MobileCafeList: React.FC<CafeListProps> = ({
  searchInput,
  setIsOpen,
  isOpen,
  inputRef,
  containerRef,
}) => {
  // Update the useStore hook to include proper types
  const { selectCafe, mapRef, mapCenter, searchFilters, setSearchFilters } =
    useStore((state) => ({
      selectCafe: state.selectCafe,
      mapRef: state.mapRef as React.RefObject<MapRef>,
      mapCenter: state.mapCenter,
      searchFilters: state.searchFilters,
      setSearchFilters: state.setSearchFilters,
    }));

  const isWide = useMedia("(min-width: 640px)");
  const localParentRef = useRef<HTMLDivElement>(null);
  const parentRef = containerRef || localParentRef;

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCafes(mapCenter.lat, mapCenter.long, searchInput);

  const allCafes = data?.pages.flatMap((page) => page.hits) ?? [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allCafes.length + 1 : allCafes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 250, // Increased from 200 to 250
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allCafes.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allCafes.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  const handleCafeClick = useCallback(
    (cafe: MeiliSearchCafe) => {
      selectCafe(cafe);
      mapRef?.current?.flyTo({
        center: [cafe._geo.lng!, cafe._geo.lat!],
        zoom: 14,
      });
    },
    [selectCafe, mapRef, isWide]
  );

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      inputRef.current?.blur();
    }, 100);
  };

  const filterButtons: FilterButton[] = [
    {
      label: "WiFi Cepat",
      filter: { name: "wifi_quality", values: ["Fast and Reliable"] },
      icon: WifiIcon,
      color: "bg-indigo-100 text-indigo-700",
      activeColor: "bg-indigo-600 text-white",
    },
    {
      label: "Outdoor Luas",
      filter: { name: "outdoor_seating", values: ["Ample"] },
      icon: UmbrellaIcon,
      color: "bg-green-100 text-green-700",
      activeColor: "bg-green-600 text-white",
    },
    {
      label: "Nyaman",
      filter: { name: "comfort_level", values: ["Comfortable", "Luxurious"] },
      icon: HeartIcon,
      color: "bg-pink-100 text-pink-700",
      activeColor: "bg-pink-600 text-white",
    },
    {
      label: "WFC enak",
      filter: { name: "work_suitability", values: ["Good", "Excellent"] },
      icon: BriefcaseIcon,
      color: "bg-amber-100 text-amber-700",
      activeColor: "bg-amber-600 text-white",
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="z-30 pointer-events-auto absolute inset-x-0 top-16 bottom-14 flex flex-col p-4">
      <div className="size-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl max-h-full flex flex-col relative">
        {/* Updated Header with Scrollable Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <MobileSearchFilters />
        </div>

        {/* Cafe List */}
        <div ref={parentRef} className="flex-grow overflow-y-auto pb-16">
          {searchInput && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Showing results for "{searchInput}"
              </p>
            </div>
          )}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const cafe = allCafes[virtualRow.index];
              const isLoaderRow = virtualRow.index > allCafes.length - 1;

              return (
                <div
                  key={virtualRow.index}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <div className="p-4 text-center">Loading more...</div>
                    ) : (
                      <div className="p-4 text-center">
                        No more cafes to load
                      </div>
                    )
                  ) : (
                    <CafeListItem
                      cafe={cafe}
                      handleCafeClick={handleCafeClick}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {isFetching && (
          <div className="flex-shrink-0 p-2 text-center">Updating...</div>
        )}
      </div>
    </div>
  );
};
