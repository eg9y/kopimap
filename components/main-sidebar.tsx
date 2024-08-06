import React, { useState } from "react";
import { Avatar } from "./catalyst/avatar";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "./catalyst/dropdown";
import { Heading } from "./catalyst/heading";
import { Input, InputGroup } from "./catalyst/input";

import { useI18nContext } from "@/src/i18n/i18n-react";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Cog8ToothIcon,
	LightBulbIcon,
	ShieldCheckIcon,
	UserIcon,
} from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { createClient } from "@supabase/supabase-js";
import useDebounce from "react-use/esm/useDebounce";
import { useCafes } from "../hooks/use-cafes";
import { useMapCafes } from "../hooks/use-map-cafes";
import { useUser } from "../hooks/use-user";
import { useStore } from "../store";
import { CafeList } from "./cafe-list";
import { Button } from "./catalyst/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "./catalyst/dialog";
import { Field, Label } from "./catalyst/fieldset";
import {
	Navbar,
	NavbarItem,
	NavbarSection,
	NavbarSpacer,
} from "./catalyst/navbar";
import {
	Sidebar,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarSection,
	SidebarSpacer,
} from "./catalyst/sidebar";
import { SidebarLayout } from "./catalyst/sidebar-layout";
import { Text } from "./catalyst/text";
import { LanguageSwitcher } from "./language-switcher";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface MainSidebarProps {
	children: React.ReactNode;
}

export default function MainSidebar({ children }: MainSidebarProps) {
	const { LL } = useI18nContext();
	const [isOpen, setIsOpen] = React.useState(false);
	const [isFeatureRoadmapOpen, setIsFeatureRoadmapOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const {
		mapCenter,
		setOpenFilters,
		openFilters,
		searchFilters,
		setSearchFilters,
	} = useStore();
	const { loggedInUser } = useUser();

	const {
		data: searchCafes,
		isLoading: isSearchLoading,
		error: searchError,
	} = useCafes(mapCenter.lat, mapCenter.long, debouncedSearchTerm);
	const {
		data: mapCafesData,
		isLoading: isMapCafesLoading,
		error: mapCafesError,
	} = useMapCafes(mapCenter.lat, mapCenter.long);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	useDebounce(
		() => {
			setDebouncedSearchTerm(searchInput);
		},
		300,
		[searchInput],
	);

	const handleRatingChange = (value: string) => {
		if (value) {
			setSearchFilters({ ...searchFilters, gmaps_rating: value });
		} else {
			const newFilters = { ...searchFilters };
			delete newFilters.gmaps_rating;
			setSearchFilters(newFilters);
		}
	};

	const handleTotalReviewsChange = (value: string) => {
		if (value) {
			setSearchFilters({ ...searchFilters, gmaps_total_reviews: value });
		} else {
			const newFilters = { ...searchFilters };
			delete newFilters.gmaps_total_reviews;
			setSearchFilters(newFilters);
		}
	};

	return (
		<>
			<SidebarLayout
				navbar={
					<Navbar>
						<NavbarSpacer />
						<NavbarSection>
							<NavbarItem aria-label={LL.searchCafes()}>
								<MagnifyingGlassIcon />
							</NavbarItem>
							<Dropdown>
								<DropdownButton as={NavbarItem}>
									<Avatar src="/profile-photo.jpg" square />
								</DropdownButton>
								<DropdownMenu className="min-w-64" anchor="bottom end">
									<DropdownItem href="/my-profile">
										<UserIcon />
										<DropdownLabel>My profile</DropdownLabel>
									</DropdownItem>
									<DropdownItem href="/settings">
										<Cog8ToothIcon />
										<DropdownLabel>Settings</DropdownLabel>
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem href="/privacy-policy">
										<ShieldCheckIcon />
										<DropdownLabel>Privacy policy</DropdownLabel>
									</DropdownItem>
									<DropdownItem href="/share-feedback">
										<LightBulbIcon />
										<DropdownLabel>Share feedback</DropdownLabel>
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem href="/logout">
										<ArrowRightStartOnRectangleIcon />
										<DropdownLabel>Sign out</DropdownLabel>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</NavbarSection>
					</Navbar>
				}
				sidebar={
					<Sidebar>
						<SidebarHeader>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col">
									<div>
										<div className="flex items-center space-x-4">
											<Heading>KopiMap</Heading>
											<LanguageSwitcher />
										</div>
										<Text>{LL.appDescription()}</Text>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex gap-2 w-full">
									<InputGroup className="">
										<MagnifyingGlassIcon />
										<Input
											name="search"
											placeholder={LL.searchCafes()}
											aria-label={LL.searchCafes()}
											onChange={handleSearch}
											value={searchInput}
											autoComplete="off"
											className="w-[calc(300px_-_2rem)]"
										/>
									</InputGroup>
									{searchInput && (
										<Button
											plain
											aria-label="Clear search"
											className="cursor-pointer"
											onClick={() => {
												setSearchInput("");
												setDebouncedSearchTerm("");
											}}
										>
											<XMarkIcon className="h-5 w-5" />
										</Button>
									)}
								</div>
								<div className="flex items-baseline gap-2">
									<Dropdown>
										<DropdownButton outline className="grow">
											<p className="text-xs">Rating</p>
											<ChevronDownIcon />
										</DropdownButton>
										<DropdownMenu>
											<DropdownItem onClick={() => handleRatingChange("")}>
												Any
											</DropdownItem>
											<DropdownItem onClick={() => handleRatingChange("1")}>
												⭐️
											</DropdownItem>
											<DropdownItem onClick={() => handleRatingChange("2")}>
												⭐️⭐️
											</DropdownItem>
											<DropdownItem onClick={() => handleRatingChange("3")}>
												⭐️⭐️⭐️
											</DropdownItem>
											<DropdownItem onClick={() => handleRatingChange("4")}>
												⭐️⭐️⭐️⭐️
											</DropdownItem>
											<DropdownItem onClick={() => handleRatingChange("5")}>
												⭐️⭐️⭐️⭐️⭐️
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
									<Dropdown>
										<DropdownButton outline className="grow">
											<p className="text-xs">Total Reviews</p>
											<ChevronDownIcon />
										</DropdownButton>
										<DropdownMenu>
											<DropdownItem
												onClick={() => handleTotalReviewsChange("")}
											>
												Any
											</DropdownItem>
											<DropdownItem
												onClick={() => handleTotalReviewsChange("10")}
											>
												10{">"}
											</DropdownItem>
											<DropdownItem
												onClick={() => handleTotalReviewsChange("50")}
											>
												50{">"}
											</DropdownItem>
											<DropdownItem
												onClick={() => handleTotalReviewsChange("100")}
											>
												100{">"}
											</DropdownItem>
											<DropdownItem
												onClick={() => handleTotalReviewsChange("500")}
											>
												500{">"}
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
								<Button
									color="orange"
									className="cursor-pointer"
									onClick={() => setOpenFilters(!openFilters)}
								>
									Filters
								</Button>
							</div>
						</SidebarHeader>
						<SidebarBody>
							<SidebarSection className="max-lg:hidden">
								{/* {(isSearchLoading || isMapCafesLoading) && <Text>Loading</Text>} */}
								{/* {(searchError || mapCafesError) && (
									<Text color="red">
										{JSON.stringify(searchError || mapCafesError)}
									</Text>
								)} */}
								<CafeList
									searchInput={searchInput}
									mapCafes={mapCafesData}
									searchCafes={searchCafes}
								/>
							</SidebarSection>
							<SidebarSpacer />
						</SidebarBody>
						<SidebarFooter className="max-lg:hidden pb-4">
							<div className="flex items-center gap-2">
								<Button
									color="white"
									target="_blank"
									href="https://www.instagram.com/kopimap/"
								>
									<img src="/instagram.svg" alt="Instagram" />
								</Button>
								<Button
									color="green"
									className="grow cursor-pointer"
									onClick={() => setIsFeatureRoadmapOpen(true)}
								>
									Upcoming
								</Button>
								<a
									href="https://www.nihbuatjajan.com/egan"
									target="_blank"
									rel="noreferrer"
								>
									<img
										src="https://d4xyvrfd64gfm.cloudfront.net/buttons/default-cta.png"
										alt="Nih buat jajan"
										className="h-[36px]"
									/>
								</a>
							</div>
							<Dropdown>
								<DropdownButton as={SidebarItem}>
									<div className="flex items-baseline justify-between w-full">
										{loggedInUser && (
											<span className="flex min-w-0 items-center gap-3">
												<Avatar
													src={loggedInUser.user_metadata.avatar_url}
													className="size-10"
													square
													alt=""
												/>
												<span className="min-w-0">
													<span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
														{loggedInUser.user_metadata.name}
													</span>
													<span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
														{loggedInUser.email}
													</span>
												</span>
											</span>
										)}
										{!loggedInUser && (
											<Text className="flex min-w-0 items-center gap-3">
												Login to Review
												{LL.loginToReview()}
											</Text>
										)}
									</div>

									<ChevronUpIcon />
								</DropdownButton>
								{/* <div className="px-2">
                  <Link
                    href="https://github.com/eg9y"
                    target="_blank"
                    className="text-xs"
                  >
                    other apps{" "}
                  </Link>
                </div> */}
								<DropdownMenu className="min-w-64" anchor="top start">
									{loggedInUser && (
										<>
											{/* <DropdownItem href="/my-profile">
                        <UserIcon />
                        <DropdownLabel>My profile</DropdownLabel>
                      </DropdownItem>
                      <DropdownItem href="/share-feedback">
                        <LightBulbIcon />
                        <DropdownLabel>Share feedback</DropdownLabel>
                      </DropdownItem>
                      <DropdownDivider /> */}
											<DropdownItem
												onClick={async () => {
													await supabase.auth.signOut();
													window.location.reload();
												}}
											>
												<ArrowRightStartOnRectangleIcon />
												<DropdownLabel>{LL.signOut()}</DropdownLabel>
											</DropdownItem>
										</>
									)}
									{!loggedInUser && (
										<>
											{/* <DropdownDivider /> */}
											<DropdownItem
												onClick={async () => {
													await supabase.auth.signInWithOAuth({
														provider: "google",
														options: {
															redirectTo: import.meta.env.VITE_URL,
														},
													});
												}}
											>
												<ArrowRightStartOnRectangleIcon />
												<DropdownLabel>{LL.signIn()}</DropdownLabel>
											</DropdownItem>
										</>
									)}
								</DropdownMenu>
							</Dropdown>
						</SidebarFooter>
					</Sidebar>
				}
			>
				{children}
			</SidebarLayout>
			<Dialog open={isOpen} onClose={setIsOpen}>
				<DialogTitle>Search Filters</DialogTitle>
				<DialogBody>
					<Field>
						<Label>Distance</Label>
						<Input name="amount" placeholder="$0.00" />
					</Field>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={() => setIsOpen(false)}>Search</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isFeatureRoadmapOpen} onClose={setIsFeatureRoadmapOpen}>
				<DialogTitle>Upcoming Features</DialogTitle>
				<DialogDescription>
					Here are the list of features coming soon...
				</DialogDescription>
				<DialogBody>
					<ul className="list-disc">
						<li>Ratings filter</li>
						<li>Total ratings filter</li>
						<li>Mushola filter</li>
						<li>Chain cafes filter</li>
						<li>Mobile support</li>
					</ul>
				</DialogBody>
				<DialogActions>
					<Button onClick={() => setIsFeatureRoadmapOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
