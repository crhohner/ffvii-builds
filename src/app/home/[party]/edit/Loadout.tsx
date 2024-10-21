import { Link, Materia } from "@/utils/frontend-types";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import MateriaView from "../MateriaView";

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
      <MateriaView m={item} />
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

//takes in all four handlers and a row
export default function Loadout({
  row,
  schema,
  items,
  links,
  handleAdd,
  handleSwap,
  handleRemove,
  handleLink,
}: {
  row: number;
  schema: ("single" | "double")[];
  items: (Materia | null)[];
  links: Link[];
  handleLink: (link: boolean, row: number, col: number) => void;
  handleAdd: (row: number) => void;
  handleRemove: (row: number) => void;
  handleSwap: (fromIndex: number[], toIndex: number[]) => void;
}) {
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
      <button onClick={() => handleRemove(row)}>-</button>
      <button onClick={() => handleAdd(row)}>+</button>
    </div>
  );
}
