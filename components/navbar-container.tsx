import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/components/catalyst/navbar";
import { StackedLayout } from "@/components/catalyst/stacked-layout";
import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "../hooks/use-user";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { LanguageSwitcher } from "./language-switcher";
import { siInstagram } from "simple-icons";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "./theme-provider";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const navItems = [
  { label: "Map", url: "/" },
  { label: "Feed", url: "/feed" },
];

export function NavbarContainer({ children }: { children: React.ReactNode }) {
  const { LL } = useI18nContext();
  const { loggedInUser } = useUser();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <div className="flex gap-1">
            <NavbarLabel
              className={`font-bold text-lg flex items-center ${
                isDarkMode ? "text-amber-400" : "text-amber-950"
              }`}
            >
              <img
                src="https://map-assets.kopimap.com/logo.png"
                className={`w-6 h-6`}
              />
              <span
                className={`ml-2 ${
                  isDarkMode ? "text-white" : "text-amber-950"
                }`}
              >
                Kopimap
              </span>
            </NavbarLabel>
          </div>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="">
            {navItems.map(({ label, url }) => (
              <NavbarItem
                key={label}
                href={url}
                current={url === window.location.pathname}
              >
                {label}
              </NavbarItem>
            ))}
            {loggedInUser && (
              <NavbarItem
                key="achievements"
                href="/achievements"
                current={"/achievements" === window.location.pathname}
              >
                Achievements
              </NavbarItem>
            )}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem
              href="https://www.instagram.com/kopimap/"
              target="_blank"
            >
              <svg viewBox="0 0 24 24" className="w-4 ">
                <path d={siInstagram.path} />
              </svg>
            </NavbarItem>
            <NavbarItem href="https://www.nihbuatjajan.com/egan">
              Donasi
            </NavbarItem>

            <Dropdown>
              <DropdownButton plain>
                {loggedInUser ? (
                  <>
                    <UserIcon />
                    {loggedInUser.user_metadata.name}
                  </>
                ) : (
                  <div>{LL.loginToReview()}</div>
                )}
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                {loggedInUser ? (
                  <>
                    <DropdownItem
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.reload();
                      }}
                    >
                      <ArrowRightStartOnRectangleIcon />
                      <DropdownLabel>{LL.signOut()}</DropdownLabel>
                    </DropdownItem>
                  </>
                ) : (
                  <DropdownItem
                    onClick={async () => {
                      await supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                          redirectTo: import.meta.env.VITE_URL,
                        },
                      });
                    }}
                  >
                    <ArrowRightStartOnRectangleIcon />
                    <DropdownLabel>{LL.signIn()}</DropdownLabel>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
          <NavbarSection>
            <LanguageSwitcher />
          </NavbarSection>
          <NavbarSection>
            <ThemeToggle />
          </NavbarSection>
        </Navbar>
      }
    >
      {children}
    </StackedLayout>
  );
}
