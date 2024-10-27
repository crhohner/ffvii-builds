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
  const [mouseDown, setMouseDown] = useState(false);
  const type = m ? m.materia_type : "empty";

  useEffect(() => {
    function handleMouseDown() {
      setMouseDown(true);
    }
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    function handleMouseUp() {
      setMouseDown(false);
    }
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image src={`/materia/${type}.svg`} width={32} height={32} alt="" />
      </div>
      {hover && context && !mouseDown && m && (
        <div className={styles.context}>
          <h3>{m.name}</h3>
          {m.description && <div>{m.description}</div>}
        </div>
      )}
    </div>
  );
}
