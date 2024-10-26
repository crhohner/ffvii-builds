import { Materia } from "@/utils/frontend-types";
import Draggable from "./Draggable";
import { allColors } from "@/utils/util";
import { useState } from "react";

export default function SelectMateria({
  allMateria,
}: {
  allMateria: Map<string, Materia>;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const mapMateria = () => {
    const mats = Array.from(allMateria.values())
      .filter((m) => m.materia_type !== "empty")
      .sort((a, b) => {
        if (a.materia_type == b.materia_type) {
          if (a.name > b.name) return 1;
          else return -1;
        }
        if (a.materia_type > b.materia_type) return 1;
        return -1;
      })
      .filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) &&
          (filter === "all" ? true : m.materia_type === filter)
      );

    return mats;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyItems: "center",
        right: "10rem",
      }}
    >
      <div
        className="container"
        style={{ gap: "1rem", textWrap: "pretty", maxWidth: "11rem" }}
      >
        <h3>User Guide:</h3>
        <p>Use the + and - buttons to create weapon schematics.</p>
        <p>Drag, drop, and swap materia to create builds.</p>
        <p>Empty a slot by clicking it while holding SHIFT.</p>
        <p>(Un)link two slots by pressing the x/= button between them.</p>
      </div>
      <input
        placeholder="search materia"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <h3>COLOR</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value={"all"} key={"all"}>
            all
          </option>
          {allColors.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "scroll",
            maxHeight: "20rem",
          }}
        >
          {mapMateria().map((m) => (
            <div
              key={m.name}
              style={{
                alignItems: "center",
                display: "flex",
                gap: "1rem",
              }}
            >
              <Draggable item={m} index={null} />
              <div
                style={{
                  maxWidth: "8rem",
                  overflow: "hidden",
                }}
              >
                <text>{m.name}</text>
                <h3>{m.description}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
