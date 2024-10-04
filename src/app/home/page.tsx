//search as shown in UI step => also implement breadcrumbs while working on this
"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import { cache } from "react";
import PartyList from "./PartyList";
import { addParty, deleteParties } from "./action";

export type Character = Database["public"]["Enums"]["character"];
export type Game = Database["public"]["Enums"]["game"];
export type Party = Database["public"]["Tables"]["party"]["Row"] & {
  characters: Character[];
};

//will need to redo SQL queries when filters are added.. or filter some custom way
//probably will have to just use filter functions   + prefix tree
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
async function getParties(): Promise<Party[]> {
  // Fetch data from external API
  const supabase = createClient();
  const { data: parties } = await supabase.from("party").select("*");

  if (!parties) {
    return [];
  }

  const buildIds = parties
    .flatMap((party) => [party.leader, party.second, party.third])
    .filter(Boolean);

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

  const buildMap = new Map(builds.map((build) => [build.id, build.character]));

  const partiesWithCharacters = parties.map(
    (party) =>
      ({
        ...party, //this isnt working probably
        characters: [
          buildMap.get(party.leader),
          buildMap.get(party.second),
          buildMap.get(party.third),
        ].filter(Boolean),
      } as Party)
  );

  return partiesWithCharacters;
}
