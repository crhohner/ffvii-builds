//search as shown in UI step => also implement breadcrumbs while working on this?
"use server";
import { DisplayParty } from "@/utils/frontend-types";
import { createClient } from "@/utils/supabase/server";



export const fetchServerProps : () => Promise<DisplayParty[]> = async () =>  {

  // Fetch data from external API
  const supabase = createClient();
  const { data: parties } = await supabase.from("party").select("*");

  if (!parties) {
    return [];
  }

  const buildIds = parties.flatMap((party) => party.builds).filter(Boolean);

  const { data: builds } = await supabase
    .from("build")
    .select("*")
    .in("id", buildIds);

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
