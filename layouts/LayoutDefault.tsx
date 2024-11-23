import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import "./style.css";
import "./tailwind.css";
import { useWindowSize } from "react-use";

import { MobileToolbar } from "@/components/mobile/mobile-toolbar";
import { LocaleContext } from "@/components/locale-context";
import { UsernamePrompt } from "@/components/username-prompt";
import { WelcomeModal } from "@/components/welcome-modal";
import { NavbarContainer } from "@/components/navbar-container";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    const initSafeArea = async () => {
      const isCapacitor = "Capacitor" in window;
      
      try {
        if (isCapacitor) {
          const { Capacitor } = await import("@capacitor/core");
          const isNative = Capacitor.isNativePlatform();

          if (isNative) {
            const { SafeArea } = await import("capacitor-plugin-safe-area");
            const safeArea = await SafeArea.getSafeAreaInsets();
            
            document.documentElement.style.setProperty(
              "--safe-area-top",
              `${safeArea.insets.top}px`
            );
            document.documentElement.style.setProperty(
              "--safe-area-bottom",
              `${safeArea.insets.bottom}px`
            );
            document.documentElement.style.setProperty(
              "--safe-area-left",
              `${safeArea.insets.left}px`
            );
            document.documentElement.style.setProperty(
              "--safe-area-right",
              `${safeArea.insets.right}px`
            );
          } else {
            setWebDefaults();
          }
        } else {
          setWebDefaults();
        }
      } catch (error) {
        console.error("Error setting safe area:", error);
        setWebDefaults();
      }
    };

    const setWebDefaults = () => {
      document.documentElement.style.setProperty("--safe-area-top", "1rem");
      document.documentElement.style.setProperty("--safe-area-bottom", "0px");
      document.documentElement.style.setProperty("--safe-area-left", "0px");
      document.documentElement.style.setProperty("--safe-area-right", "0px");
    };

    initSafeArea();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocaleContext>
          <div
            className={`flex flex-col h-[100dvh] relative ${
              !isMobile
                ? "pt-[var(--safe-area-top)] pb-[var(--safe-area-bottom)] pl-[var(--safe-area-left)] pr-[var(--safe-area-right)]"
                : ""
            }`}
          >
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 h-[var(--safe-area-bottom)] bg-black dark:bg-black z-[999]" />
            )}

            {isMobile && (
              <main className="grow overflow-y-auto">{children}</main>
            )}
            {!isMobile && (
              <NavbarContainer>
                <main className="grow overflow-y-auto">{children}</main>
              </NavbarContainer>
            )}
            {isMobile && <MobileToolbar />}
            <UsernamePrompt />
            <WelcomeModal />
          </div>
        </LocaleContext>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
