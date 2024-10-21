import { Database } from "@/utils/supabase/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Error from "@/components/Error";
import { DisplayBuild, Game, Link, Party } from "@/utils/frontend-types";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditBuilds from "./EditBuilds";

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

export default function EditParty({
  party,
  setEdit,
  builds,
  links,
  fetchProps,
}: {
  party: Party;
  setEdit: Dispatch<SetStateAction<boolean>>;
  builds: DisplayBuild[];
  links: Link[];
  fetchProps: () => Promise<void>;
}) {
  const [editedName, setEditedName] = useState(party.name);
  const [editedDescription, setEditedDescription] = useState(party.description);
  const [editedBuilds, setEditedBuilds] = useState(builds);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const newParty: Party = {
      name: editedName,
      builds: editedBuilds.map((b) => b.id),
      description: editedDescription,
      id: party.id,
      user_id: party.user_id,
      game: party.game,
    };

    const deletedBuilds = party.builds.filter(
      (b) => !newParty.builds.includes(b)
    );
    const addedBuilds = newParty.builds.filter(
      (b) => !party.builds.includes(b)
    );
    const newBuilds = editedBuilds.map((b) => buildValues(b));

    setEdit(false);
    fetchProps();
  };

  return (
    <div>
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
          <button onClick={() => setEdit(false)}>cancel</button>
        </div>
        <Error error={error} />

        <div className="center" style={{ padding: "0 1.2rem" }}>
          <textarea
            placeholder="description"
            value={editedDescription || ""}
            style={{ minWidth: "100%" }}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </div>
        <DndProvider backend={HTML5Backend}>
          <EditBuilds builds={builds} links={links} game={party.game} />
        </DndProvider>
      </div>
      <br />
    </div>
  );
}
