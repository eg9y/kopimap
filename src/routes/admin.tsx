import { createClient } from "@supabase/supabase-js";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Database } from "../components/lib/database.types";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const supabase = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.rpc("is_user_admin");

    if (error) {
      console.error("error", error);
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    } else if (!data) {
      console.log("not authorized");
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Admin,
});

function Admin() {
  return <div className="p-2">Hello from Admin!</div>;
}
