"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function send(formData: FormData) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string
  );
  if (error) {
    console.log(error?.message);
    redirect("/error");
  }
  //don't send to new page? how to do better err handling on this + other form..
}
