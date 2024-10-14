import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

export async function updateParty(args: {newParty:  Database["public"]["Tables"]["party"]["Row"]}) {
  "use server"
  //idek
  const supabase = createClient();
  console.log(JSON.stringify(args.newParty));
  const { error } = await supabase
  .from('party')
  .update(args.newParty)
  .eq('id', args.newParty.id);
  console.log(error);


}