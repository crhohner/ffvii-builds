
import { createClient } from "@/utils/supabase/server";
import { Party } from "./page";
import { revalidatePath } from "next/cache";

export async function deleteParties(parties: Party[]): Promise<void> {
  "use server"
  const supabase = await createClient();

  
  for (const party of parties) {
    const {error} = await supabase.from("party").delete().eq("id", party.id);
    if(error) throw error;
  }

  const buildIds = parties
    .flatMap((party) => [party.leader, party.second, party.third])
    .filter(Boolean);

  for(const id of buildIds) {
    const {error} = await supabase.from("build").delete().eq("id", id);
    if(error) throw error;
  }
  revalidatePath("/home");

}


export async function addParty(args: {name:string, game: string}): 
  Promise<Party> {
  "use server"
  const {name, game} = args;
  const supabase = await createClient();
  const user_id = await (await supabase.auth.getUser()).data.user?.id;

    
  const {data, error} = await supabase.from("party").insert({ //row level security what..
    description: "",
    name,
    game,
    user_id
  }).select();
  if(error) throw error;

  const party = {...data[0], characters: []} as Party;
  revalidatePath("/home");
  return party;

}

