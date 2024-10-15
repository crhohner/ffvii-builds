import {
  allChars,
  characterDisplayString,
  validCharacters,
} from "@/utils/util";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { Database } from "@/utils/supabase/types";

export default function NewBuild({
  setNewMenu,
  addAction,
  party,
  characters,
}: {
  setNewMenu: Dispatch<SetStateAction<boolean>>;
  addAction: (args: {
    character: string;
    party: Database["public"]["Tables"]["party"]["Row"];
  }) => Promise<void>;
  party: Database["public"]["Tables"]["party"]["Row"];
  characters: string[];
}) {
  const [newBuildCharacter, setNewBuildCharacter] = useState("cloud");
  const [error, setError] = useState<string | null>(null);

  const handleNew = async (args: {
    character: string;
    party: Database["public"]["Tables"]["party"]["Row"];
  }) => {
    if (characters.includes(args.character)) {
      setError("Cannot add duplicate characters!");
      return;
    }
    try {
      await addAction(args);
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
          <h2>New Build</h2>
          <Image
            onClick={() => setNewMenu(false)}
            src="/esc.svg"
            height={20}
            width={20}
            alt=""
          />
        </div>

        <div className="form">
          <label>character:</label>
          <select
            value={newBuildCharacter}
            onChange={(e) => setNewBuildCharacter(e.target.value)}
          >
            {validCharacters(party.game).map((char) => (
              <option key={char} value={char}>
                {characterDisplayString(char)}
              </option>
            ))}
          </select>

          <br />
          <div className="center" style={{ gap: "1rem" }}>
            <button onClick={() => setNewMenu(false)}>cancel</button>
            <button
              onClick={() => handleNew({ character: newBuildCharacter, party })}
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
