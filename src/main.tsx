import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useUser } from "./hooks/use-user";
import { User } from "@supabase/supabase-js";

const queryClient = new QueryClient();

// Define the type for our router context
interface MyRouterContext {
  loggedInUser: User | null;
}

const router = createRouter({
  routeTree,
  context: {
    loggedInUser: null, // Initialize with null
  } as MyRouterContext,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

function InnerApp() {
  const { loggedInUser } = useUser();
  return <RouterProvider router={router} context={{ loggedInUser }} />;
}