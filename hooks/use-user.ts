import { useEffect, useState } from "react";
import { Session, User, createClient } from "@supabase/supabase-js";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL!,
	import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export function useUser() {
	const [loggedInUser, setLoggedInUser] = useState<User | null | false>(null);
	const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				setLoadingUser(true);
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();
				if (error) throw error;

				const {
					data: { session },
				} = await supabase.auth.getSession();

				setSessionInfo(session);
				setLoggedInUser(user || false);
			} catch (error) {
				console.error("Error fetching user:", error);
				setLoggedInUser(false);
			} finally {
				setLoadingUser(false);
			}
		}
		fetchUser();

		// Listen for auth state changes
		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				console.log("Auth state changed:", event);
				if (session) {
					setSessionInfo(session);
					setLoggedInUser(session.user || false);
				} else {
					setSessionInfo(null);
					setLoggedInUser(false);
				}
			},
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return {
		loggedInUser,
		setLoggedInUser,
		sessionInfo,
		setSessionInfo,
		loadingUser,
	};
}
