import { Database } from "./supabase/types";

export type Character = Database["public"]["Enums"]["character"];
export type Game = Database["public"]["Enums"]["game"];
export type DisplayParty = Database["public"]["Tables"]["party"]["Row"] & {
  characters: Character[];
};

export type DisplayBuild = {
  game: Game;
  accessory: Accessory | null;
  armor_materia: (Materia | null) [];
  armor_name: string | null;
  armor_schema: Database["public"]["Enums"]["slot_type"][];
  character: Database["public"]["Enums"]["character"];
  id: string;
  summon_materia: Materia | null;
  weapon_materia: (Materia | null) [];
  weapon_name: string | null;
  weapon_schema: Database["public"]["Enums"]["slot_type"][];
};

export const emptyMateria : Materia = {
id: "00000000-0000-0000-0000-000000000000",
description: null,
name: "empty",
games: ["og","rebirth","remake"],
materia_type: "empty"
}


export type Materia = Database["public"]["Tables"]["materia"]["Row"];
export type Accessory = Database["public"]["Tables"]["accessory"]["Row"];
export type Party = Database["public"]["Tables"]["party"]["Row"];
export type Link = Database["public"]["Tables"]["materia_link"]["Row"];
export type Schema = Database["public"]["Enums"]["slot_type"][];
