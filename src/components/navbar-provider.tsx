"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Link from "next/link";
import { Button } from "./ui/button";

export function NavBarProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <div className="px-40">
          {/* <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}
        </div>
        <div className="flex gap-4 justify-between px-2">
          <Link href="/">
            <Button variant={"ghost"} className="hover:bg-transparent">
              <h1 className="font-bold text-4xl hover:text-slate-700">
                ☕️ Kopi Map
              </h1>
            </Button>
          </Link>
          <Button>Login</Button>
        </div>

        {children}
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
