"use client";

import { Database } from "@/utils/supabase/types";
import {
  Accessory,
  DisplayBuild,
  emptyMateria,
  Equipment,
  Game,
  Link,
  Materia,
  Party,
  Schema,
} from "@/utils/frontend-types";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import { fetchProps } from "../fetch";
import EditBuild from "./EditBuild";
import { TouchBackend } from "react-dnd-touch-backend";
import { createDefaultBuild, nullId } from "@/utils/util";
import { updateParty } from "./action";
import { useRouter } from "next/navigation";
import { PostgresError } from "postgres";
import { isMobile } from "react-device-detect";
import Error from "@/components/Error";
import Image from "next/image";

interface Params {
  params: {
    party: string;
  };
}

function Info({ close }: { close: () => void }) {
  return (
    <>
      <div className="shade" />
      <div className="popup" style={{ textWrap: "pretty" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2>User Guide:</h2>
          <Image src="/esc.svg" height={20} width={20} alt="" onClick={close} />
        </div>
        <p>Select a weapon to load in its default layout.</p>
        <p>Use the + and - buttons to edit weapon layouts.</p>
        <p>Click once on any slot to select materia.</p>{" "}
        <p>Click once on any slot to empty it.</p>
        <p>Drag and drop materia between slots.</p>
        <p>(Un)link two slots by pressing the x/= button between them.</p>
      </div>
    </>
  );
}

export default function Page({ params }: Params) {
  //SHOULD NOT BE EDITED
  const [links, setLinks] = useState<Link[]>([]);
  const [materia, setMateria] = useState<Map<string, Materia>>();
  const [accessories, setAccessories] = useState<Map<string, Accessory>>();
  const [party, setParty] = useState<Party>(); //need for update
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const backend = isMobile ? TouchBackend : HTML5Backend;

  const fetchPageProps = async () => {
    const result = await fetchProps(params.party);
    if (result === undefined) return;
    const { party, builds, links, accessories, materia, equipment } = result;
    setParty(party);
    setBuilds(builds);
    setLinks(links);
    setAccessories(accessories);
    setEquipment(equipment);
    setMateria(materia);
    const initialItems = builds.flatMap((b) => [
      b.weapon_materia,
      b.armor_materia,
    ]);
    setEquipment(equipment);

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
  const [info, setInfo] = useState<boolean>(false);

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
      notes: build.notes,
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
      updatedSchemas[row].splice(i + 1, 0, "single"); //hmmm
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

  const setSchema = (index: number, schema: Schema) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index] = schema;
    let i = 0;
    let j = 0;
    while (i < schema.length) {
      if (schema[i] === "double") {
        j += 2;
      } else {
        j += 1;
      }
      i += 1;
    }
    const updatedItems = [...items];
    updatedItems[index] = updatedItems[index].slice(0, j);
    while (updatedItems[index].length < j) updatedItems[index].push(null); //stupid
    setSchemas(updatedSchemas);
    setItems(updatedItems);
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

  const handlePut = (index: number[], id: string | null) => {
    const item = id ? materia!.get(id)! : null;
    if (index[0] == -1 && !(item === null || item?.materia_type === "red"))
      return;
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
    const build = createDefaultBuild(party!.game);
    const newItems = [build.weapon_materia, build.armor_materia];
    const newSchemas: Schema[] = [build.weapon_schema, build.armor_schema];

    const updatedItems = [...items];
    updatedItems.splice(updatedItems.length - 1, 0, ...newItems);
    updatedItems[updatedItems.length - 1].push(null); //null summon - eh...

    const updatedSchemas = [...schemas];
    updatedSchemas.push(...newSchemas);

    const updatedBuilds = [...builds];
    updatedBuilds.push(build);

    setBuilds(updatedBuilds);
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };

  const deleteBuild = () => {
    const updatedItems = [...items];
    updatedItems.splice(items.length - 3, 2); //materia - but this only gets one row right?
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
    <DndProvider backend={backend}>
      {party && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
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
              <Image
                src="/info.svg"
                alt=""
                height={24}
                width={24}
                onClick={() => setInfo(true)}
              />
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
                      setSchema={setSchema}
                      summon={items[items.length - 1][index]}
                      key={build.id}
                      build={build}
                      links={links}
                      accessories={accessories!}
                      materia={materia!}
                      equipment={equipment}
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
          {info && <Info close={() => setInfo(false)} />}
        </>
      )}
    </DndProvider>
  );
}
