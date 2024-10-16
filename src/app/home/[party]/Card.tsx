import { characterDisplayString } from "@/utils/util";
import { DisplayBuild } from "./page";
import styles from "./page.module.css";
import Image from "next/image";
import MateriaMap from "./MateriaMap";
import { Database } from "@/utils/supabase/types";
import { useState } from "react";
import { PostgresError } from "postgres";
import Error from "@/components/Error";
import { deleteBuild } from "./action";
import { Character } from "../page";

export default function Card({
  build,
  leader,
  links,
  icons,
  party,
}: {
  build: DisplayBuild;
  leader: boolean;
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
  icons: boolean;
  party: Database["public"]["Tables"]["party"]["Row"];
}) {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteBuild({ id: build.id, party: party });
    } catch (error) {
      setError((error as PostgresError).message);
    }
  };

  return (
    <div className={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h1>{characterDisplayString(build.character as Character)}</h1>
          {leader && (
            <div style={{ paddingBottom: "4px" }}>
              <Image src="/crown.svg" height={24} width={24} alt="crown" />
            </div>
          )}
        </div>
        {icons && (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button className="icon" onClick={handleDelete}>
              <Image
                src="/delete.svg"
                height={24}
                width={24}
                alt="delete icon"
              />
            </button>
            <button className="icon">
              <Image src="/edit.svg" height={24} width={24} alt="edit icon" />
            </button>
          </div>
        )}
      </div>

      <div className={styles.property}>
        <h3>ACCESSORY</h3>
        {build.accessory?.name}
      </div>
      <div className={styles.property}>
        <h3>WEAPON</h3>
        {build.weapon_name}
      </div>
      <MateriaMap
        materia={build.weapon_materia}
        slots={build.weapon_schema}
        links={links}
      />
      <div className={styles.property}>
        <h3>ARMOR</h3>
        {build.armor_name}
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MateriaMap
          materia={build.armor_materia}
          slots={build.armor_schema}
          links={links}
        />
      </div>
      <Error error={error} />
    </div>
  );
}
