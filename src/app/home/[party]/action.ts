import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

export async function updateParty(newParty:  Database["public"]["Tables"]["party"]["Row"], oldParty:  Database["public"]["Tables"]["party"]["Row"]): Promise<void> {
  "use server"
  //idek

}