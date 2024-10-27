  "use server"
import { DisplayParty, Party } from "@/utils/frontend-types";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import build from "next/dist/build";

export async function deleteParties(parties: DisplayParty[]): Promise<void> {

  const supabase = await createClient();
  for (const party of parties) {
    const {error} = await supabase.from("party").delete().eq("id", party.id);
    if(error) throw error;
  }

  const buildIds = parties
    .flatMap((party) => party.builds);

  for(const id of buildIds) {
    const {error} = await supabase.from("build").delete().eq("id", id);
    if(error) {throw error; }
  }

}


export async function addParty(args: {name:string, game: string}): 
  Promise<string> {

  const {name, game} = args;
  const supabase = await createClient();
  const user_id = await (await supabase.auth.getUser()).data.user?.id;

    
  const {data, error} = await supabase.from("party").insert({ //row level security what..
    description: "",
    name,
    game,
    user_id,
    builds: [],
  }).select();
  if(error) throw error;
  return data![0].id;
}


export async function duplicateParty(args: {party: Party}): 
  Promise<void> {
    const supabase = createClient();
    const {data: builds, error} = await supabase.from("build").select().in("id", args.party.builds);
    if (error) throw error;
    const newBuilds = builds!.map((item)=> {
      const build = item as Database["public"]["Tables"]["build"]["Row"];
      const values =  {
        accessory: build.accessory,
        armor_materia: build.armor_materia,
        weapon_materia: build.weapon_materia,
        armor_name: build.armor_name,
        weapon_name: build.weapon_name, 
        armor_schema: build.armor_schema,
        weapon_schema: build.weapon_schema,
        character: build.character,
        game: args.party.game,
        summon_materia: build.summon_materia,
        user_id: args.party.user_id
      }
      return values;
    })

    const { data, error: build_insert_error } = await supabase
      .from("build")
      .insert(newBuilds).select();
    if(build_insert_error) throw build_insert_error;
    const buildIds = data!.map((d)=>d.id); 

    const { error: party_insert_error } = await supabase
      .from("party")
      .insert({
       ...args.party, builds: buildIds, id: undefined, name: args.party.name + " copy"
      });
    if (party_insert_error) throw (party_insert_error);
}





