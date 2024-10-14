"use client";

import { Database } from "@/utils/supabase/types";
import { DisplayBuild, Materia } from "./page";
import { gameDisplayString } from "@/utils/util";
import { useState } from "react";
import EditParty from "./EditParty";
import Card from "./Card";

export default function ViewParty(props: {
  party: Database["public"]["Tables"]["party"]["Row"];
  builds: DisplayBuild[] | null;
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
  updateAction: (
    oldParty: Database["public"]["Tables"]["party"]["Row"],
    newParty: Database["public"]["Tables"]["party"]["Row"]
  ) => Promise<void>;
}) {
  const { party, builds, links, updateAction: insertAction } = props;

  const [edit, setEdit] = useState(false);

  function View() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h1>{party.name}</h1>
            <h2>{gameDisplayString(party.game)}</h2>
            <button onClick={() => setEdit(true)}>edit</button>
          </div>
          <div style={{ width: "inherit", height: "fit-content" }}>
            <h3>{party.description}</h3>
          </div>
        </div>

        <br />

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {builds?.map((build, index) => (
            <div key={index}>
              <Card
                build={build}
                leader={index === 0}
                edit={false}
                links={links}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {edit ? (
        <EditParty
          party={party}
          setEdit={setEdit}
          builds={builds!}
          links={links}
          insertAction={insertAction}
        />
      ) : (
        <View />
      )}
    </>
  );
}
