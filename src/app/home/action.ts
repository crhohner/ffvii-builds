
import { createClient } from "@/utils/supabase/server";
import { Party } from "./page";
import { revalidatePath } from "next/cache";
import { AuthError, Session, User, UserResponse } from "@supabase/supabase-js";

export async function deleteParties(parties: Party[]): Promise<void> {
  "use server"
  const supabase = await createClient();
  for (const party of parties) {
    await supabase.from("party").delete().eq("id", party.id);
    if(party.leader) {
      await supabase.from("build").delete().eq("id", party.leader);
    }
    if (party.second) {
      await supabase.from("build").delete().eq("id", party.second);
    }
    if (party.third) {
      await supabase.from("build").delete().eq("id", party.third);
    }
  }
  revalidatePath("/home");
}


export async function addParty(args: {name:string, game: string}): Promise<void> {
  "use server"
  const {name, game} = args;
  const supabase = await createClient();
  const user_id = await (await supabase.auth.getUser()).data.user?.id;
  console.log(user_id);
  const {error} = await supabase.from("party").insert({ //row level security what..
    description: "",
    name,
    game,
    user_id
  })
  if(error) {
    console.log("insert err: "+error.message)
  }
  revalidatePath("/home");
}

