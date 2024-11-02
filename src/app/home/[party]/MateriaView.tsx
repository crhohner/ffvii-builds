import { Materia } from "@/utils/frontend-types";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function MateriaView({
  m,
  context = true,
}: {
  m: Materia | null;
  context: boolean;
}) {
  const [hover, setHover] = useState(false);

  const type = m ? m.materia_type : "empty";

  return (
    <div style={{ position: "relative" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image src={`/materia/${type}.svg`} width={32} height={32} alt="" />
      </div>
      {hover && context && m && (
        <div className={styles.context}>
          <h3>{m.name}</h3>
          {m.description && <div>{m.description}</div>}
        </div>
      )}
    </div>
  );
}
