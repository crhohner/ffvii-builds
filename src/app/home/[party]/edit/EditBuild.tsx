/*build: DisplayBuild — The specific build data that this card represents (accessory, weapon, armor, materia, etc.).
links: Link[] — List of materia links (used for checking if any two materia are linked).
game: Game — Information about the game (to determine valid characters).
index: number — The index of the build in the builds array (used for managing the corresponding build).
onUpdateBuild: (index: number, updatedBuild: DisplayBuild) => void — Callback for when the build is updated (character selection, accessory/weapon/armor name changes, or materia changes).*/

import {
  Accessory,
  Character,
  DisplayBuild,
  Game,
  Link,
  Materia,
  Schema,
} from "@/utils/frontend-types";
import { useState } from "react";
import styles from "../page.module.css";
import { characterDisplayString, validCharacters } from "@/utils/util";
import Loadout from "./Loadout";

function CharacterInput({
  character,
  game,
  onChange,
}: {
  character: Character;
  game: Game;
  onChange: (newCharacter: string) => void;
}) {
  return (
    <div className={styles.property}>
      <h3>CHARACTER</h3>
      <select value={character} onChange={(e) => onChange(e.target.value)}>
        {validCharacters(game).map((character) => {
          return (
            <option key={character} value={character}>
              {characterDisplayString(character)}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function WeaponInput({
  weapon_name,
  onChange,
}: {
  weapon_name: string;
  onChange: (new_name: string) => void;
}) {
  return (
    <div className={styles.property}>
      <h3>WEAPON</h3>
      <input
        name="weapon_name"
        value={weapon_name}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}

function ArmorInput({
  armor_name,
  onChange,
}: {
  armor_name: string;
  onChange: (new_name: string) => void;
}) {
  return (
    <div className={styles.property}>
      <h3>ARMOR</h3>
      <input
        name="armor_name"
        value={armor_name}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}

function AccessoryInput({
  accessory,
  accessories,
  onChange,
}: {
  accessory: string | null;
  accessories: Map<string, Accessory>;
  onChange: (new_id: string) => void;
}) {
  return (
    <div className={styles.property}>
      <h3>ACCESSORY</h3>
      <select
        value={accessory ? accessory : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option key="None" value={undefined}>
          None
        </option>
        {Array.from(accessories.values()).map((a) => {
          return (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default function EditBuild({
  build,
  links,
  index,
  updateBuild,
  accessories,
  handleAdd,
  handleLink,
  handleDrop,
  handleSwap,
  handleRemove,
  handlePut,
  weaponMateria,
  armorMateria,
  weaponSchema,
  armorSchema,
}: {
  build: DisplayBuild;
  links: Link[];
  index: number;
  accessories: Map<string, Accessory>;
  materia: Map<string, Materia>;
  updateBuild: (index: number, updatedBuild: DisplayBuild) => void;
  handleLink: (link: boolean, row: number, col: number) => void;
  handleAdd: (row: number) => void;
  handleRemove: (row: number) => void;
  handleDrop: (toIndex: number[], item: Materia | null) => void;
  handleSwap: (toIndex: number[], fromIndex: number[]) => void;
  handlePut: (index: number[], item: Materia | null) => void;
  weaponMateria: (Materia | null)[];
  armorMateria: (Materia | null)[];
  weaponSchema: Schema;
  armorSchema: Schema;
}) {
  const [character, setCharacter] = useState<Character>(build.character);
  const [armor, setArmor] = useState<string>(build.armor_name || "");
  const [weapon, setWeapon] = useState<string>(build.weapon_name || "");
  const [accessory, setAccessory] = useState<string | null>(
    build.accessory ? build.accessory.id : null
  );

  function handleUpdate() {
    const newBuild = { ...build };
    newBuild.accessory = accessory ? accessories.get(accessory)! : null;
    newBuild.weapon_name = weapon;
    newBuild.weapon_name = weapon;
    newBuild.character = character;
    updateBuild(index, newBuild);
  }

  return (
    <div className={styles.card}>
      <CharacterInput
        character={character}
        game={build.game}
        onChange={(newCharacter: string) => {
          setCharacter(newCharacter as Character);
          handleUpdate();
        }}
      />
      <AccessoryInput
        accessories={accessories}
        accessory={accessory}
        onChange={(new_id: string) => {
          setAccessory(new_id);
          handleUpdate();
        }}
      />
      <WeaponInput
        weapon_name={weapon}
        onChange={(new_name: string) => {
          setWeapon(new_name);
          handleUpdate();
        }}
      />
      <Loadout
        handlePut={handlePut}
        row={index * 2}
        items={weaponMateria}
        schema={weaponSchema}
        links={links}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        handleLink={handleLink}
        handleDrop={handleDrop}
        handleSwap={handleSwap}
      />
      <ArmorInput
        armor_name={armor}
        onChange={(new_name: string) => {
          setArmor(new_name);
          handleUpdate();
        }}
      />
      <Loadout
        handleSwap={handleSwap}
        handlePut={handlePut}
        row={index * 2 + 1}
        items={armorMateria}
        schema={armorSchema}
        links={links}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        handleLink={handleLink}
        handleDrop={handleDrop}
      />
    </div>
  );
}
