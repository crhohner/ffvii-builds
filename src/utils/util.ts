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