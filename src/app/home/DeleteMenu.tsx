import { Dispatch, SetStateAction } from "react";
import { Party } from "./page";
import Image from "next/image";

export default function DeleteMenu(props: {
  setDeleteMenu: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
  getSelected: () => Party[];
}) {
  const selected = props.getSelected();
  const { setDeleteMenu, handleDelete } = props;
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
      </div>
    </>
  );
}
