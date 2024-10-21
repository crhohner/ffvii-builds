import {
  Character,
  DisplayBuild,
  Game,
  Link,
  Materia,
} from "@/utils/frontend-types";

import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "./page.module.css";
import { characterDisplayString, validCharacters } from "@/utils/util";
import Image from "next/image";
import Orb from "./Orb";
import { jaccardDistance } from "drizzle-orm";

// Define a type for our items
const ITEM_TYPE = "GRID_ITEM";

const Draggable = ({ item, index }: { item: Materia; index: number[] }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index }, // Provide the item's index to identify its position
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current); // Ensure the ref is properly connected
    }
  }, [drag]);

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Orb m={item} />
    </div>
  );
};

const Slot = ({
  //make this pretty
  item,
  index,
  handleSwap,
}: {
  item: Materia | null;
  index: number[];
  handleSwap: (fromIndex: number[], toIndex: number[]) => void;
}) => {
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem: { index: number[] }) => {
      if (draggedItem.index !== index) {
        handleSwap(draggedItem.index, index); // Trigger swap if dragged into a different slot
      }
    },
  });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      drop(ref.current); // Ensure the ref is properly connected
    }
  }, [drop]);

  return (
    <div ref={ref} className="grid-slot">
      {item ? (
        <Draggable item={item} index={index} />
      ) : (
        <Image src={"/materia/empty.svg"} height={32} width={32} alt="/" />
      )}
    </div>
  );
};

const EditBuilds = ({
  builds,
  links,
  game,
}: {
  builds: DisplayBuild[];
  links: Link[];
  game: Game;
}) => {
  const initialItems = builds.flatMap((b) => [
    b.weapon_materia.map((m) => (m.materia_type == "empty" ? null : m)),
    b.armor_materia.map((m) => (m.materia_type == "empty" ? null : m)),
  ]);

  const initialSchemas = builds.flatMap((b) => [
    b.weapon_schema,
    b.armor_schema,
  ]);

  const [items, setItems] = useState<(null | Materia)[][]>(initialItems); //contains all the relevant info??
  const [schemas, setSchemas] =
    useState<("single" | "double")[][]>(initialSchemas);
  const [editedBuilds, setEditedBuilds] = useState(builds); //move ALL STATE OUT OF THIS COMPONENT

  const handleAdd = (row: number) => {
    const updatedItems = [...items];
    updatedItems[row].push(null);
    const updatedSchemas = [...schemas];
    updatedSchemas[row].push("single");
    setItems(updatedItems);
    setSchemas(updatedSchemas);
  };

  const handleLink = (link: boolean, row: number, col: number) => {
    const updatedSchemas = [...schemas];
    let i = 0;
    let j = 0;
    while (j < col) {
      if (schemas[row][i] === "double") {
        j += 2;
      } else {
        j += 1;
      }
      i += 1;
    }

    if (!link) {
      updatedSchemas[row][i] = "single";
      updatedSchemas[row].splice(i + 1, 0, "single");
    } else {
      const left = updatedSchemas[row][i];
      if (left === "double") return;
      const right = updatedSchemas[row][i + 1];
      if (right === "double") return;
      updatedSchemas[row][i] = "double";
      updatedSchemas[row].splice(i + 1, 1);
    }

    setSchemas(updatedSchemas);
  };

  const handleRemove = (row: number) => {
    //NOT WORKING
    const updatedItems = [...items];
    updatedItems[row].pop();
    const updatedSchemas = [...schemas];
    const popped = updatedSchemas[row].pop();
    if (popped === "double") {
      updatedSchemas[row].push("single");
    }
    setItems(updatedItems); //not clearing off the end
    setSchemas(updatedSchemas);
  };

  // Handle the swapping logic
  const handleSwap = (fromIndex: number[], toIndex: number[]) => {
    const updatedItems = [...items];
    [
      updatedItems[toIndex[0]][toIndex[1]],
      updatedItems[fromIndex[0]][fromIndex[1]],
    ] = [
      updatedItems[fromIndex[0]][fromIndex[1]],
      updatedItems[toIndex[0]][toIndex[1]],
    ]; // Swap items
    setItems(updatedItems); // Update state
  };

  const mapRow = (
    row: number,
    schema: ("single" | "double")[],
    items: (Materia | null)[]
  ) => {
    let slots: JSX.Element[] = [];
    let i = 0;
    schema.forEach((slottype) => {
      const col = i;
      if (slottype === "single") {
        slots.push(
          <Slot
            key={`slot-${row}-${col}`}
            item={items[i]}
            index={[row, col]}
            handleSwap={handleSwap}
          />,
          <button
            key={`button-x-${row}-${col}`}
            onClick={() => {
              handleLink(true, row, col);
            }}
            className="icon"
          >
            x
          </button>
        );
        i += 1;
      } else {
        let active = false;
        if (items[col] != null && items[col + 1] != null) {
          active =
            active ||
            links.some(
              (link) =>
                (link.blue_id === items[col]!.id &&
                  link.target_id === items[col + 1]!.id) ||
                (link.blue_id === items[col + 1]!.id &&
                  link.target_id === items[col]!.id)
            );
        }

        slots.push(
          <Slot
            key={`slot-${row}-${col}`}
            item={items[col]}
            index={[row, col]}
            handleSwap={handleSwap}
          />,
          <button
            key={`button-eq-${row}-${col}`}
            className="icon"
            style={{
              color: active
                ? "var(--secondary-text-color)"
                : "var(--primary-text-color)",
            }}
            onClick={() => handleLink(false, row, col)}
          >
            =
          </button>,
          <Slot
            key={`slot-${row}-${col + 1}`}
            item={items[col + 1]}
            index={[row, col + 1]}
            handleSwap={handleSwap}
          />,
          <button
            key={`button-x-${row}-${col}`}
            className="icon"
            onClick={() => handleLink(true, row, col)}
          >
            x
          </button>
        );
        i += 2;
      }
    });
    slots.pop(); //axe last button
    return (
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {slots}
      </div>
    );
  };

  function Card({ index }: { index: number }) {
    const build = editedBuilds[index];
    const weapon_materia = items[2 * index];
    const weapon_schema = schemas[2 * index];
    const armor_materia = items[2 * index + 1];
    const armor_schema = schemas[2 * index + 1];

    return (
      <div className={styles["card"]}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <label>CHARACTER</label>
            <select>
              {validCharacters(game).map((char) => (
                <option key={char} value={char}>
                  {characterDisplayString(char)}
                </option>
              ))}
            </select>
            {index == 0 && (
              <div style={{ paddingBottom: "4px" }}>
                <Image src="/crown.svg" height={24} width={24} alt="crown" />
              </div>
            )}
          </div>
        </div>
        <div className={styles.property}>
          <h3>ACCESSORY (NAME)</h3>
          <input name="accessory"></input>
        </div>
        <div className={styles.property}>
          <h3>WEAPON (NAME)</h3>
          <input name="weapon"></input>
        </div>
        <div className={styles.property}>
          {mapRow(index * 2, weapon_schema, weapon_materia)}
          <button onClick={() => handleRemove(2 * index)}>-</button>
          <button onClick={() => handleAdd(2 * index)}>+</button>
        </div>
        <div className={styles.property}>
          <h3>ARMOR (NAME)</h3>
          <input name="armor"></input>
        </div>
        <div className={styles.property}>
          {mapRow(index * 2 + 1, armor_schema, armor_materia)}
          <button onClick={() => handleRemove(2 * index + 1)}>-</button>
          <button onClick={() => handleAdd(2 * index + 1)}>+</button>
        </div>
      </div>
    );
  }

  //put back add/remove slot
  //add/remove link
  //implement dropdowns
  //implement order switching
  //implement character name switching
  //implement weapon/armor name editing
  //fix + diagnose err
  //make the server calls

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {builds.map((_, i) => (
        <Card key={i} index={i} />
      ))}
    </div>
  );
};

export default EditBuilds;
