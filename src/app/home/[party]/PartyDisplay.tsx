"use client";

import { Database } from "@/utils/supabase/types";
import { Accessory, DisplayBuild, Materia } from "./page";
import { characterDisplayString, gameDisplayString } from "@/utils/util";
import styles from "./page.module.css";
import { Character } from "../page";
import Image from "next/image";
import { useState } from "react";

export default function PartyDisplay({
  party,
  builds,
  allAccessories,
  allMateria,
  links,
}: {
  party: Database["public"]["Tables"]["party"]["Row"];
  builds: DisplayBuild[] | null;
  allMateria: Map<string, Materia>;
  allAccessories: Map<string, Accessory>;
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
}) {
  const [edit, setEdit] = useState(false);

  function Orb({ m }: { m: Materia }) {
    const [hover, setHover] = useState(false);

    return (
      <div style={{ position: "relative" }}>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Image
            src={`/materia/${m.materia_type}.svg`}
            width={32}
            height={32}
            alt=""
          />
        </div>
        {hover && m.name !== "empty" && (
          <div className={styles.context}>
            <h3>{m.name}</h3>
            <div>{m.description}</div>
          </div>
        )}
      </div>
    );
  }

  function DoubleSlot({ m1, m2 }: { m1: Materia; m2: Materia }) {
    const active = links.some(
      (link) =>
        (link.blue_id === m1.id && link.target_id === m2.id) ||
        (link.blue_id === m2.id && link.target_id === m1.id)
    );
    const src = active ? "active-link" : "link";

    return (
      <div style={{ display: "flex", gap: "0.6rem", position: "relative" }}>
        <Orb m={m1} />
        <Orb m={m2} />
        <div style={{ position: "absolute", left: "28%" }}>
          <Image src={`/materia/${src}.svg`} width={32} height={32} alt="" />
        </div>
      </div>
    );
  }

  function MateriaMap({
    materia,
    slots,
  }: {
    materia: Materia[];
    slots: Database["public"]["Enums"]["slot_type"][];
  }) {
    const slotIcons: JSX.Element[] = [];
    let j = 0;

    slots.forEach((slot, i) => {
      if (slot === "double") {
        slotIcons.push(
          <DoubleSlot key={i} m1={materia[j]} m2={materia[j + 1]} />
        );
        j += 2;
      } else {
        slotIcons.push(<Orb key={i} m={materia[j]} />);
        j++;
      }
    });

    return <div style={{ display: "flex", gap: "0.5rem" }}>{slotIcons}</div>;
  }

  function Card({ build }: { build: DisplayBuild }) {
    return (
      <div className={styles.card}>
        <h1>{characterDisplayString(build.character as Character)}</h1>
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
          />
          {edit && (
            <button style={{ color: "var(--error-color)" }}>delete</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {edit ? (
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input placeholder="name" defaultValue={party.name} />
            <button onClick={() => setEdit(false)}>save</button>
          </div>
          <div className="center" style={{ padding: "0 1.2rem" }}>
            <textarea
              placeholder="description"
              defaultValue={party.description || ""}
              style={{ minWidth: "100%" }}
            />
          </div>
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h1>{party.name}</h1>
            <h2>{gameDisplayString(party.game)}</h2>
            <button onClick={() => setEdit(true)}>edit</button>
          </div>
          <div style={{ width: "inherit", height: "fit-content" }}>
            <h3>{party.description}</h3>
          </div>
        </div>
      )}
      <br />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {builds?.map((build, index) => (
          <div key={index}>
            <Card build={build} />
            {index !== builds.length - 1 && edit && (
              <div
                className="center"
                style={{ gap: "1rem", paddingTop: "1rem" }}
              >
                <button>↑</button>
                <button>↓</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {edit && (!builds || builds.length < 3) && (
        <div className="center" style={{ paddingTop: "1rem" }}>
          <button>add build</button>
        </div>
      )}
    </div>
  );
}
