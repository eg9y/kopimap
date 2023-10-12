import { Session, User } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "./supabase-client";

export type AuthState = {
  user: User | null;
  session: Session | null;
  error: Error | null;
};

export const useUser = (): AuthState => {
  const context = useContext(SupabaseContext);
  const supabase = context.sb;

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    error: null,
  });

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setAuthState({ user, session, error: null });
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  return authState;
};
