"use server"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import { nullId } from "@/utils/util";


export async function updateParty(args: {newParty:  Database["public"]["Tables"]["party"]["Row"]}) {

  const supabase = createClient();
  const { error } = await supabase
  .from('party')
  .update(args.newParty)
  .eq('id', args.newParty.id);
  if(error) throw error;
}

export async function addBuild(args: {character: string, party:  Database["public"]["Tables"]["party"]["Row"]}) {

  const supabase = createClient();
  const user_id = await (await supabase.auth.getUser()).data.user?.id;

  const build = {
    accessory: null,
    armor_materia:[nullId],
    weapon_materia: [nullId],
    armor_name: "Cool Armor",
    weapon_name: "Cooler Weapon", //maybe customize to be starting weapons for cuteness?
    armor_schema: ["single"],
    weapon_schema: ["single"],
    character: args.character,
    game: args.party.game,
    summon_materia: null,
    user_id
  }

  

  const {data, error} = await supabase.from("build").insert(build).select();
  if(error) throw error;

  const id = (data[0] as Database["public"]["Tables"]["build"]["Row"]).id;

  const result = await supabase
  .from('party')
  .update({builds: [...args.party.builds, id]})
  .eq('id', args.party.id);
  if(result.error) throw error;
  
}