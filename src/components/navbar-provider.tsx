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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";
import { SupabaseContextProvider } from "@/lib/supabase-client";
import { useUser } from "@/lib/use-user";

export function NavBarProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const supabase = createClientComponentClient<Database>();

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseContextProvider client={supabase}>
        <MainComponent />
        {children}
      </SupabaseContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

function MainComponent() {
  const user = useUser();
  const router = useRouter();

  return (
    <div className="pt-10 w-[90vw] mx-auto">
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
      <div className="flex gap-4 justify-between">
        <Link href="/">
          <Button
            variant={"ghost"}
            className="hover:bg-transparent flex flex-col items-start"
          >
            <h1 className="font-bold text-4xl hover:text-slate-700">
              ☕️ Kopi Map
            </h1>
            <p className="text-sm text-gray-500">
              Find your favorite coffee shops in Jakarta
            </p>
          </Button>
        </Link>
        {/* {JSON.stringify(session)} */}
        <div className="flex gap-4">
          {user.session?.user.email === "brickkace@gmail.com" && (
            <Link href="/add-cafe">
              <Button>Add Cafe</Button>
            </Link>
          )}
          {user.session?.user.id && (
            <Button
              onClick={async () => {
                const supabase = createClientComponentClient<Database>();
                await supabase.auth.signOut();
                router.refresh();
              }}
            >
              Logout
            </Button>
          )}
        </div>
        {!user.session?.user.id && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
