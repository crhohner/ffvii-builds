"use server"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

export async function updateParty(args: {newParty:  Database["public"]["Tables"]["party"]["Row"], 
  updatedBuilds: Database["public"]["Tables"]["build"]["Row"][], 
 }): Promise<void> {

  const prevBuilds = args.newParty.builds;
  const supabase = createClient();

  const buildIds : string[]= []
  for (const build of args.updatedBuilds) {
    const values = {
      accessory: build.accessory,
      armor_materia: build.armor_materia,
      weapon_materia: build.weapon_materia,
      armor_name: build.armor_name,
      weapon_name: build.weapon_name, 
      armor_schema: build.armor_schema,
      weapon_schema: build.weapon_schema,
      character: build.character,
      game: args.newParty.game,
      summon_materia: build.summon_materia,
      user_id: args.newParty.user_id
    }
    if (prevBuilds.includes(build.id)) {
      //update
      
      const {error: update_error} = await supabase.from("build").update(values).eq("id", build.id);
      if(update_error) throw update_error;
      buildIds.push(build.id)


    } else  {
      //insert
      const {data, error: insert_error} = await supabase.from("build").insert(values).select();
      if(insert_error) {throw insert_error}
      buildIds.push(data![0].id)
    }
    
  }

  //delete builds


  const deletedBuilds = prevBuilds.filter((b) => !(args.updatedBuilds.map((bd)=>bd.id).includes(b)))
  const {error: delete_error} = await supabase.from("build").delete().in("id", deletedBuilds)
  if (delete_error) throw delete_error;

 

  //update party
  const values = {...args.newParty}
  values.builds =  buildIds;

  const {error: update_error} = await supabase.from("party").update(values).eq("id", args.newParty.id)
  if (update_error) throw update_error;

  
  }
