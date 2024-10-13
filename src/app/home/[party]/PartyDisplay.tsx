"use client";
import { Database } from "@/utils/supabase/types";
import { Accessory, DisplayBuild, Materia } from "./page";
import { characterDisplayString, gameDisplayString } from "@/utils/util";
import styles from "./page.module.css";
import { Character } from "../page";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PartyDisplay(props: {
  party: Database["public"]["Tables"]["party"]["Row"];
  builds: DisplayBuild[] | null;
  allMateria: Map<string, Materia>;
  allAccessories: Map<string, Accessory>;
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
}) {
  //flickering contexts?
  //drag + drop party order
  //edit name, description

  const { party, builds, allAccessories, allMateria, links } = props;

  const [edit, setEdit] = useState(false);

  function Orb(props: { m: Materia }) {
    const [hover, setHover] = useState<boolean>(false);
    const image = (
      <Image
        src={"/materia/" + props.m.materia_type + ".svg"}
        width={32}
        height={32}
        alt=""
      />
    );

    return (
      <div style={{ position: "relative" }}>
        <div
          onMouseEnter={(e) => setHover(true)}
          onMouseLeave={(e) => setHover(false)}
        >
          {image}
        </div>
        {hover && props.m.name != "empty" ? (
          <div className={styles["context"]}>
            <h3>{props.m.name}</h3>
            <div> {props.m.description}</div>
          </div>
        ) : null}
      </div>
    );
  }

  function SingleSlot(props: { m: Materia }) {
    const { m } = props;
    return <Orb m={m} />;
  }

  function DoubleSlot(props: { m1: Materia; m2: Materia }) {
    const { m1, m2 } = props;
    var active = false;
    if (
      links.filter(
        (link: Database["public"]["Tables"]["materia_link"]["Row"]) =>
          (link.blue_id === m1.id && link.target_id === m2.id) ||
          (link.blue_id === m2.id && link.target_id === m1.id)
      ).length != 0
    ) {
      active = true;
    }
    const src = active ? "active-link" : "link";
    return (
      <div style={{ display: "flex", gap: "0.6rem", position: "relative" }}>
        <Orb m={m1} />
        <Orb m={m2} />
        <div style={{ position: "absolute", left: "28%" }}>
          <Image
            src={"/materia/" + src + ".svg"}
            width={32}
            height={32}
            alt=""
          />
        </div>
      </div>
    );
  }

  function MateriaMap(props: {
    materia: Materia[];
    slots: Database["public"]["Enums"]["slot_type"][];
  }) {
    const { materia, slots } = props;
    var slotIcons = [];

    var j = 0;
    for (let i = 0; i < slots.length; i++) {
      const m1 = materia[j];
      if (slots[i] === "double") {
        j++;
        const m2 = materia[j]; //err catching needed?
        slotIcons.push(<DoubleSlot m1={m1} m2={m2} />);
      } else {
        slotIcons.push(<SingleSlot m={m1} />);
      }
      j++;
    }
    return <div style={{ display: "flex", gap: "0.5rem" }}>{...slotIcons}</div>;
  }

  function Card(props: { build: DisplayBuild }) {
    const { build } = props;
    return (
      <div className={styles["card"]}>
        <h1>{characterDisplayString(build.character as Character)}</h1>
        <div className={styles["property"]}>
          <h3>ACCESSORY</h3>
          {build.accessory?.name}
        </div>
        <div className={styles["property"]}>
          <h3>WEAPON</h3>
          {build.weapon_name}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <MateriaMap
            materia={build.weapon_materia}
            slots={build.weapon_schema}
          />
        </div>

        <div className={styles["property"]}>
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
            <input placeholder="name" />
            <button onClick={() => setEdit(false)}>save</button>
          </div>
          <div className="center" style={{ padding: "0 1.2rem 0 1.2rem" }}>
            <textarea placeholder="description" style={{ minWidth: "100%" }} />
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {builds?.map((build, index) => (
          <>
            <Card build={build} />
            {index != builds.length - 1 && edit && (
              <div className="center" style={{ gap: "1rem" }}>
                <button>↑</button>
                <button>↓</button>
              </div>
            )}
          </>
        ))}
      </div>
      {edit && (!builds || builds?.length < 3) && (
        <div className="center" style={{ paddingTop: "1rem" }}>
          <button>add build</button>
        </div>
      )}
    </div>
  );
}
