import { Character, Materia, Schema } from "./frontend-types";
import { Database } from "./supabase/types"; 

export function gameDisplayString(
  game: Database["public"]["Enums"]["game"]
): string {
  switch (game) {
    case "og": {
      return "1997";
    }
    case "remake": {
      return "Remake";
    }
    case "rebirth": {
      return "Rebirth";
    }
    default: {
      throw TypeError("Invalid game");
    }
  }
}



export function createDefaultBuild(
  game: Database["public"]["Enums"]["game"]
) {
  const val = {
    accessory: null,
    armor_materia: [null],
    weapon_materia: [null],
    armor_name: "",
    weapon_name: "Buster Sword",
    armor_schema: ["single"] as Schema,
    weapon_schema: ["single"] as Schema,
    character: "cloud" as Character,
    game,
    summon_materia: null,
    id: "",
    notes: ""
  };
  switch (game) {
    case "remake":
    case "og": {
      val.armor_name = "Bronze Bangle"
      val.armor_materia = []
      val.armor_schema = []
      val.weapon_schema = ["double"] as Schema
      val.weapon_materia = [null,null]
      break;
    }
    case "rebirth": {
      val.armor_name = "Metal Bracer"
      val.armor_materia = [null]
      val.weapon_materia = [null, null, null, null, null];
      val.armor_schema = ["single"] as Schema,
      val.weapon_schema = ["double","double","single"] as Schema
      break;
    }
    default: {
      throw TypeError("Invalid game");
    }
  }
  return val
}

export function compareMateria(a: Materia, b: Materia) {
  if (a.materia_type == b.materia_type) {
    if (a.name > b.name) return 1;
    else return -1;
  }
  if (a.materia_type > b.materia_type) return 1;
  return -1; }

export function characterDisplayString(
  character: Database["public"]["Enums"]["character"]
): string {
  switch (character) {
    case "cloud": {
      return "Cloud";
    }
    case "barret": {
      return "Barret";
    }
    case "tifa": {
      return "Tifa";
    }
    case "aerith": {
      return "Aerith";
    }
    case "red-xiii": {
      return "Red XIII";
    }
    case "yuffie": {
      return "Yuffie";
    }
    case "cait-sith": {
      return "Cait Sith"; /*Cat Shit?*/
    }
    case "cid": {
      return "Cid";
    }
    case "vincent": {
      return "Vincent";
    }
    default: {
      throw TypeError("Invalid character");
    }
  }
}

export const allChars: Database["public"]["Enums"]["character"][] = [
  "cloud",
  "barret",
  "tifa",
  "aerith",
  "red-xiii",
  "yuffie",
  "cait-sith",
  "cid",
  "vincent",
];
export const allGames: Database["public"]["Enums"]["game"][] = [
  "remake",
  "rebirth",
  "og",
];

export const nullId = "00000000-0000-0000-0000-000000000000";

//whats the game plan for making new parties?

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //LMAO

export function validCharacters(game: Database["public"]["Enums"]["game"]) : Database["public"]["Enums"]["character"][]{
  if(game === "og") {
    return allChars;
  }
 else if (game === "remake") {
  return allChars.slice(0,4);
 }
 else return allChars.slice(0,7);
}

export const allColors: Database["public"]["Enums"]["materia_type"][] = [
  "blue",
  "red",
  "green",
  "purple",
  "yellow"
]