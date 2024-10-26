import { Link, Materia } from "@/utils/frontend-types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Draggable, { ITEM_TYPE } from "./Draggable";

export const Slot = ({
  item,
  index,
  handleSwap,
  handlePut,
}: {
  item: Materia | null;
  index: number[];
  handleSwap: (toIndex: number[], fromIndex: number[]) => void;
  handlePut: (index: number[], item: Materia | null) => void;
}) => {
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem: { item: Materia; index: number[] | null }) => {
      if (draggedItem.index === null) {
        handlePut(index, draggedItem.item);
      } else if (draggedItem.index !== index) {
        handleSwap(index, draggedItem.index); // Trigger swap if dragged into a different slot
      }
    },
  });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      drop(ref.current); // Ensure the ref is properly connected
    }
  }, [drop]);

  function handleShiftClick(event: any) {
    if (event.shiftKey) {
      handlePut(index, null);
    }
  }

  return (
    //TODO ADD DOUBLE CLICK DELETE / SINGLE CLICK CHANGE
    <div style={{ position: "relative" }} onClick={handleShiftClick}>
      <div ref={ref} className="grid-slot">
        {item ? (
          <Draggable item={item} index={index} />
        ) : (
          <Image src={"/materia/empty.svg"} height={32} width={32} alt="/" />
        )}
      </div>
      <div
        style={{ position: "absolute", left: "-2.8rem", width: "8rem" }}
      ></div>
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
  handlePut,
  handleLink,
}: {
  row: number;
  schema: ("single" | "double")[];
  items: (Materia | null)[];
  links: Link[];
  handleLink: (link: boolean, row: number, col: number) => void;
  handleAdd: (row: number) => void;
  handleRemove: (row: number) => void;
  handlePut: (index: number[], item: Materia | null) => void;

  handleSwap: (toIndex: number[], fromIndex: number[]) => void;
}) {
  let slots: JSX.Element[] = [];
  let i = 0;
  schema.forEach((slottype) => {
    const col = i;
    if (slottype === "single") {
      slots.push(
        <Slot
          handlePut={handlePut}
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
          handleSwap={handleSwap}
          handlePut={handlePut}
          key={`slot-${row}-${col}`}
          item={items[col]}
          index={[row, col]}
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
          handleSwap={handleSwap}
          handlePut={handlePut}
          key={`slot-${row}-${col + 1}`}
          item={items[col + 1]}
          index={[row, col + 1]}
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
