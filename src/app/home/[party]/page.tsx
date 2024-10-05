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
import PartyView from "./PartyView";

interface Params {
  params: {
    party: string;
  };
}
export type Materia = Database["public"]["Tables"]["materia"];
export type Accessory = Database["public"]["Tables"]["accessory"]["Row"];

export type Build = {
  accessory: Accessory | null;
  armor_materia: Materia[];
  armor_name: string | null;
  armor_schema: Database["public"]["Enums"]["slot_type"][];
  character: Database["public"]["Enums"]["character"];
  id: string;
  summon_materia: Materia | null;
  weapon_materia: Materia[];
  weapon_name: string | null;
  weapon_schema: Database["public"]["Enums"]["slot_type"][];
}; //nope needs a better definition

export default async function Page({ params }: Params) {
  const { party: id } = params;
  const supabase = createClient();
  const getAllParties = cache(async () => {
    const item = await supabase.from("party").select("*").eq("id", id);
    return item;
  });

  const parties = await getAllParties();
  const party: Database["public"]["Tables"]["party"]["Row"] = parties.data![0];

  const getGameMateria = cache(async () => {
    const item = await supabase
      .from("materia")
      .select("*")
      .eq("game", party.game);
    return item;
  });

  const materia: Materia[] = (await getGameMateria()).data as Materia[];

  const getGameAccessories = cache(async () => {
    const item = await supabase
      .from("accessory")
      .select("*")
      .eq("game", party.game);
    return item;
  });

  const accesories: Accessory[] = (await getGameAccessories())
    .data as Accessory[];

  //TODO
  //refactor builds to be listed, not 1,2,3
  //construct builds by mapping
  //pass all in to client component

  return <></>;
}
