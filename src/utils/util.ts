import { Database } from "./supabase/types";

export function gameToString(
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
