//search as shown in UI step => also implement breadcrumbs while working on this
"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import PartyList from "./PartyList";
import { addParty, deleteParties } from "./action";

export type Character = Database["public"]["Enums"]["character"];
export type Game = Database["public"]["Enums"]["game"];
export type DisplayParty = Database["public"]["Tables"]["party"]["Row"] & {
  characters: Character[];
};
//define build type...

export default async function Page() {
  const parties = await getParties();
  return (
    <PartyList
      parties={parties}
      deleteAction={deleteParties}
      addAction={addParty}
    />
  );
}
async function getParties(): Promise<DisplayParty[]> {
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
