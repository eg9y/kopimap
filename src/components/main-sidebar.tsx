import React, { useState, useEffect } from "react";
import { Avatar } from "./catalyst/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./catalyst/dropdown";
import { Heading } from "./catalyst/heading";
import { Input, InputGroup } from "./catalyst/input";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "./catalyst/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  SidebarSpacer,
} from "./catalyst/sidebar";
import { SidebarLayout } from "./catalyst/sidebar-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Text } from "./catalyst/text";
import { Link } from "./catalyst/link";
import { CafeList } from "./cafe-list";
import { Button } from "./catalyst/button";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./catalyst/dialog";
import { Field, Label } from "./catalyst/fieldset";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "../hooks/use-user";
import { useSearch } from "../hooks/use-search";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function MainSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const { loggedInUser } = useUser();

  const { searchTerm, setSearchTerm, handleSearch, isLoading, error } =
    useSearch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error)
    );
  }, []);

  const performSearch = () => {
    handleSearch(userLocation);
  };

  return (
    <>
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarItem href="/search" aria-label="Search">
                <MagnifyingGlassIcon />
              </NavbarItem>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src="/profile-photo.jpg" square />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                  <DropdownItem href="/my-profile">
                    <UserIcon />
                    <DropdownLabel>My profile</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="/settings">
                    <Cog8ToothIcon />
                    <DropdownLabel>Settings</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/privacy-policy">
                    <ShieldCheckIcon />
                    <DropdownLabel>Privacy policy</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="/share-feedback">
                    <LightBulbIcon />
                    <DropdownLabel>Share feedback</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/logout">
                    <ArrowRightStartOnRectangleIcon />
                    <DropdownLabel>Sign out</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <div className="flex justify-between">
                <div className="">
                  <Heading>KopiMap</Heading>
                  <Text>Peta cafe DKI Jakarta</Text>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="grow">
                  <InputGroup className="">
                    <MagnifyingGlassIcon />
                    <Input
                      name="search"
                      placeholder="Search cafes..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && performSearch()}
                    />
                  </InputGroup>
                </div>
                <Button
                  plain
                  className="cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Filters
                </Button>
              </div>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection className="max-lg:hidden">
                {isLoading && <Text>Loading...</Text>}
                {error && <Text color="red">{error}</Text>}
                <CafeList />
              </SidebarSection>
              <SidebarSpacer />
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  <div className="flex items-baseline justify-between w-full">
                    {loggedInUser && (
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar
                          src={loggedInUser.user_metadata.avatar_url}
                          className="size-10"
                          square
                          alt=""
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                            {loggedInUser.user_metadata.name}
                          </span>
                          <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                            {loggedInUser.email}
                          </span>
                        </span>
                      </span>
                    )}
                    {!loggedInUser && (
                      <Text className="flex min-w-0 items-center gap-3">
                        Login to make a review!
                      </Text>
                    )}
                  </div>

                  <ChevronUpIcon />
                </DropdownButton>
                <div className="px-2 pb-2">
                  <Link
                    href="https://github.com/eg9y"
                    target="_blank"
                    className="text-xs"
                  >
                    Made by turning ☕️ to {"</>"}
                  </Link>
                </div>
                <DropdownMenu className="min-w-64" anchor="top start">
                  {loggedInUser && (
                    <>
                      {/* <DropdownItem href="/my-profile">
                        <UserIcon />
                        <DropdownLabel>My profile</DropdownLabel>
                      </DropdownItem>
                      <DropdownItem href="/share-feedback">
                        <LightBulbIcon />
                        <DropdownLabel>Share feedback</DropdownLabel>
                      </DropdownItem>
                      <DropdownDivider /> */}
                      <DropdownItem
                        onClick={async () => {
                          await supabase.auth.signOut();
                          window.location.reload();
                        }}
                      >
                        <ArrowRightStartOnRectangleIcon />
                        <DropdownLabel>Sign out</DropdownLabel>
                      </DropdownItem>
                    </>
                  )}
                  {!loggedInUser && (
                    <>
                      {/* <DropdownDivider /> */}
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
                        <DropdownLabel>Sign in</DropdownLabel>
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            </SidebarFooter>
          </Sidebar>
        }
      >
        {children}
      </SidebarLayout>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Search Filters</DialogTitle>
        <DialogDescription>
          Filters to search the perfect cafe for you
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Distance</Label>
            <Input name="amount" placeholder="$0.00" />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Search</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
