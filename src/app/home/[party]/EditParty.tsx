import { Database } from "@/utils/supabase/types";
import { Dispatch, SetStateAction, useState } from "react";
import { DisplayBuild } from "./page";
import Card from "./Card";

export default function EditParty({
  party,
  setEdit,
  builds,
  links,
  insertAction,
}: {
  party: Database["public"]["Tables"]["party"]["Row"];
  setEdit: Dispatch<SetStateAction<boolean>>;
  builds: DisplayBuild[];
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
  insertAction: (
    oldParty: Database["public"]["Tables"]["party"]["Row"],
    newParty: Database["public"]["Tables"]["party"]["Row"]
  ) => Promise<void>;
}) {
  const [editedName, setEditedName] = useState(party.name);
  const [editedDescription, setEditedDescription] = useState(party.description);
  const [editedBuilds, setEditedBuilds] = useState(party.builds);

  function handleArrow(up: boolean, index: number) {
    setEditedBuilds((editedBuilds) => {
      let builds = [...editedBuilds];

      let temp = builds[index + 1];
      builds[index + 1] = builds[index];
      builds[index] = temp;

      return builds;
    });
  }

  function handleSave() {
    //hmm what am i doing here
    setEdit(false);
  }

  function deleteBuild(id: string) {
    setEditedBuilds((builds) => builds.filter((buildId) => buildId != id));
  }

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            placeholder="name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <button onClick={handleSave}>save</button>
        </div>
        <div className="center" style={{ padding: "0 1.2rem" }}>
          <textarea
            placeholder="description"
            value={editedDescription || ""}
            style={{ minWidth: "100%" }}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </div>
      </form>
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
                edit={true}
                deleteHandler={deleteBuild}
              />
              {index !== editedBuilds.length - 1 && (
                <div
                  className="center"
                  style={{ gap: "1rem", paddingTop: "1rem" }}
                >
                  <button onClick={() => handleArrow(false, index)}>↓ ↑</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
