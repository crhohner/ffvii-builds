"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/service";

export async function deleteAccount() {
  const supabase = createClient();

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId)  redirect("/error")


  const { error: deleteBuildsError } = await supabase
        .from('build') 
        .delete()
        .eq('user_id', userId); 

  if (deleteBuildsError) redirect("/error")


  const { error: deletePartiesError } = await supabase
        .from('party') 
        .delete()
        .eq('user_id', userId); 

  if (deletePartiesError) redirect("/error")

 

  const { error } = await supabase.auth.admin.deleteUser(userId);
  console.log(error)
 
  if (error) redirect("/error") //not awesome handling of errs
  

  revalidatePath("/", "layout");
  redirect("/");
}