import { cache } from "react";
import { Database } from "../../database.types";
import { type SupabaseClient } from "@supabase/auth-helpers-nextjs";

/*const supabase: SupabaseClient<Database> = createClient();

const getAllMateria = cache(async () => {
  const item = await supabase.from("materia").select("*");
  return item;
});

const getAllAccessories = cache(async () => {
  const item = await supabase.from("accessory").select("*");
  return item;
});*/

export default async function Home() {
  /*const materia = await getAllMateria();
  const accessories = await getAllAccessories();*/

  return <>home page</>;
}

/*<span>MATERIA: {JSON.stringify(materia)}</span>
      <br />
      <span>ACCESSORIES: {JSON.stringify(accessories)}</span>
      <br />*/
