import { Dispatch, SetStateAction, useState } from "react";
import { DisplayParty } from "./page";
import Image from "next/image";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { TagProps } from "./PartyList";
import { revalidatePath } from "next/cache";

export default function DeleteMenu({
  setDeleteMenu,
  setSelected,
  getSelected,
  deleteAction,
}: {
  setDeleteMenu: Dispatch<SetStateAction<boolean>>;
  deleteAction: (parties: DisplayParty[]) => Promise<void>;
  getSelected: () => DisplayParty[];
  setSelected: Dispatch<SetStateAction<DisplayParty[]>>;
}) {
  const selected = getSelected();

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteAction(selected);
    } catch (error) {
      setError((error as PostgresError).message);
      return;
    }

    setSelected([]);
    setDeleteMenu(false);
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
            {selected.length > 1
              ? "Delete " + selected.length + " parties?"
              : "Delete " + selected[0].name + "?"}
          </h2>
          <Image
            onClick={() => setDeleteMenu(false)}
            src="esc.svg"
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
