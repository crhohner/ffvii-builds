import { allGames, gameDisplayString } from "@/utils/util";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

export default function NewMenu(props: {
  setNewMenu: Dispatch<SetStateAction<boolean>>;
  handleAdd: (args: { name: string; game: string }) => Promise<void>;
}) {
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyGame, setNewPartyGame] = useState("og");
  const { setNewMenu, handleAdd } = props;
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
          <h2>New Party</h2>
          <Image
            onClick={() => setNewMenu(false)}
            src="esc.svg"
            height={20}
            width={20}
            alt=""
          />
        </div>
        <br />
        <form className="form">
          <label>name:</label>
          <input
            type="text" //whyyyyyy
            value={newPartyName}
            onChange={(e) => setNewPartyName(e.target.value)}
          />
          <br />
          <label>game:</label>
          <select
            value={newPartyGame}
            onChange={(e) => setNewPartyGame(e.target.value)}
          >
            {allGames.map((game) => (
              <option key={game} value={game}>
                {gameDisplayString(game)}
              </option>
            ))}
          </select>
          <br />
          <div className="center" style={{ gap: "1rem" }}>
            <button onClick={() => setNewMenu(false)}>cancel</button>
            <button
              onClick={
                () => handleAdd({ name: newPartyName, game: newPartyGame }) //need validation of non-null name
              }
            >
              create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
