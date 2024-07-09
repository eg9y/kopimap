import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { useStore } from "../store";
import { Heading } from "./catalyst/heading";
import { Badge, BadgeButton } from "./catalyst/badge";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  MapPinIcon,
  PlusIcon,
  EditIcon,
  MinusIcon,
} from "lucide-react";
import { cn } from "./lib/utils";
import { Rate } from "./rate";
import { CafeImages } from "./cafe-images";
import { Button } from "./catalyst/button";
import { SubmitReviewDialog } from "./submit-review-dialog";
import { reviewAttributes } from "./lib/review-attributes";
import { useUser } from "./lib/use-user";
import { useCafeAggregatedReview } from "../hooks/use-cafes";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./lib/database.types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const CafeDetails = () => {
  const { selectedCafe, expandDetails, setExpandDetails } = useStore();
  const [letsParty, setLetsParty] = useState(false);
  const [openSubmitReviewDialog, setOpenSubmitReviewDialog] = useState(false);
  const { width, height } = useWindowSize();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });
  const { loggedInUser } = useUser();
  const [userReview, setUserReview] = useState<
    Database["public"]["Tables"]["reviews"]["Row"] | null
  >(null);
  const { data: aggregatedReview } = useCafeAggregatedReview(
    selectedCafe ? selectedCafe.place_id : null
  );

  useEffect(() => {
    const fetchUserReview = async () => {
      if (loggedInUser && selectedCafe) {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", loggedInUser.id)
          .eq("cafe_id", selectedCafe.id)
          .single();

        if (error) {
          if (error.code !== "PGRST116") {
            console.error("Error fetching user review:", error);
          }
        } else {
          setUserReview(data);
        }
      }
    };

    fetchUserReview();
  }, [loggedInUser, selectedCafe]);

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

  const renderAggregatedReviews = () => {
    if (!aggregatedReview) return null;

    return (
      <div className="grid grid-cols-2 gap-2">
        {reviewAttributes.map((category) => (
          <div
            key={category.category}
            className={cn(
              "flex flex-col gap-4 rounded-md p-2",
              `bg-${category.color}-100`
            )}
          >
            <p
              className={cn(
                "text-base font-bold",
                category.color === "orange" && "text-orange-800",
                category.color === "blue" && "text-blue-800",
                category.color === "emerald" && "text-emerald-800",
                category.color === "purple" && "text-purple-800",
                category.color === "yellow" && "text-yellow-800",
                category.color === "fuchsia" && "text-fuchsia-800",
                category.color === "zinc" && "text-zinc-800"
              )}
            >
              {category.category}
            </p>
            <div className="flex flex-col">
              {category.attributes.map((attr) => {
                const modeKey = `${attr.name
                  .replace(/\s+/g, "_")
                  .toLowerCase()}_mode`;
                const value =
                  aggregatedReview[
                    modeKey as keyof Database["public"]["Tables"]["cafe_aggregated_reviews"]["Row"]
                  ];
                return (
                  <div key={attr.name} className="">
                    <div className={cn(`flex flex-col p-2 gap-2`, "w-full")}>
                      <div className="flex items-center gap-2">
                        {attr.icon && <attr.icon className="w-5 h-5" />}
                        <p
                          className={cn(
                            `text-base font-semibold`,
                            category.color === "orange" && "text-orange-500",
                            category.color === "blue" && "text-blue-500",
                            category.color === "emerald" && "text-emerald-500",
                            category.color === "purple" && "text-purple-500",
                            category.color === "yellow" && "text-yellow-500",
                            category.color === "fuchsia" && "text-fuchsia-500",
                            category.color === "zinc" && "text-zinc-500"
                          )}
                        >
                          {attr.name}
                        </p>
                      </div>
                      {value ? (
                        <div className="pl-6 flex items-center gap-1 flex-wrap">
                          <Badge color={category.color}>{value}</Badge>
                        </div>
                      ) : (
                        <MinusIcon
                          size={8}
                          className={cn(
                            "ml-7",
                            category.color === "orange" && "text-orange-800",
                            category.color === "blue" && "text-blue-800",
                            category.color === "emerald" && "text-emerald-800",
                            category.color === "purple" && "text-purple-800",
                            category.color === "yellow" && "text-yellow-800",
                            category.color === "fuchsia" && "text-fuchsia-800",
                            category.color === "zinc" && "text-zinc-800"
                          )}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <motion.div
        className={cn(
          "h-full overflow-scroll pointer-events-auto bg-slate-50 rounded-l-md z-[100] absolute ring-1 ring-slate-300 shadow-md flex flex-col gap-2",
          expandDetails ? "w-full" : "min-w-[300px] w-[30vw]"
        )}
        animate={{
          width: expandDetails ? "100%" : "30vw",
          minWidth: expandDetails ? "" : "300px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className={cn("flex gap-4 p-4 flex-col grow")}>
          {!expandDetails && selectedCafe.gmaps_featured_image && (
            <div className="w-full h-[200px]">
              <img
                src={selectedCafe.gmaps_featured_image}
                className="w-full object-cover h-full"
                alt={selectedCafe.name}
              />
            </div>
          )}
          <div
            className={cn(
              "w-full grow gap-4",
              expandDetails ? "grid grid-cols-2" : "flex flex-col"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="">
                <div className="flex items-center gap-4">
                  <Heading>{selectedCafe.name}</Heading>
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
                {expandDetails && (
                  <p className="text-balance">{selectedCafe.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                <Badge>
                  <img src="/instagram.svg" alt="Instagram" />
                </Badge>
                <Badge>
                  <img src="/whatsapp.svg" className="size-6" alt="WhatsApp" />
                </Badge>
                <Badge className="!gap-0">
                  <span className="p-1">
                    <img src="/phone.svg" className="size-4" alt="Phone" />
                  </span>
                  <span>{selectedCafe.phone}</span>
                </Badge>
                {selectedCafe.menu_link && (
                  <BadgeButton href={selectedCafe.menu_link}>Menu</BadgeButton>
                )}
              </div>
              <div className="flex gap-1">
                <BadgeButton
                  color="red"
                  href={selectedCafe.gmaps_link || ""}
                  disabled={!selectedCafe.gmaps_link}
                  target="_blank"
                >
                  GMaps
                </BadgeButton>
                <Badge>
                  <p>Google Rating</p>
                  <StarIcon className="size-4" />
                  <p>{selectedCafe.gmaps_rating}</p>
                  <p>({selectedCafe.gmaps_total_reviews})</p>
                </Badge>
                <Badge>{selectedCafe.price_range}</Badge>
                <Badge>Open {selectedCafe.workday_timings}</Badge>
              </div>
              <div className="p-2 rounded-md bg-blue-100">
                <p className="text-pretty text-xs">
                  <MapPinIcon className="size-4 inline" />{" "}
                  {selectedCafe.address}
                </p>
              </div>
              {expandDetails && (
                <CafeImages cafe={selectedCafe} expandDetails={expandDetails} />
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Heading className="mb-4">User Reviews</Heading>
                <Rate rating={aggregatedReview?.avg_rating ?? 0} />
                <p className="text-center mt-2">
                  Based on {aggregatedReview?.review_count ?? 0} reviews
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
                      Edit Your Review
                    </>
                  ) : (
                    <>
                      <PlusIcon size={16} />
                      Write a Review
                    </>
                  )}
                </Button>
                {userReview && (
                  <p className="text-center mt-2 text-sm text-emerald-600">
                    You've reviewed this café!
                  </p>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Heading className="mb-4">Ratings Breakdown</Heading>
                <div className="flex flex-col gap-2">
                  {renderAggregatedReviews()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <SubmitReviewDialog
        isOpen={openSubmitReviewDialog}
        setIsOpen={setOpenSubmitReviewDialog}
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
};
