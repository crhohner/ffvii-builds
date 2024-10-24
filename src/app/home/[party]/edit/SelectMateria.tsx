import { Materia } from "@/utils/frontend-types";
import Draggable from "./Draggable";
import { allColors } from "@/utils/util";

export default function SelectMateria({
  allMateria,
}: {
  allMateria: Map<string, Materia>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input placeholder="search"></input>
        <h3>COLOR</h3>
        <select>
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
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {Array.from(allMateria.values())
            .sort((a, b) => {
              if (a.materia_type == b.materia_type) {
                if (a.name > b.name) return 1;
                else return -1;
              }
              if (a.materia_type > b.materia_type) return 1;
              return -1;
            })
            .map((m) => (
              <Draggable item={m} index={null} />
            ))}
        </div>
      </div>
    </div>
  );
}
