"use client";

import { Database } from "@/utils/supabase/types";

import { gameDisplayString } from "@/utils/util";
import { useEffect, useState } from "react";
import EditParty from "./EditParty";
import Card from "./Card";
import NewBuild from "./NewBuild";
import { DisplayBuild, Link, Party } from "@/utils/frontend-types";
import { fetchProps as fetchServerProps } from "./fetch";

interface Params {
  params: {
    party: string;
  };
}

export default function Page({ params }: Params) {
  const [edit, setEdit] = useState(false);
  const [newBuildMenu, setNewBuildMenu] = useState(false);

  const [party, setParty] = useState<Party>();
  const [builds, setBuilds] = useState<DisplayBuild[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const fetchPageProps = async () => {
    const { party, builds, links } = await fetchServerProps(params.party);
    setParty(party);
    setBuilds(builds);
    setLinks(links);
  };

  useEffect(() => {
    fetchPageProps(); // Fetch parties when the component mounts
  }, []);

  function View({ party }: { party: Party }) {
    return (
      <>
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
                links={links}
                icons
                party={party}
                fetch={fetchPageProps}
              />
            </div>
          ))}
          {builds!.length < 3 && (
            <div className="center">
              <button onClick={() => setNewBuildMenu(true)}>new build</button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {party && (
        <>
          {edit ? (
            <EditParty
              party={party}
              setEdit={setEdit}
              builds={builds!}
              links={links}
              fetch={fetchPageProps}
            />
          ) : (
            <View party={party} />
          )}
          {newBuildMenu && (
            <NewBuild
              setNewMenu={setNewBuildMenu}
              party={party}
              characters={builds?.map((b) => b.character)!}
              fetch={fetchPageProps}
            />
          )}
        </>
      )}
    </>
  );
}
