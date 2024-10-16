import { Dispatch, SetStateAction, useState } from "react";

import Image from "next/image";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { DisplayBuild, Party } from "@/utils/frontend-types";
import { deleteBuild } from "./action";
import { characterDisplayString } from "@/utils/util";

export default function DeleteBuild({
  setDeleteMenu,
  party,
  build,
  fetch,
}: {
  setDeleteMenu: Dispatch<SetStateAction<boolean>>;
  party: Party;
  build: DisplayBuild;
  fetch: () => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteBuild({ id: build.id, party: party });
    } catch (error) {
      setError((error as PostgresError).message);
    }
    fetch();
  };

  return (
    <>
      <div className="shade"></div>
      <div className="popup">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2>
            {"Delete " +
              characterDisplayString(build.character) +
              " from " +
              party.name +
              "?"}
          </h2>
          <Image
            onClick={() => setDeleteMenu(false)}
            src="/esc.svg"
            height={20}
            width={20}
            alt=""
          />
        </div>
        <br />
        <div className="center" style={{ gap: "1rem" }}>
          <button onClick={() => setDeleteMenu(false)}>cancel</button>
          <button onClick={handleDelete}>delete</button>
        </div>
        <div className="center">
          <Error error={error} />
        </div>
      </div>
    </>
  );
}
