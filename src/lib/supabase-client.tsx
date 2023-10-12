import { SupabaseClient, User } from "@supabase/supabase-js";
import React from "react";
import { Database } from "./database.types";

type SupabaseContextType = {
  sb: SupabaseClient<Database> | null;
  user: User | null;
};

export const SupabaseContext = React.createContext<SupabaseContextType>({
  sb: null,
  user: null,
});

interface SupabaseContextProviderProps extends React.PropsWithChildren<{}> {
  client: SupabaseClient;
}

export const SupabaseContextProvider: React.FC<
  SupabaseContextProviderProps
> = ({ children, client }) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    (async () => {
      const {
        data: { user: fetchedUser },
      } = await client.auth.getUser();
      if (fetchedUser) {
        setUser(fetchedUser);
      }
      client.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user!);
        }
        if (event === "SIGNED_OUT") {
          setUser(null);
        }
      });
    })();
  }, [client.auth]);

  return (
    <SupabaseContext.Provider value={{ user, sb: client }}>
      {children}
    </SupabaseContext.Provider>
  );
};
