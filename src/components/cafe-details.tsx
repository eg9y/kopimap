// components/CafeDetails.tsx
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
  PinIcon,
} from "lucide-react";
import { cn } from "./lib/utils";
import { Rate } from "./rate";
import { CafeImages } from "./cafe-images";
import { Button } from "./catalyst/button";
import { useRef, useState } from "react";

type Attribute = {
  name: string;
  options: string[];
  icon: string;
};

type CategoryAttributes = {
  color:
    | "orange"
    | "blue"
    | "emerald"
    | "purple"
    | "fuchsia"
    | "zinc"
    | "cyan"
    | "green"
    | "indigo"
    | "lime"
    | "pink"
    | "red"
    | "teal"
    | "violet"
    | "yellow"
    | "amber"
    | "sky"
    | "rose"
    | undefined;
  category: string;
  attributes: Attribute[];
};

const cafeAttributes: CategoryAttributes[] = [
  {
    color: "orange",
    category: "Atmosphere",
    attributes: [
      {
        name: "Overall Vibe",
        options: ["Relaxed", "Energetic", "Cozy", "Modern", "Artistic"],
        icon: "HomeIcon",
      },
      {
        name: "Seating Comfort",
        options: ["Basic", "Comfortable", "Luxurious"],
        icon: "ArmchairIcon",
      },
    ],
  },
  {
    color: "blue",
    category: "Work-Friendly",
    attributes: [
      {
        name: "WiFi Reliability",
        options: ["No WiFi", "Unreliable", "Mostly Reliable", "Very Reliable"],
        icon: "WifiIcon",
      },
      {
        name: "Power Outlets",
        options: ["None Visible", "Limited", "Plenty"],
        icon: "PlugIcon",
      },
      {
        name: "Work Space",
        options: ["Not Suitable", "Okay", "Good", "Excellent"],
        icon: "BriefcaseIcon",
      },
    ],
  },
  {
    color: "emerald",
    category: "Food & Drinks",
    attributes: [
      {
        name: "Coffee Quality",
        options: ["Poor", "Average", "Good", "Excellent"],
        icon: "CoffeeIcon",
      },
      {
        name: "Non-Coffee Options",
        options: ["Very Limited", "Some Options", "Great Variety"],
        icon: "CupSodaIcon",
      },
      {
        name: "Food Options",
        options: ["No Food", "Snacks Only", "Light Meals", "Full Menu"],
        icon: "UtensilsIcon",
      },
    ],
  },
  // {
  //   color: "purple",
  //   category: "Service",
  //   attributes: [
  //     {
  //       name: "Staff Attitude",
  //       options: ["Unfriendly", "Neutral", "Friendly", "Very Welcoming"],
  //       icon: "SmileIcon",
  //     },
  //     {
  //       name: "Order Accuracy",
  //       options: ["Poor", "Okay", "Good", "Excellent"],
  //       icon: "CheckCircleIcon",
  //     },
  //   ],
  // },
  {
    color: "purple",
    category: "Value",
    attributes: [
      {
        name: "Value for Money",
        options: ["Poor", "Fair", "Good", "Excellent"],
        icon: "ScaleIcon",
      },
    ],
  },
  {
    color: "fuchsia",
    category: "Facilities",
    attributes: [
      {
        name: "Cleanliness",
        options: ["Poor", "Acceptable", "Clean", "Very Clean"],
        icon: "SparklesIcon",
      },
      {
        name: "Bathroom Availability",
        options: ["No Bathroom", "For Customers", "Public Access"],
        icon: "ShowerHeadIcon",
      },
      {
        name: "Accessibility",
        options: ["Not Accessible", "Partially Accessible", "Fully Accessible"],
        icon: "AccessibilityIcon",
      },
    ],
  },
  {
    color: "zinc",
    category: "Special Features",
    attributes: [
      {
        name: "Outdoor Seating",
        options: ["None", "Limited", "Ample"],
        icon: "SunIcon",
      },
      {
        name: "Instagram-worthy",
        options: ["Not Really", "Somewhat", "Very"],
        icon: "CameraIcon",
      },
      {
        name: "Pet-friendly",
        options: ["no", "meow"],
        icon: "StarIcon",
      },
      {
        name: "Unique Offering",
        options: ["Standard", "Interesting", "Very Unique"],
        icon: "StarIcon",
      },
    ],
  },
];

export const CafeDetails = () => {
  const { selectedCafe, expandDetails, setExpandDetails } = useStore();
  const [letsParty, setLetsParty] = useState(false);
  const { width, height } = useWindowSize();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });

  if (!selectedCafe) return null;

  const handleBeenHereClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setConfettiPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setLetsParty(true);
  };

  const renderAttribute = (attr: CategoryAttributes) => {
    return (
      <div
        key={attr.category}
        className={cn(
          `flex flex-col p-2 gap-2 rounded-md`,
          attr.color === "orange" && "bg-orange-100",
          attr.color === "blue" && "bg-blue-100",
          attr.color === "emerald" && "bg-emerald-100",
          attr.color === "purple" && "bg-purple-100",
          attr.color === "yellow" && "bg-yellow-100",
          attr.color === "fuchsia" && "bg-fuchsia-100",
          attr.color === "zinc" && "bg-zinc-100",
          "w-full"
        )}
      >
        <p className={`text-sm font-semibold text-${attr.color}-800`}>
          {attr.category}
        </p>
        {attr.attributes.map((attribute) => (
          <div key={attribute.name} className="flex flex-col gap-1">
            <p className="text-xs font-medium">{attribute.name}</p>
            <div className="flex items-center gap-1">
              {attribute.options.map((option) => (
                <Badge key={option} color={attr.color}>
                  {option}
                </Badge>
              ))}
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
          {!expandDetails && (
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
                  href={selectedCafe.gmaps_link}
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Button
                  color="emerald"
                  className="cursor-pointer"
                  onClick={handleBeenHereClick}
                  ref={buttonRef}
                >
                  Been here!
                  <PinIcon size={16} />
                </Button>
                <Rate />
              </div>

              <div className="flex flex-wrap gap-2">
                {cafeAttributes.map(renderAttribute)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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
