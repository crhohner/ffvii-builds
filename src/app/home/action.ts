
import { createClient } from "@/utils/supabase/server";
import { Party } from "./page";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteParties(parties: Party[]) {
  "use server"
  const supabase = await createClient();
  for (const party of parties) {
    await supabase.from("party").delete().eq("id", party.id);
    await supabase.from("build").delete().eq("id", party.leader);
    if (party.second) {
      await supabase.from("build").delete().eq("id", party.second);
    }
    if (party.third) {
      await supabase.from("build").delete().eq("id", party.third);
    }
  }
  revalidatePath("/home");
  //needs a better page refresh

}