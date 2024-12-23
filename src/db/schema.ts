import { pgTable, text, pgEnum, uuid, primaryKey } from "drizzle-orm/pg-core";

export const MateriaType = pgEnum("materia_type", [
  "red",
  "yellow",
  "green",
  "blue",
  "purple",
  "empty"
]);
export const Game = pgEnum("game", ["og", "remake", "rebirth"]);
export const Character = pgEnum("character", [
  "cloud",
  "barret",
  "tifa",
  "aerith",
  "red-xiii",
  "yuffie",
  "cait-sith",
  "cid",
  "vincent",
]);
export const SlotType = pgEnum("slot_type", ["single", "double"]);

export const Materia = pgTable("materia", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  type: MateriaType("materia_type").notNull(),
  games: Game("games").array().notNull(),
});

export const Equipment = pgTable(
  "equipment",
  {
    name: text("name").notNull(),
    id: uuid("id").primaryKey().defaultRandom(),
    schema: SlotType("schema").array().notNull(),
    game: Game("game").notNull(),
    character: Character("character") //null for armor, duh
  });

export const MateriaLink = pgTable(
  "materia_link",
  {
    blueId: uuid("blue_id")
      .references(() => Materia.id)
      .notNull(),
    targetId: uuid("target_id")
      .references(() => Materia.id)
      .notNull(),
  },
  (table) => {
    return {
      primaryKey: primaryKey({ columns: [table.blueId, table.targetId] }),
    };
  }
);

export const Accessory = pgTable("accessory", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  games: text("games").array().notNull(),
});

export const Build = pgTable("build", {
  //don't expose these for now..
  id: uuid("id").primaryKey().defaultRandom(),
  user: uuid("user_id").notNull(),
  character: Character("character").notNull(),
  accessory: uuid("accessory").references(() => Accessory.id),
  weaponMateria: uuid("weapon_materia").array().notNull(),
  weaponName: text("weapon_name").notNull(),
  armorMateria: uuid("armor_materia").array().notNull(),
  armorName: text("armor_name").notNull(),
  summonMateria: uuid("summon_materia").references(() => Materia.id),
  weaponSchema: SlotType("weapon_schema").array().notNull(),
  armorSchema: SlotType("armor_schema").array().notNull(),
  game: Game("game").notNull(),
});

export const Party = pgTable("party", {
  //each party made with nine builds??? so switching back later saves info?
  //for later ^^ for now, switching chars wipes out build info
  //sleep on this actually..
  id: uuid("id").primaryKey().defaultRandom(), //implement copy-paste for builds?
  user: uuid("user_id").notNull(),
  game: Game("game").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  builds: uuid("builds").array().notNull(),
});
