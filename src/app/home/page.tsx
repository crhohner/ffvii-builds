//search as shown in UI step => also implement breadcrumbs while working on this
"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import { cache } from "react";

//will need to redo SQL queries when filters are added.. or filter some custom way
//probably will have to just use filter functions   + prefix tree
export default async function Page() {
  const supabase = createClient();
  const getAllParties = cache(async () => {
    const item = await supabase.from("party").select("*");
    return item;
  });
  const parties: Database["public"]["Tables"]["party"]["Row"][] = (
    await getAllParties()
  ).data!;

  return <div className="centered">{JSON.stringify(parties)}</div>;
}
