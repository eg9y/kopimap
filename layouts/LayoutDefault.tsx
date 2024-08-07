import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import "./style.css";
import "./tailwind.css";
import "./safe-area.css";

const queryClient = new QueryClient();

export default function LayoutDefault({
	children,
}: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="h-[100vh] overflow-hidden">{children}</div>
		</QueryClientProvider>
	);
}
