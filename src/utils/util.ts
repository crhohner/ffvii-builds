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
  game: Database["public"]["Enums"]["character"]
): string {
  switch (game) {
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
  "tifa",
  "barret",
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

//whats the game plan for making new parties?
