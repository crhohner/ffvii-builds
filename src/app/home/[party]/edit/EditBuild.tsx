/*build: DisplayBuild — The specific build data that this card represents (accessory, weapon, armor, materia, etc.).
links: Link[] — List of materia links (used for checking if any two materia are linked).
game: Game — Information about the game (to determine valid characters).
index: number — The index of the build in the builds array (used for managing the corresponding build).
onUpdateBuild: (index: number, updatedBuild: DisplayBuild) => void — Callback for when the build is updated (character selection, accessory/weapon/armor name changes, or materia changes).*/

import {
  Accessory,
  Character,
  DisplayBuild,
  Equipment,
  Game,
  Link,
  Materia,
  Schema,
} from "@/utils/frontend-types";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import {
  characterDisplayString,
  compareMateria,
  validCharacters,
} from "@/utils/util";
import Loadout, { Slot } from "./Loadout";
import CustomSelect, { Option } from "@/components/CustomSelect";

function CharacterInput({
  character,
  game,
  onChange,
}: {
  character: Character;
  game: Game;
  onChange: (newCharacter: string) => void;
}) {
  const options: Option[] = validCharacters(game).map((character) => {
    return {
      value: character,
      label: characterDisplayString(character),
    };
  });

  return (
    <div className={styles.property}>
      <h3>CHARACTER</h3>
      <CustomSelect
        options={options}
        searchable={false}
        value={
          {
            value: character,
            label: characterDisplayString(character),
          } as Option
        }
        handler={(option: Option | null) => {
          onChange(option!.value!);
        }}
      />
    </div>
  );
}

function NotesInput({
  notes,
  onChange,
}: {
  notes: string;
  onChange: (new_notes: string) => void;
}) {
  return (
    <div className={styles.property}>
      <h3>NOTES</h3>
      <textarea
        style={{
          //need max width..
          minHeight: "1rem",
          minWidth: "fit-content",
        }}
        name="notes" //it is so bad that the column is misnamed now..
        value={notes} //guess i have to finish the DB then test this on my existing builds to make sure it is not destructive
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}

function WeaponInput({
  weapon,
  schema,
  onChange,
  equipment,
  character,
}: {
  weapon: string;
  onChange: (new_name: string, new_schema: Schema) => void;
  equipment: Equipment[];
  schema: Schema;
  character: Character;
}) {
  const options = equipment
    .filter((e) => e.character === character)
    .map((e) => ({ label: e.name, value: e.schema } as Option));

  return (
    <div className={styles.property}>
      <h3>WEAPON</h3>
      <CustomSelect
        options={options}
        handler={(option: Option | null) => {
          if (option) {
            onChange(option.label, option.value);
          }
        }}
        searchable={true}
        value={{
          value: schema,
          label: weapon,
        }}
      />
    </div>
  );
}

function ArmorInput({
  equipment,
  schema,
  armor_name,
  onChange,
}: {
  schema: Schema;
  equipment: Equipment[];
  armor_name: string;
  onChange: (new_name: string, new_schema: Schema) => void;
}) {
  const options = equipment
    .filter((e) => e.character === null)
    .map((e) => ({ label: e.name, value: e.schema } as Option));

  return (
    <div className={styles.property}>
      <h3>ARMOR</h3>
      <CustomSelect
        options={options}
        handler={(option: Option | null) => {
          if (option) {
            onChange(option.label, option.value);
          }
        }}
        searchable={true}
        value={{
          value: schema,
          label: armor_name,
        }}
      />
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
  onChange: (new_id: string | null) => void;
}) {
  const options = Array.from(accessories.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((a) => {
      return { value: a.id as any, label: a.name, context: a.description };
    });
  options.unshift({ value: undefined, label: "None", context: null });

  return (
    <div className={styles.property}>
      <h3>ACCESSORY</h3>
      <CustomSelect
        options={options}
        handler={(option: Option | null) => {
          onChange(option ? option.value : null);
        }}
        searchable={true}
        value={
          !accessory
            ? null
            : ({
                value: accessory,
                label: accessories.get(accessory!)?.name,
              } as Option)
        }
      />
    </div>
  );
}

export default function EditBuild({
  build,
  links,
  index,
  updateBuild,
  accessories,
  materia,
  equipment,
  handleAdd,
  handleLink,
  handleSwap,
  handleRemove,
  handlePut,
  setSchema,
  weaponMateria,
  armorMateria,
  weaponSchema,
  armorSchema,
  summon,
}: {
  build: DisplayBuild;
  links: Link[];
  index: number;
  accessories: Map<string, Accessory>;
  materia: Map<string, Materia>;
  equipment: Equipment[];
  updateBuild: (index: number, updatedBuild: DisplayBuild) => void;
  handleLink: (link: boolean, row: number, col: number) => void;
  handleAdd: (row: number) => void;
  handleRemove: (row: number) => void;
  handleSwap: (toIndex: number[], fromIndex: number[]) => void;
  handlePut: (index: number[], id: string | null) => void;
  setSchema: (index: number, schema: Schema) => void;
  weaponMateria: (Materia | null)[];
  armorMateria: (Materia | null)[];
  weaponSchema: Schema;
  armorSchema: Schema;
  summon: Materia | null;
}) {
  const [character, setCharacter] = useState<Character>(build.character);
  const [armor, setArmor] = useState<string>(build.armor_name || "");
  const [weapon, setWeapon] = useState<string>(build.weapon_name || "");
  const [accessory, setAccessory] = useState<string | null>(
    build.accessory ? build.accessory.id : null
  );
  const [notes, setNotes] = useState<string>(build.notes);

  const allOptions = Array.from(materia.values())
    .sort(compareMateria)
    .map((m) => ({
      label: m.name,
      context: m.description,
      color: m.materia_type,
      value: m.id,
    }))
    .filter((m) => m.color !== "empty");

  const summonOnly = allOptions.filter((m) => m.color === "red");

  const noSummons = allOptions.filter((m) => m.color !== "red");

  const options = build.game === "og" ? allOptions : noSummons;

  useEffect(() => {
    if (character || accessory || weapon || armor) {
      handleUpdate();
    }
  }, [character, accessory, weapon, armor, notes]);

  function handleUpdate() {
    const newBuild = { ...build };
    newBuild.accessory = accessory ? accessories.get(accessory)! : null;
    newBuild.weapon_name = weapon;
    newBuild.weapon_name = weapon;
    newBuild.character = character;
    newBuild.notes = notes;
    updateBuild(index, newBuild);
  }

  return (
    <div className={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <CharacterInput
          character={character}
          game={build.game}
          onChange={(newCharacter: string) => {
            setCharacter(newCharacter as Character);
          }}
        />
        {build.game !== "og" && (
          <Slot
            options={summonOnly}
            item={summon}
            index={[-1, index]}
            handleSwap={handleSwap}
            handlePut={handlePut}
          />
        )}
      </div>

      <AccessoryInput
        accessories={accessories}
        accessory={accessory}
        onChange={(new_id: string | null) => {
          setAccessory(new_id);
        }}
      />

      <WeaponInput
        character={character}
        schema={weaponSchema}
        equipment={equipment}
        weapon={weapon}
        onChange={(new_name: string, new_schema: Schema) => {
          setWeapon(new_name);
          setSchema(index * 2, new_schema);
        }}
      />
      <Loadout
        options={options}
        handlePut={handlePut}
        row={index * 2}
        items={weaponMateria}
        schema={weaponSchema}
        links={links}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        handleLink={handleLink}
        handleSwap={handleSwap}
      />

      <ArmorInput
        equipment={equipment}
        schema={armorSchema}
        armor_name={armor}
        onChange={(new_name: string, new_schema) => {
          setArmor(new_name);
          setSchema(index * 2 + 1, new_schema);
        }}
      />
      <Loadout
        options={options}
        handleSwap={handleSwap}
        handlePut={handlePut}
        row={index * 2 + 1}
        items={armorMateria}
        schema={armorSchema}
        links={links}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        handleLink={handleLink}
      />
      <NotesInput
        notes={notes}
        onChange={(new_notes: string) => {
          setNotes(new_notes);
        }}
      />
    </div>
  );
}
