import { allGames, gameDisplayString } from "@/utils/util";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Party } from "./page";
import { PostgresError } from "postgres";
import Error from "@/components/Error";

export default function NewMenu(props: {
  setNewMenu: Dispatch<SetStateAction<boolean>>;
  addAction: (args: { name: string; game: string }) => Promise<Party>;
}) {
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyGame, setNewPartyGame] = useState("og");
  const [error, setError] = useState<string | null>(null);
  const { setNewMenu, addAction } = props;

  const handleNew = async (args: { name: string; game: string }) => {
    try {
      const party = await addAction(args); //not returning value
    } catch (error) {
      setError((error as PostgresError).message);
      return;
    }
    setNewMenu(false);
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
            type="text"
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
          <br />
          <div className="center" style={{ gap: "1rem" }}>
            <button onClick={() => setNewMenu(false)}>cancel</button>
            <button
              onClick={() =>
                handleNew({ name: newPartyName, game: newPartyGame })
              }
            >
              create
            </button>
          </div>
          <div className="center">
            <Error error={error} />
          </div>
        </form>
      </div>
    </>
  );
}
