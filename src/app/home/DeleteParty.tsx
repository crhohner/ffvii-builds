import { Dispatch, SetStateAction, useState } from "react";

import Image from "next/image";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { deleteParties } from "./action";
import { DisplayParty } from "@/utils/frontend-types";

export default function DeleteParty({
  setDeleteMenu,
  setSelected,
  getSelected,
  fetch,
}: {
  setDeleteMenu: Dispatch<SetStateAction<boolean>>;
  getSelected: () => DisplayParty[];
  setSelected: Dispatch<SetStateAction<DisplayParty[]>>;
  fetch: () => Promise<void>;
}) {
  const selected = getSelected();

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteParties(selected);
    } catch (error) {
      setError((error as PostgresError).message);
      return;
    }

    setSelected([]);
    setDeleteMenu(false);
    await fetch();
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
          <h2 style={{ paddingRight: "1rem" }}>
            {selected.length > 1
              ? "Delete " + selected.length + " parties?"
              : "Delete " + selected[0].name + "?"}
          </h2>
          <Image
            onClick={() => setDeleteMenu(false)}
            src="/esc.svg"
            height={20}
            width={20}
            alt=""
          />
        </div>
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
