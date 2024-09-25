//grab party id from path
//grab party object from party table
//pass as props to view or edit components

//allowed edits: name, description, party order
//NOT ALLOWED: game changes..

//how to pull id from path?
"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { Database } from "@/utils/supabase/types";

interface Params {
  params: {
    party: string;
  };
}

export default async function Page({ params }: Params) {
  const { party: id } = params;
  const supabase = createClient();
  const getAllParties = cache(async () => {
    const item = await supabase.from("party").select("*").eq("id", id);
    return item;
  });
  const parties = await getAllParties();
  const party: Database["public"]["Tables"]["party"]["Row"] = parties.data![0];

  return <>{JSON.stringify(party)}</>;
}
