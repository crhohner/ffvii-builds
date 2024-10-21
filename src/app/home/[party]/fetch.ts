//grab party id from path
//grab party object from party table
//pass as props to view or edit components

//allowed edits: name, description, party order
//NOT ALLOWED: game changes..

//how to pull id from path?
"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { Database } from "@/utils/supabase/types";

import {
  Accessory,
  DisplayBuild,
  Link,
  Materia,
  Party,
} from "@/utils/frontend-types";

export const fetchProps: (id: string) => Promise<{
  party: Party;
  builds: DisplayBuild[];
  links: Link[];
  accessories: Map<string, Accessory>
  materia:  Map<string, Materia>
}> = async (id: string) => {
  const supabase = createClient();
  const getParty = cache(async () => {
    const item = await supabase.from("party").select("*").eq("id", id);
    return item;
  });

  const getGameAccessories = cache(async () => {
    const item = await supabase
      .from("accessory")
      .select("*")
      .contains("games", [party.game]);
    return item;
  });

  const getGameMateria = cache(async () => {
    const item = await supabase
      .from("materia")
      .select("*")
      .contains("games", [party.game]);
    return item;
  });

  const getBuilds = cache(async () => {
    const builds = await supabase
      .from("build")
      .select("*")
      .in("id", party.builds);
    return builds;
  });

  const response = await getParty();
  const party: Party = response.data![0];

  const { error, data: accs } = await getGameAccessories();
  const allAccessories = new Map<string, Accessory>(
    accs!.map((a) => [a.id, a])
  );
  if (error) console.log(error);

  const { data: mats } = await getGameMateria();
  const allMateria = new Map<string, Materia>(mats!.map((m) => [m.id, m]));

  const blues: string[] | undefined = mats
    ?.filter((m: Materia) => m.materia_type == "blue")
    .map((m) => m.id);

  const getLinks = cache(async () => {
    const links = await supabase
      .from("materia_link")
      .select("*")
      .in("blue_id", blues!);
    return links;
  });

  let { data: links } = await getLinks();
  if (!links) {
    links = [];
  }

  const { data: blds } = await getBuilds(); //will sort the party order by table order
  const bldMap = new Map<string, Database["public"]["Tables"]["build"]["Row"]>(
    blds!.map((b) => [b.id, b])
  );

  function displayBuild(
    build: Database["public"]["Tables"]["build"]["Row"]
  ): DisplayBuild {
    const accessory = build.accessory
      ? (allAccessories.get(build.accessory) as Accessory)
      : null;
    const armor_materia = build.armor_materia.map((id) =>
      allMateria.get(id)
    ) as Materia[];
    const weapon_materia = build.weapon_materia.map((id) =>
      allMateria.get(id)
    ) as Materia[];
    const summon_materia = build.summon_materia
      ? (allMateria.get(build.summon_materia) as Materia)
      : null;
    return {
      game: build.game,
      armor_materia,
      weapon_materia,
      accessory,
      character: build.character,
      id: build.id,
      weapon_schema: build.weapon_schema,
      armor_schema: build.armor_schema,
      weapon_name: build.weapon_name,
      armor_name: build.armor_name,
      summon_materia,
    };
  }

  const builds = party.builds.map((id) => displayBuild(bldMap.get(id)!)); //fixes party order
  return { party, builds, links, accessories: allAccessories, materia: allMateria};
};
