import { characterDisplayString } from "@/utils/util";
import { Character } from "../page";
import { DisplayBuild } from "./page";
import styles from "./page.module.css";
import Image from "next/image";
import MateriaMap from "./MateriaMap";
import { Database } from "@/utils/supabase/types";

export default function Card({
  build,
  leader,
  links, //maybe we bring back edit parameter..
}: {
  build: DisplayBuild;
  leader: boolean;
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
}) {
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
              <Image src="/crown.svg" height={18} width={18} alt="crown" />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {"view icon "}
          {"trash icon"}
        </div>
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
    </div>
  );
}
