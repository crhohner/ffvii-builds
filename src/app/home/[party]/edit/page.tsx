"use client";

import { Database } from "@/utils/supabase/types";
import {
  Accessory,
  DisplayBuild,
  emptyMateria,
  Game,
  Link,
  Materia,
  Party,
} from "@/utils/frontend-types";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import { fetchProps } from "../fetch";
import EditBuild from "./EditBuild";
import SelectMateria from "./SelectMateria";
import { nullId } from "@/utils/util";
import { updateParty } from "./action";
import { useRouter } from "next/navigation";
import { PostgresError } from "postgres";
import Error from "@/components/Error";

interface Params {
  params: {
    party: string;
  };
}

export default function Page({ params }: Params) {
  //SHOULD NOT BE EDITED
  const [links, setLinks] = useState<Link[]>([]);
  const [materia, setMateria] = useState<Map<string, Materia>>();
  const [accessories, setAccessories] = useState<Map<string, Accessory>>();
  const [party, setParty] = useState<Party>(); //need for update

  const fetchPageProps = async () => {
    const result = await fetchProps(params.party);
    if (result === undefined) return;
    const { party, builds, links, accessories, materia } = result;
    setParty(party);
    setBuilds(builds);
    setLinks(links);
    setAccessories(accessories);
    setMateria(materia);
    const initialItems = builds.flatMap((b) => [
      b.weapon_materia,
      b.armor_materia,
    ]);

    initialItems.push(builds.map((b) => b.summon_materia));
    setItems(initialItems);

    const initialSchemas = builds.flatMap((b) => [
      b.weapon_schema,
      b.armor_schema,
    ]);
    setSchemas(initialSchemas);
    setEditedName(party.name);
    setEditedDescription(party.description || "");
  };

  useEffect(() => {
    fetchPageProps();
  }, []);

  //SHOULD BE EDITED - save pulls from all of these..
  const [items, setItems] = useState<(null | Materia)[][]>([]);
  const [schemas, setSchemas] = useState<("single" | "double")[][]>([]);
  const [editedName, setEditedName] = useState<string>();
  const [editedDescription, setEditedDescription] = useState<string>();
  const [builds, setBuilds] = useState<DisplayBuild[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  function buildValues(
    build: DisplayBuild
  ): Database["public"]["Tables"]["build"]["Row"] {
    return {
      game: build.game,
      accessory: build.accessory ? build.accessory.id : null,
      armor_materia: build.armor_materia.map((m) => (m ? m.id : nullId)),
      armor_name: build.armor_name,
      armor_schema: build.armor_schema,
      character: build.character,
      id: build.id,
      summon_materia: build.summon_materia ? build.summon_materia.id : nullId,
      weapon_materia: build.weapon_materia.map((m) => (m ? m.id : nullId)),
      weapon_name: build.weapon_name,
      weapon_schema: build.weapon_schema,
      user_id: party!.user_id,
    };
  }

  const handleSave = async () => {
    // make builds by placing items / schemas and converting
    const updatedBuilds: Database["public"]["Tables"]["build"]["Row"][] =
      builds.map((build, index) => {
        const newBuild = { ...build };
        newBuild.weapon_materia = items[index * 2];
        newBuild.armor_materia = items[index * 2 + 1];
        newBuild.weapon_schema = schemas[index * 2];
        newBuild.armor_schema = schemas[index * 2 + 1];
        newBuild.summon_materia = items[items.length - 1][index];
        return buildValues(newBuild);
      });
    //new builds will have weird ids...

    const newParty = { ...party! };
    newParty.description = editedDescription!;
    newParty.name = editedName!;

    try {
      await updateParty({ newParty, updatedBuilds });
    } catch (error) {
      setError((error as PostgresError).message);
      return;
    }
    router.back();
    //make new party with new fields, desc, ignoring builds
    //pass to server call
  };

  const handleAdd = (row: number) => {
    const updatedItems = [...items];
    updatedItems[row].push(null);
    const updatedSchemas = [...schemas];
    updatedSchemas[row].push("single");
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };

  const handleLink = (link: boolean, row: number, col: number) => {
    const updatedSchemas = [...schemas];
    let i = 0;
    let j = 0;
    while (j < col) {
      if (schemas[row][i] === "double") {
        j += 2;
      } else {
        j += 1;
      }
      i += 1;
    }

    if (!link) {
      updatedSchemas[row][i] = "single";
      updatedSchemas[row].splice(i + 1, 0, "single");
    } else {
      const left = updatedSchemas[row][i];
      if (left === "double") return;
      const right = updatedSchemas[row][i + 1];
      if (right === "double") return;
      updatedSchemas[row][i] = "double";
      updatedSchemas[row].splice(i + 1, 1);
    }

    setSchemas(updatedSchemas);
  };

  const handleRemove = (row: number) => {
    const updatedItems = [...items];
    updatedItems[row].pop();
    const updatedSchemas = [...schemas];
    const popped = updatedSchemas[row].pop();
    if (popped === "double") {
      updatedSchemas[row].push("single");
    }
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };

  const handleSwap = (toIndex: number[], fromIndex: number[]) => {
    if (toIndex[0] === -1 || fromIndex[0] === -1) {
      if (toIndex[0] !== fromIndex[0]) return;
    }

    const toRow = toIndex[0] === -1 ? items.length - 1 : toIndex[0];
    const fromRow = fromIndex[0] === -1 ? items.length - 1 : fromIndex[0];

    const updatedItems = [...items];

    [updatedItems[toRow][toIndex[1]], updatedItems[fromRow][fromIndex![1]]] = [
      updatedItems[fromRow][fromIndex![1]],
      updatedItems[toRow][toIndex![1]],
    ];

    setItems(updatedItems);
  };

  const handlePut = (index: number[], item: Materia | null) => {
    if (index[0] == -1 && item?.materia_type !== "red") return;
    if (party!.game !== "og" && index[0] !== -1 && item?.materia_type === "red")
      return;
    const col = index[1];
    const row = index[0] === -1 ? items.length - 1 : index[0];
    const updatedItems = [...items];
    updatedItems[row][col] = item;
    setItems(updatedItems);
  };

  const swapBuilds = (idx1: number, idx2: number) => {
    const updatedItems = [...items];
    [updatedItems[idx1 * 2], updatedItems[idx2 * 2]] = [
      //weapons
      updatedItems[idx2 * 2],
      updatedItems[idx1 * 2],
    ];
    [updatedItems[idx1 * 2 + 1], updatedItems[idx2 * 2 + 1]] = [
      //armor
      updatedItems[idx2 * 2 + 1],
      updatedItems[idx1 * 2 + 1],
    ];

    //summons?
    [
      updatedItems[items.length - 1][idx1],
      updatedItems[items.length - 1][idx2],
    ] = [
      updatedItems[items.length - 1][idx2],
      updatedItems[items.length - 1][idx1],
    ];

    const updatedSchemas = [...schemas];

    [updatedSchemas[idx1 * 2], updatedSchemas[idx2 * 2]] = [
      //weapons
      updatedSchemas[idx2 * 2],
      updatedSchemas[idx1 * 2],
    ];
    [updatedSchemas[idx1 * 2 + 1], updatedSchemas[idx2 * 2 + 1]] = [
      //armor
      updatedSchemas[idx2 * 2 + 1],
      updatedSchemas[idx1 * 2 + 1],
    ];

    const updatedBuilds = [...builds];
    [updatedBuilds[idx1], updatedBuilds[idx2]] = [
      updatedBuilds[idx2],
      updatedBuilds[idx1],
    ];
    setBuilds(updatedBuilds);
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };

  const addBuild = () => {
    const updatedItems = [...items];

    updatedItems.splice(Math.max(items.length - 2, 0), 0, [null]); //weapon
    updatedItems.splice(Math.max(items.length - 3, 1), 0, [null]); //armor

    updatedItems[updatedItems.length - 1].push(null); //null summon

    const updatedSchemas = [...schemas];
    updatedSchemas.push(["single"]); //weapon
    updatedSchemas.push(["single"]); //armor

    const updatedBuilds = [...builds];
    updatedBuilds.push({
      accessory: null,
      armor_materia: [null],
      weapon_materia: [null],
      armor_name: "Cooler Armor",
      weapon_name: "Cool Weapon",
      armor_schema: ["single"],
      weapon_schema: ["single"],
      character: "cloud",
      game: party!.game,
      summon_materia: null,
      id: "",
    });
    setBuilds(updatedBuilds);
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };

  const deleteBuild = () => {
    const updatedItems = [...items];
    updatedItems.splice(items.length - 2, 1); //materia
    updatedItems[updatedItems.length - 1].pop(); //summon
    const updatedSchemas = [...schemas];
    updatedSchemas.pop();
    updatedSchemas.pop();
    const updatedBuilds = [...builds];
    updatedBuilds.pop();
    setBuilds(updatedBuilds);
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };
  const updateBuild = (index: number, updatedBuild: DisplayBuild) =>
    setBuilds((builds) => {
      const b = [...builds];
      b[index] = updatedBuild;
      return b;
    });

  return (
    <DndProvider backend={HTML5Backend}>
      {party && (
        <div className="center" style={{ display: "flex", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <button onClick={handleSave}>save</button>
            </div>
            <Error error={error} />

            <div className="center" style={{ padding: "0 1rem" }}>
              <textarea
                placeholder="description"
                value={editedDescription || ""}
                style={{ minWidth: "100%" }}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {accessories && //only returns with props
                builds.map((build, index) => (
                  <>
                    <EditBuild
                      summon={items[items.length - 1][index]}
                      key={build.id}
                      build={build}
                      links={links}
                      accessories={accessories!}
                      materia={materia!}
                      index={index}
                      updateBuild={updateBuild}
                      handleAdd={handleAdd}
                      handleLink={handleLink}
                      handleRemove={handleRemove}
                      handleSwap={handleSwap}
                      handlePut={handlePut}
                      weaponMateria={items[index * 2]}
                      armorMateria={items[index * 2 + 1]}
                      weaponSchema={schemas[index * 2]}
                      armorSchema={schemas[index * 2 + 1]}
                    />
                    {index < builds.length - 1 && (
                      <div
                        key={"swap" + index}
                        style={{
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "center",
                        }}
                      >
                        <button onClick={() => swapBuilds(index, index + 1)}>
                          ↑ ↓
                        </button>
                      </div>
                    )}
                  </>
                ))}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                {builds.length > 1 && <button onClick={deleteBuild}>-</button>}
                {builds.length < 3 && <button onClick={addBuild}>+</button>}
              </div>
            </div>
          </div>

          {materia && <SelectMateria allMateria={materia} />}
        </div>
      )}
    </DndProvider>
  );
}
