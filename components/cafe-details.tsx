import { useI18nContext } from "@/src/i18n/i18n-react";
import { StarIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
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
	MinusIcon,
	PlusIcon,
} from "lucide-react";
import { siInstagram } from "simple-icons";

import type { LocalizedString } from "typesafe-i18n";
import { useCafeAggregatedReview } from "../hooks/use-cafe-aggregated-review";
import { useCafeDetailedInfo } from "../hooks/use-cafe-detailed-info";
import { useUser } from "../hooks/use-user";
import { useUserReview } from "../hooks/use-user-review";
import type { CafeDetailedInfo } from "../types";
import { CafeImages } from "./cafe-images";
import { Button } from "./catalyst/button";
import { reviewAttributes } from "./lib/review-attributes";
import { cn } from "./lib/utils";
import { Rate } from "./rate";
import { SubmitReviewDialog } from "./submit-review-dialog";

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

	const renderAggregatedReviews = () => {
		if (!cafeDetailedInfo) return null;

		return (
			<div className="grid grid-cols-2 gap-2">
				{reviewAttributes.map((category) => (
					<div
						key={category.category}
						className={cn(
							"flex flex-col rounded-md p-2 gap-2",
							category.color === "orange" && "bg-orange-100",
							category.color === "blue" && "bg-blue-100",
							category.color === "emerald" && "bg-emerald-100",
							category.color === "purple" && "bg-purple-100",
							category.color === "yellow" && "bg-yellow-100",
							category.color === "fuchsia" && "bg-fuchsia-100",
							category.color === "lime" && "bg-lime-100",
						)}
					>
						<p
							className={cn(
								"text-base font-bold letter leading-4 text-nowrap",
								category.color === "orange" && "text-orange-800",
								category.color === "blue" && "text-blue-800",
								category.color === "emerald" && "text-emerald-800",
								category.color === "purple" && "text-purple-800",
								category.color === "yellow" && "text-yellow-800",
								category.color === "fuchsia" && "text-fuchsia-800",
								category.color === "lime" && "text-lime-800",
							)}
						>
							{LL.categories[category.category as keyof typeof LL.categories]()}
						</p>
						<div className="flex flex-col gap-2">
							{category.attributes.map((attr) => {
								const modeKey =
									`${attr.name.toLowerCase()}_mode` as keyof CafeDetailedInfo;
								const value = cafeDetailedInfo[modeKey] as string;
								const attrName = attr.name as keyof typeof LL.attributes;

								let translation = value;
								if (
									value &&
									LL.attributes[attrName] &&
									"options" in LL.attributes[attrName]
								) {
									const options = LL.attributes[attrName].options as Record<
										string,
										() => LocalizedString
									>;
									Object.entries(options).forEach(([key, translationFn]) => {
										if (key.toLowerCase() === value.toLowerCase()) {
											translation = translationFn();
										}
									});
								}

								return (
									<div key={attr.name} className="">
										<div className={cn("flex flex-col gap-1 w-full")}>
											<div className="flex items-center gap-1">
												{attr.icon && (
													<attr.icon
														className={cn(
															"w-4 h-4",
															category.color === "orange" && "text-orange-500",
															category.color === "blue" && "text-blue-500",
															category.color === "emerald" &&
																"text-emerald-500",
															category.color === "purple" && "text-purple-500",
															category.color === "yellow" && "text-yellow-500",
															category.color === "fuchsia" &&
																"text-fuchsia-500",
															category.color === "lime" && "text-lime-500",
														)}
													/>
												)}
												<p
													className={cn(
														`text-xs font-semibold text-nowrap`,
														category.color === "orange" && "text-orange-500",
														category.color === "blue" && "text-blue-500",
														category.color === "emerald" && "text-emerald-500",
														category.color === "purple" && "text-purple-500",
														category.color === "yellow" && "text-yellow-500",
														category.color === "fuchsia" && "text-fuchsia-500",
														category.color === "lime" && "text-lime-500",
													)}
												>
													{LL.attributes[
														attr.name as keyof typeof LL.attributes
													].name()}
												</p>
											</div>
											<div className="pl-0 flex items-center gap-1 flex-wrap">
												{value ? (
													<Badge color={category.color}>{translation}</Badge>
												) : (
													<Badge color={category.color} className="opacity-50">
														<MinusIcon size={20} />
													</Badge>
												)}
											</div>
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
					"h-full top-0 overflow-y-scroll pointer-events-auto bg-slate-50 rounded-l-md z-[100] absolute ring-1 ring-slate-300 shadow-md flex flex-col gap-2",
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
				<div className={cn("flex gap-4 p-4 flex-col grow")}>
					{cafeDetailedInfo && (
						<>
							{!expandDetails &&
								(cafeDetailedInfo.gmaps_featured_image ||
									cafeDetailedInfo.hosted_gmaps_images ||
									cafeDetailedInfo.all_image_urls) && (
									<div className="w-full h-[200px]">
										<img
											src={
												cafeDetailedInfo.all_image_urls &&
												cafeDetailedInfo.all_image_urls.length > 0
													? cafeDetailedInfo.all_image_urls[0]
													: ((cafeDetailedInfo.hosted_gmaps_images as
															| string[]
															| undefined) &&
															(cafeDetailedInfo.hosted_gmaps_images as string[])
																.length > 0 &&
															(
																cafeDetailedInfo.hosted_gmaps_images as string[]
															)[0]) ||
														cafeDetailedInfo.gmaps_featured_image!
											}
											className="w-full object-contain h-full"
											alt={cafeDetailedInfo.name!}
										/>
									</div>
								)}
							<div
								className={cn(
									"w-full grow gap-4",
									expandDetails ? "grid grid-cols-2" : "flex flex-col",
								)}
							>
								<div className="flex flex-col gap-2">
									<div className="">
										<div className="flex items-center gap-4">
											<Heading>{cafeDetailedInfo.name}</Heading>
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
											<p className="text-balance">
												{cafeDetailedInfo.description}
											</p>
										)}
									</div>

									<div className="flex gap-2">
										<div className="flex flex-col justify-around">
											<div className="flex items-center gap-1 flex-wrap">
												{/* <Badge>
                      <img src="/instagram.svg" alt="Instagram" />
                    </Badge>
                    <Badge>
                      <img
                        src="/whatsapp.svg"
                        className="size-6"
                        alt="WhatsApp"
                      />
                    </Badge>
                    <Badge className="!gap-0">
                      <span className="p-1">
                        <img src="/phone.svg" className="size-4" alt="Phone" />
                      </span>
                      <span>{cafeDetailedInfo.phone}</span>
                    </Badge> */}
												{cafeDetailedInfo.menu_link && (
													<BadgeButton href={cafeDetailedInfo.menu_link}>
														Menu
													</BadgeButton>
												)}
											</div>
											<div className="flex gap-1 flex-wrap">
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
												{cafeDetailedInfo.website &&
													isInstagramLink(cafeDetailedInfo.website) && (
														<BadgeButton
															color="fuchsia"
															href={cafeDetailedInfo.website}
															target="_blank"
															className="flex items-center justify-center"
														>
															<svg
																viewBox="0 0 24 24"
																className="w-5 fill-pink-700"
															>
																<path d={siInstagram.path} />
															</svg>
														</BadgeButton>
													)}
												{cafeDetailedInfo.website &&
													!isInstagramLink(cafeDetailedInfo.website) && (
														<BadgeButton
															color="fuchsia"
															href={cafeDetailedInfo.website}
															target="_blank"
															className="flex items-center justify-center"
														>
															website
														</BadgeButton>
													)}
												{cafeDetailedInfo.price_range && (
													<Badge>{cafeDetailedInfo.price_range}</Badge>
												)}
												<Badge className="text-nowrap">
													Open {cafeDetailedInfo.workday_timings}
												</Badge>
											</div>
											<div className="p-2 rounded-md bg-blue-100">
												<p className="text-pretty text-xs">
													<MapPinIcon className="size-4 inline" />{" "}
													{cafeDetailedInfo.address}
												</p>
											</div>
										</div>
										<div className="flex flex-col gap-4">
											<div className="bg-white p-4 rounded-lg shadow-md">
												<Heading className="">
													{LL.cafeDetails.userReviews()}
												</Heading>

												<Rate rating={aggregatedReview?.avg_rating ?? 0} />
												<p className="text-center mt-2">
													{LL.basedOnReviews({
														count: aggregatedReview?.review_count ?? 0,
													})}
													{aggregatedReview?.review_count &&
														aggregatedReview?.review_count > 0 && (
															<>
																Last review:{" "}
																{new Date(
																	aggregatedReview?.last_updated!,
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
									</div>
									<div className="bg-white p-4 rounded-lg shadow-md">
										<Heading className="mb-2">{LL.ratingsBreakdown()}</Heading>
										<div className="flex flex-col gap-2">
											{renderAggregatedReviews()}
										</div>
									</div>
									{expandDetails && (
										<CafeImages
											cafe={cafeDetailedInfo}
											expandDetails={expandDetails}
										/>
									)}
								</div>
							</div>
						</>
					)}
					{!cafeDetailedInfo && (
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
