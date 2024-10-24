"use client";

import { useEffect, useState } from "react";
import { Session, User, createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function useUser() {
  const [loggedInUser, setLoggedInUser] = useState(null as null | User);
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSessionInfo(session);
      setLoggedInUser(user);
    }
    fetchUser();
  }, []);

  return { loggedInUser, setLoggedInUser, sessionInfo, setSessionInfo };
}
