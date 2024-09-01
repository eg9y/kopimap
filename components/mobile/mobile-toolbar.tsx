import React, { useState } from 'react';
import { MapIcon, NewspaperIcon, UserIcon } from "lucide-react";
import { Button, Sheet, Toolbar, Link, Block, Tabbar, TabbarLink } from "konsta/react";
import { Avatar } from "../catalyst/avatar";
import { useUser } from "../../hooks/use-user";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { useStore } from "../../store";
import { createClient } from '@supabase/supabase-js';
import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router'


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const MobileToolbar: React.FC = () => {
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const { loggedInUser } = useUser();
  const { LL } = useI18nContext();
  const { isListDialogOpen, setIsListDialogOpen, selectCafe, setSearchInput } = useStore();
  const pageContext = usePageContext();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_URL,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleUserAction = () => {
    if (loggedInUser) {
      setIsUserSheetOpen(true);
    } else {
      handleSignIn();
    }
  };

  const isActive = (path: string) => pageContext.urlPathname === path;

  return (
    <>
      <Sheet
        className="pb-safe w-full"
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
                  <p className="font-semibold">{loggedInUser.user_metadata.name}</p>
                  <p className="text-sm text-gray-500">{loggedInUser.email}</p>
                </div>
              </div>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          )}
        </Block>
      </Sheet>
      <Tabbar className="flex-shrink-0">
        <TabbarLink
          active={isActive('/feed')}
          linkProps={{
            href: "/feed"
          }}
          onClick={() => {
            setIsListDialogOpen(false)
          }}
          icon={<NewspaperIcon className="w-6 h-6" />}
          label={'Feed'}
        />
        <TabbarLink
          active={isActive('/')}
          onClick={async () => {
            if (isActive('/')) {
              if (isListDialogOpen) {
                selectCafe(null);
              }
              setIsListDialogOpen(!isListDialogOpen);
              setSearchInput("");
            } else {
              const navigationPromise = navigate('/')
              console.log("The URL changed but the new page hasn't rendered yet.")
              await navigationPromise
              console.log('The new page has finished rendering.')
            }

          }}
          icon={<MapIcon className="w-6 h-6" />}
          label={isListDialogOpen ? 'Hide Cafes' : 'See Cafes'}
        />
        <TabbarLink
          active={isActive('/profile')}  // Assuming there's a profile page
          onClick={handleUserAction}
          icon={loggedInUser ?
            <Avatar
              src={loggedInUser.user_metadata.avatar_url}
              className="w-6 h-6"
              square
              alt=""
            /> :
            <UserIcon className="w-6 h-6" />
          }
          label={loggedInUser ? loggedInUser.user_metadata.name : LL.loginToReview()}
        />
      </Tabbar>
    </>
  );
};
