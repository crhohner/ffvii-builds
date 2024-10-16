import { Database } from "@/utils/supabase/types";
import { Dispatch, SetStateAction, useState } from "react";

import Card from "./Card";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { updateParty } from "./action";
import { DisplayBuild, Party } from "@/utils/frontend-types";

export default function EditParty({
  party,
  setEdit,
  builds,
  links,
  fetch,
}: {
  party: Party;
  setEdit: Dispatch<SetStateAction<boolean>>;
  builds: DisplayBuild[];
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
  fetch: () => Promise<void>;
}) {
  const [editedName, setEditedName] = useState(party.name);
  const [editedDescription, setEditedDescription] = useState(party.description);
  const [editedBuilds, setEditedBuilds] = useState(party.builds);
  const [error, setError] = useState<string | null>(null);

  function handleArrow(index: number) {
    setEditedBuilds((editedBuilds) => {
      let builds = [...editedBuilds];

      let temp = builds[index + 1];
      builds[index + 1] = builds[index];
      builds[index] = temp;

      return builds;
    });
  }

  const handleSave = async () => {
    const newParty: Party = {
      name: editedName,
      builds: editedBuilds,
      description: editedDescription,
      id: party.id,
      user_id: party.user_id,
      game: party.game,
    };
    try {
      await updateParty({ newParty });
    } catch (error) {
      setError((error as PostgresError).message);
      setEdit(true);
      return;
    }
    setEdit(false);
    fetch();
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
      </div>
      <br />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {editedBuilds?.map((id, index) => {
          const build = builds?.filter((b) => b.id == id)[0]!; //ew
          return (
            <div key={index}>
              <Card
                build={build}
                leader={index === 0}
                links={links}
                icons={false}
                party={party}
                fetch={fetch}
              />
              {index !== editedBuilds.length - 1 && (
                <div
                  className="center"
                  style={{ gap: "1rem", paddingTop: "1rem" }}
                >
                  <button onClick={() => handleArrow(index)}>↓ ↑</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
