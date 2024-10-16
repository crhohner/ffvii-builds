import { characterDisplayString } from "@/utils/util";

import styles from "./page.module.css";
import Image from "next/image";
import MateriaMap from "./MateriaMap";
import Error from "@/components/Error";

import { Character, DisplayBuild, Link, Party } from "@/utils/frontend-types";
import { useState } from "react";
import DeleteBuild from "./DeleteBuild";

export default function Card({
  build,
  leader,
  links,
  icons,
  party,
  fetch,
}: {
  build: DisplayBuild;
  leader: boolean;
  links: Link[];
  icons: boolean;
  party: Party;
  fetch: () => Promise<void>;
}) {
  const [deleteMenu, setDeleteMenu] = useState(false);
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
          <button className="icon" onClick={() => setDeleteMenu(true)}>
            <Image src="/delete.svg" height={24} width={24} alt="delete icon" />
          </button>
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
      {deleteMenu && (
        <DeleteBuild
          party={party}
          build={build}
          setDeleteMenu={setDeleteMenu}
          fetch={fetch}
        />
      )}
    </div>
  );
}
