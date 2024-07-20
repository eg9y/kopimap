import { createClient } from "@supabase/supabase-js";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Database } from "../components/lib/database.types";
import {  Field, FieldGroup, Fieldset, Label, Legend } from "../components/catalyst/fieldset";
import { Text } from "../components/catalyst/text";
import { Input } from "../components/catalyst/input";
import { Button } from "../components/catalyst/button";

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
  return <div className="p-2">
    <div>
      <p>Upload cafe</p>
      <form action="/orders" method="POST">
      {/* ... */}
      <Fieldset>
        <Legend>Shipping details</Legend>
        <Text>Without this your odds of getting your order are low.</Text>
        <FieldGroup>
          <Field>
            <Label>Cafe Name</Label>
            <Input name="street_address" />
          </Field>
          <Field>
          <Label>Address</Label>
          <Input name="street_address" />
          </Field>
          <Field>
          <Label>Gmaps rating</Label>
          <Input name="street_address" />
          </Field>
          <Field>
          <Label>Gmaps total reviews</Label>
          <Input name="street_address" />
          </Field>
          <Field>
          <Label>Open times</Label>
          <Input name="street_address" />
          </Field>
        
          <Field>
          <Label>Images</Label>
          <Input name="street_address" />
          </Field>
        
        </FieldGroup>
        <Button>Submit</Button>
      </Fieldset>
      {/* ... */}
    </form>
    </div>
  </div>;
}
