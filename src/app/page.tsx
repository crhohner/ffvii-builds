"use client";
/*import { cache } from "react";
import { Database } from "../../database.types";
import { type SupabaseClient } from "@supabase/auth-helpers-nextjs";*/
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default async function Home() {
  const supabase = createClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        redirect("/password/reset");
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <>home page</>;
}

/*<span>MATERIA: {JSON.stringify(materia)}</span>
      <br />
      <span>ACCESSORIES: {JSON.stringify(accessories)}</span>
      <br />*/

/*const materia = await getAllMateria();
  const accessories = await getAllAccessories();*/

/*const supabase: SupabaseClient<Database> = createClient();

const getAllMateria = cache(async () => {
  const item = await supabase.from("materia").select("*");
  return item;
});

const getAllAccessories = cache(async () => {
  const item = await supabase.from("accessory").select("*");
  return item;
});*/
