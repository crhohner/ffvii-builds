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
  const supabase = createClient();
  const getAllParties = cache(async () => {
    const item = await supabase.from("party").select("*");
    return item;
  });
  const getCharacters = cache(
    async (party: Database["public"]["Tables"]["party"]["Row"]) => {
      const chars: Character[] = [];

      if (party.leader) {
        const leader = await supabase
          .from("build")
          .select("*")
          .eq("id", party.leader);
        const l: Database["public"]["Tables"]["build"]["Row"] = leader.data![0];
        chars.push(l.character);
      }

      if (party.second) {
        const second = await supabase
          .from("build")
          .select("*")
          .eq("id", party.second);
        const s: Database["public"]["Tables"]["build"]["Row"] = second.data![0];
        chars.push(s.character);
      }

      if (party.third) {
        const third = await supabase
          .from("build")
          .select("*")
          .eq("id", party.third);
        const t: Database["public"]["Tables"]["build"]["Row"] = third.data![0];
        chars.push(t.character);
      }

      return chars;
    }
  );
  const parties: Database["public"]["Tables"]["party"]["Row"][] = (
    await getAllParties()
  ).data!;
  const partiesWithCharacters: Party[] = [];

  for (const party of parties) {
    const characters = await getCharacters(party);
    partiesWithCharacters.push({ ...party, characters });
  }
  return (
    <PartyList
      parties={partiesWithCharacters}
      delete={deleteParties}
      add={addParty}
    />
  );
}
