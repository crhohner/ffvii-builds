import { pgTable, text, pgEnum, uuid, primaryKey } from "drizzle-orm/pg-core";

export const MateriaType = pgEnum("materia_type", [
  "red",
  "yellow",
  "green",
  "blue",
  "purple",
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

export const Schema = pgTable("schema", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: uuid("user").notNull(),
  name: text("name").notNull(),
  slots: SlotType("slots").array().notNull(),
});

export const Build = pgTable("build", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: uuid("user").notNull(),
  game: Game("game").notNull(),
  character: Character("character").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  accessory: uuid("accessory")
    .references(() => Accessory.id)
    .notNull(),
  weaponSchema: uuid("weapon_schema")
    .references(() => Schema.id)
    .notNull(),
  armorSchema: uuid("armor_schema")
    .references(() => Schema.id)
    .notNull(),
  weaponMateria: text("weapon_materia").array().notNull(),
  armorMateria: text("armor_materia").array().notNull(),
  summonMateria: text("summon_materia"),
});

export const Party = pgTable("party", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: uuid("user").notNull(),
  game: Game("game").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  leader: uuid("leader")
    .references(() => Build.id)
    .notNull(),
  second: uuid("second")
    .references(() => Build.id)
    .notNull(),
  third: uuid("third").references(() => Build.id),
});
