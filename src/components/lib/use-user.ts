"use client";

import { useEffect, useState } from "react";
import { User, createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function useUser() {
  const [loggedInUser, setLoggedInUser] = useState(null as null | User);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        return;
      }
      setLoggedInUser(user);
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loggedInUser, setLoggedInUser };
}
