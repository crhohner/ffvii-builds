import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login"); //sends back if not logged in, copy pattern..
  }

  return <p>hello {data.user.email} :3</p>;
}

//great, great example of how to hide non-home/feed pages
//should be able to use the tool without a login though? just can't save..
