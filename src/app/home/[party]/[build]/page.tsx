//allowed changes: all
//slotted stuff, weapon names, armor names, accessories, characters
"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import { cache } from "react";

interface Params {
  params: {
    party: string;
    build: string;
  };
}

export default async function Page({ params }: Params) {
  const { build: id } = params;
  const supabase = createClient();
  const getAllBuilds = cache(async () => {
    const item = await supabase.from("build").select("*").eq("id", id);
    return item;
  });
  const builds = await getAllBuilds();
  const build: Database["public"]["Tables"]["build"]["Row"] = builds.data![0];

  return <>{JSON.stringify(build)}</>;
}
