import { Materia } from "@/utils/frontend-types";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Orb({ m }: { m: Materia }) {
  const [hover, setHover] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  if (!m) {
    return null;
  }

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
        <Image
          src={`/materia/${m.materia_type}.svg`}
          width={32}
          height={32}
          alt=""
        />
      </div>
      {hover && !mouseDown && m.name !== "empty" && (
        <div className={styles.context}>
          <h3>{m.name}</h3>
          <div>{m.description}</div>
        </div>
      )}
    </div>
  );
}
