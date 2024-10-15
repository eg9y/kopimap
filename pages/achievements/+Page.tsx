import { useUser } from "@/hooks/use-user";
import { useUserAchievements } from "@/hooks/use-user-achievements";
import { Award, Coffee, MapPin, Star, User } from "lucide-react";

export default function Achievements() {
	const { loggedInUser } = useUser();
	const {
		data: achievements,
		isLoading,
		error,
	} = useUserAchievements(loggedInUser?.id || "");

	if (isLoading) return <div className="p-4">Loading...</div>;
	if (error) return <div className="p-4">Error loading achievements</div>;

	return (
		<div className="flex flex-col h-full">
			<div className="px-6 py-4">
				<h1 className="text-3xl font-bold">Achievements</h1>
			</div>
			<div className="flex-1 overflow-y-auto px-6 pb-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					<AchievementCard
						title="First Review"
						description="You've written your first review!"
						icon={<Star className="w-8 h-8" />}
						achieved={!!achievements?.first_review}
					/>
					<AchievementCard
						title="Account Created"
						description="Welcome to the community!"
						icon={<User className="w-8 h-8" />}
						achieved={!!achievements?.created_account}
					/>
					{/* Add more achievement cards here */}
				</div>
			</div>
		</div>
	);
}

interface AchievementCardProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	achieved: boolean | null;
}

function AchievementCard({
	title,
	description,
	icon,
	achieved,
}: AchievementCardProps) {
	return (
		<div
			className={`p-4 rounded-lg shadow-md ${achieved ? "bg-green-100" : "bg-gray-100"}`}
		>
			<div className="flex items-center mb-2">
				<div
					className={`mr-2 ${achieved ? "text-green-600" : "text-gray-400"}`}
				>
					{icon}
				</div>
				<h2 className="text-xl font-semibold dark:text-slate-700">{title}</h2>
			</div>
			<p className="text-sm text-gray-600">{description}</p>
			{achieved && (
				<div className="mt-2 text-green-600 font-semibold flex items-center">
					<Award className="w-4 h-4 mr-1" />
					Achieved
				</div>
			)}
		</div>
	);
}
