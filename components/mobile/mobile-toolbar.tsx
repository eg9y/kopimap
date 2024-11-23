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
import React, { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { useUser } from "../../hooks/use-user";
import { useStore } from "../../store";
import { Avatar } from "../catalyst/avatar";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const handleNavigation = async (path: string) => {
  await navigate(path);
};

export const MobileToolbar: React.FC = () => {
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const { loggedInUser } = useUser();
  const { LL } = useI18nContext();
  const { setIsListDialogOpen, selectCafe, openSubmitReviewDialog } =
    useStore();
  const pageContext = usePageContext();

  useEffect(() => {
    const setupAppUrlListener = async () => {
      // Check if we're in a Capacitor environment
      const isCapacitor = 'Capacitor' in window;
      
      if (!isCapacitor) {
        console.log("Not in Capacitor environment");
        return;
      }

      try {
        console.log("Setting up App URL listener");
        const { App } = await import('@capacitor/app');
        
        const listener = await App.addListener(
          "appUrlOpen",
          async ({ url }) => {
            console.log("App URL Opened:", url);

            if (url.startsWith("kopimap://login-callback")) {
              // Dynamically import Browser when needed
              const { Browser } = await import('@capacitor/browser');
              if (Browser) {
                await Browser.close();
              }

              // Extract the fragment part of the URL (after the #)
              const urlObj = new URL(url);
              const fragment = urlObj.hash.substring(1);
              const params = new URLSearchParams(fragment);

              const access_token = params.get("access_token");
              const refresh_token = params.get("refresh_token");

              console.error("access_token", access_token);
              console.error("refresh_token", refresh_token);

              if (access_token && refresh_token) {
                const { data, error } = await supabase.auth.setSession({
                  access_token,
                  refresh_token,
                });

                if (error) {
                  console.error("Error setting session:", error);
                  return;
                }

                setIsUserSheetOpen(false);
              }
            }
          }
        );

        return () => {
          console.log("Removing App URL listener");
          if (listener) listener.remove();
        };
      } catch (error) {
        console.error("Error setting up app URL listener:", error);
      }
    };

    setupAppUrlListener();
  }, []);

  const handleSignIn = async () => {
    const isCapacitor = 'Capacitor' in window;
    const redirectTo = isCapacitor
      ? "kopimap://login-callback"
      : import.meta.env.VITE_URL;

    console.log("redirectTo", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("Error during sign-in:", error);
      return;
    }

    // Handle browser opening
    if (isCapacitor && data.url) {
      try {
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({
          url: data.url,
          presentationStyle: "popover",
        });
      } catch (error) {
        console.error("Error opening browser:", error);
        // Fallback to direct navigation
        window.location.href = data.url;
      }
    } else if (data.url) {
      // Web fallback
      window.location.href = data.url;
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleUserAction = () => {
    if (loggedInUser) {
      setIsUserSheetOpen(true);
      setIsListDialogOpen(false);
      selectCafe(null);
    } else {
      handleSignIn();
    }
  };

  const isActive = (path: string) => pageContext.urlPathname === path;

  return (
    <>
      <Sheet
        className="w-full z-[1000]"
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
        <Tabbar className="fixed bottom-[var(--safe-area-bottom)] left-0 right-0 !z-[1000] bg-white dark:bg-black">
          <TabbarLink
            active={isActive("/feed")}
            onClick={async () => {
              if (isActive("/feed")) {
                return;
              }
              selectCafe(null);
              setIsListDialogOpen(false);
              await handleNavigation("/feed");
            }}
            icon={<NewspaperIcon className="w-6 h-6" />}
            label={"Feed"}
          />
          <TabbarLink
            active={isActive("/")}
            onClick={async () => {
              if (isActive("/")) {
                return;
              }
              await handleNavigation("/");
            }}
            icon={<MapIcon className="w-6 h-6" />}
            label={"Peta"}
          />
          {loggedInUser && (
            <TabbarLink
              active={isActive("/achievements")}
              onClick={async () => {
                await handleNavigation("/achievements");
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
