import { useI18nContext } from "@/src/i18n/i18n-react";
import { createClient } from "@supabase/supabase-js";
import {
	Block,
	Button,
	Link,
	Sheet,
	Tabbar,
	TabbarLink,
	Toolbar,
} from "konsta/react";
import { MapIcon, NewspaperIcon, TrophyIcon, UserIcon } from "lucide-react";
import React, { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { useUser } from "../../hooks/use-user";
import { useStore } from "../../store";
import { Avatar } from "../catalyst/avatar";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const MobileToolbar: React.FC = () => {
	const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
	const { loggedInUser } = useUser();
	const { LL } = useI18nContext();
	const {
		isListDialogOpen,
		setIsListDialogOpen,
		selectCafe,
		setSearchInput,
		openSubmitReviewDialog,
	} = useStore();
	const pageContext = usePageContext();

	const handleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: import.meta.env.VITE_URL,
			},
		});
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};

	const handleUserAction = () => {
		if (loggedInUser) {
			setIsUserSheetOpen(true);
			setIsListDialogOpen(false);
		} else {
			handleSignIn();
		}
	};

	const isActive = (path: string) => pageContext.urlPathname === path;

	return (
		<>
			<Sheet
				className="pb-safe w-full"
				opened={isUserSheetOpen}
				onBackdropClick={() => setIsUserSheetOpen(false)}
			>
				<Toolbar top>
					<div className="left" />
					<div className="right">
						<Link toolbar onClick={() => setIsUserSheetOpen(false)}>
							Close
						</Link>
					</div>
				</Toolbar>
				<Block>
					{loggedInUser && (
						<>
							<div className="flex items-center space-x-4 mb-4">
								<Avatar
									src={loggedInUser.user_metadata.avatar_url}
									className="w-16 h-16"
									square
									alt=""
								/>
								<div>
									<p className="font-semibold">
										{loggedInUser.user_metadata.name}
									</p>
									<p className="text-sm text-gray-500">{loggedInUser.email}</p>
								</div>
							</div>
							<Button onClick={handleSignOut} className="mb-4">
								Sign Out
							</Button>
						</>
					)}
					<div className="mt-6">
						<p className="text-sm font-medium text-gray-700 mb-2">Language</p>
						<LanguageSwitcher />
						<ThemeToggle />
					</div>
				</Block>
			</Sheet>
			{!openSubmitReviewDialog && (
				<Tabbar className="flex-shrink-0">
					<TabbarLink
						active={isActive("/feed")}
						linkProps={{
							href: "/feed",
						}}
						onClick={() => {
							selectCafe(null);
							setIsListDialogOpen(false);
						}}
						icon={<NewspaperIcon className="w-6 h-6" />}
						label={"Feed"}
					/>
					<TabbarLink
						active={isActive("/")}
						onClick={async () => {
							if (isActive("/")) {
								setIsListDialogOpen(!isListDialogOpen);
								setSearchInput("");
							} else {
								const navigationPromise = navigate("/");
								console.log(
									"The URL changed but the new page hasn't rendered yet.",
								);
								await navigationPromise;
								console.log("The new page has finished rendering.");
							}
						}}
						icon={<MapIcon className="w-6 h-6" />}
						label={isListDialogOpen ? "Hide Cafes" : "See Cafes"}
					/>
					{loggedInUser && (
						<TabbarLink
							active={isActive("/achievements")}
							onClick={() => {
								navigate("/achievements");
							}}
							icon={<TrophyIcon className="w-6 h-6" />}
							label="Achievements"
						/>
					)}
					<TabbarLink
						active={isActive("/profile")} // Assuming there's a profile page
						onClick={handleUserAction}
						icon={
							loggedInUser ? (
								<Avatar
									src={loggedInUser.user_metadata.avatar_url}
									className="w-6 h-6"
									square
									alt=""
								/>
							) : (
								<UserIcon className="w-6 h-6" />
							)
						}
						label={
							loggedInUser
								? loggedInUser.user_metadata.name
								: LL.loginToReview()
						}
					/>
				</Tabbar>
			)}
		</>
	);
};
