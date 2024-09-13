import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
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
import { Button } from "./catalyst/button";
import { siInstagram } from "simple-icons";

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

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <div className="flex gap-1">
            <NavbarLabel className="font-bold text-lg text-amber-950 flex items-center">
              <img src="/logo.png" className="w-6 h-6" />
              Kopimap
            </NavbarLabel>
          </div>
          <LanguageSwitcher />
          <Button
            color="red"
            target="_blank"
            href="https://www.instagram.com/kopimap/"
            arial-label="Instagram Link"
          >
            <svg viewBox="0 0 24 24" className="w-5 fill-fuchsia-200">
              <path d={siInstagram.path} />
            </svg>
          </Button>
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
            <NavbarItem href="https://www.nihbuatjajan.com/egan">
              Nih Buat Jajan
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
        </Navbar>
      }
    >
      {children}
    </StackedLayout>
  );
}
