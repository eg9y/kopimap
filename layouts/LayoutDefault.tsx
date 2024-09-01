import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "./style.css";
import "./tailwind.css";
import "./safe-area.css";
import { useWindowSize } from "react-use";
import { MobileToolbar } from "@/components/mobile/mobile-toolbar";
import { LocaleContext } from "@/components/locale-context";
import { UsernamePrompt } from "@/components/username-prompt";
import { WelcomeModal } from "@/components/welcome-modal";

const queryClient = new QueryClient();

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowSize();
  const isMobile = width < 768; // Adjust this breakpoint as needed

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleContext>
        <div className="flex flex-col h-[100dvh]">
          <main className="grow overflow-scroll">{children}</main>
          {isMobile && <MobileToolbar />}
          <UsernamePrompt />
          <WelcomeModal />
        </div>
      </LocaleContext>
    </QueryClientProvider>
  );
}
