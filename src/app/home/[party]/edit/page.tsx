"use client";

import { Database } from "@/utils/supabase/types";

import Error from "@/components/Error";
import {
  Accessory,
  DisplayBuild,
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

function buildValues(build: DisplayBuild): {
  game: Game;
  accessory: string | null;
  armor_materia: string[];
  armor_name: string | null;
  armor_schema: Database["public"]["Enums"]["slot_type"][];
  character: Database["public"]["Enums"]["character"];
  id: string;
  summon_materia: string | null;
  weapon_materia: string[];
  weapon_name: string | null;
  weapon_schema: Database["public"]["Enums"]["slot_type"][];
} {
  return {
    game: build.game,
    accessory: build.accessory ? build.accessory.id : null,
    armor_materia: build.armor_materia.map((m) => m.id),
    armor_name: build.armor_name,
    armor_schema: build.armor_materia.map((m) => {
      return m.id as Database["public"]["Enums"]["slot_type"];
    }),
    character: build.character,
    id: build.id,
    summon_materia: build.summon_materia ? build.summon_materia.id : null,
    weapon_materia: build.weapon_materia.map((m) => m.id),
    weapon_name: build.weapon_name,
    weapon_schema: build.weapon_materia.map((m) => {
      return m.id as Database["public"]["Enums"]["slot_type"];
    }),
  };
}

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

  const fetchPageProps = async () => {
    const { party, builds, links, accessories, materia } = await fetchProps(
      params.party
    );
    setParty(party);
    setBuilds(builds);
    setLinks(links);
    setAccessories(accessories);
    setMateria(materia);
    const initialItems = builds.flatMap((b) => [
      b.weapon_materia.map((m) => (m.materia_type == "empty" ? null : m)),
      b.armor_materia.map((m) => (m.materia_type == "empty" ? null : m)),
    ]);
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
  const [party, setParty] = useState<Party>();
  const [builds, setBuilds] = useState<DisplayBuild[]>([]);

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
    setItems(updatedItems); //not clearing off the end
    setSchemas(updatedSchemas);
  };

  // Handle the swapping logic
  const handleDrop = (toIndex: number[], item: Materia | null) => {
    const updatedItems = [...items];

    updatedItems[toIndex[0]][toIndex[1]] = item!;

    setItems(updatedItems); // Update state
  };

  const handleSwap = (toIndex: number[], fromIndex: number[]) => {
    const updatedItems = [...items];

    [
      updatedItems[toIndex[0]][toIndex[1]],
      updatedItems[fromIndex![0]][fromIndex![1]],
    ] = [
      updatedItems[fromIndex![0]][fromIndex![1]],
      updatedItems[toIndex![0]][toIndex![1]],
    ]; // Swap items

    setItems(updatedItems); // Update state
  };

  const handlePut = (index: number[], item: Materia | null) => {
    const updatedItems = [...items];
    updatedItems[index[0]][index[1]] = item;
    setItems(updatedItems); // Update state
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minWidth: "60%",
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
          </div>

          <div className="center" style={{ padding: "0 1.2rem" }}>
            <textarea
              placeholder="description"
              value={editedDescription || ""}
              style={{ minWidth: "100%" }}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {accessories && //only returns with props
              builds.map((build, index) => (
                <EditBuild
                  build={build}
                  links={links}
                  accessories={accessories!}
                  materia={materia!}
                  index={index}
                  updateBuild={(index: number, updatedBuild: DisplayBuild) =>
                    setBuilds((builds) => {
                      const b = [...builds];
                      b[index] = updatedBuild;
                      return b;
                    })
                  }
                  handleAdd={handleAdd}
                  handleLink={handleLink}
                  handleRemove={handleRemove}
                  handleDrop={handleDrop}
                  handleSwap={handleSwap}
                  handlePut={handlePut}
                  weaponMateria={items[index * 2]}
                  armorMateria={items[index * 2 + 1]}
                  weaponSchema={schemas[index * 2]}
                  armorSchema={schemas[index * 2 + 1]}
                />
              ))}
          </div>
        </div>

        {materia && <SelectMateria allMateria={materia} />}
      </div>
    </DndProvider>
  );
}

//maybe make the rows children on edit build so they're managed separately??
