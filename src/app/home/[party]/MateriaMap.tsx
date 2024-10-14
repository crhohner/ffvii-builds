import { Database } from "@/utils/supabase/types";
import { Materia } from "./page";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function MateriaMap({
  materia,
  slots,
  links,
}: {
  materia: Materia[];
  slots: Database["public"]["Enums"]["slot_type"][];
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
}) {
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
