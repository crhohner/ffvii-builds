import { allGames, gameDisplayString } from "@/utils/util";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { addParty } from "./action";
import { usePathname, useRouter } from "next/navigation";

export default function NewParty({
  setNewMenu,
  fetch,
}: {
  setNewMenu: Dispatch<SetStateAction<boolean>>;
  fetch: () => Promise<void>;
}) {
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyGame, setNewPartyGame] = useState("og");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const path = usePathname();
  let id = "";
  const handleNew = async (args: { name: string; game: string }) => {
    if (args.name === "") {
      setError("Party name cannot be empty!");
      return;
    }
    try {
      id = await addParty(args);
    } catch (error) {
      setError((error as PostgresError).message);
      return;
    }
    //setNewMenu(false);
    //await fetch();
    router.push(path + "/" + id + "/edit");
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
            src="/esc.svg"
            height={20}
            width={20}
            alt=""
          />
        </div>
        <br />
        <div className="form">
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
        </div>
      </div>
    </>
  );
}
