//search as shown in UI step => also implement breadcrumbs while working on this?
"use server";
import { DisplayParty } from "@/utils/frontend-types";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const fetchServerProps : () => Promise<DisplayParty[]> = async () =>  {

  // Fetch data from external API
  const supabase = createClient();

  const getParties = cache(async () => {
    const data = await supabase.from("party").select("*");
    return data

  })
  const {data: parties, error} = await getParties();
  if(error) {
    console.log(error) //TODO
  }

  if (!parties) {
    return [];
  }

  const buildIds = parties.flatMap((party) => party.builds).filter(Boolean);

  const getBuilds = cache (async () => {
    const data = await supabase
    .from("build")
    .select("*")
    .in("id", buildIds);
    return data

  })
  const {data: builds} = await getBuilds();
 

  if (!builds) {
    const partiesWithCharacters = parties.map((party) => ({
      ...party,
      characters: [],
    }));

    return partiesWithCharacters;
  }

  const buildMap = new Map<string, string>(
    builds.map((build) => [build.id, build.character])
  );

  const partiesWithCharacters = parties.map(
    (party) =>
      ({
        ...party,
        characters: party.builds.map((id: string) => buildMap.get(id)),
      } as DisplayParty)
  );

  return partiesWithCharacters;
}
