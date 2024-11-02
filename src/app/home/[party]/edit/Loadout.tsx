import { Link, Materia } from "@/utils/frontend-types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import Draggable, { ITEM_TYPE } from "./Draggable";
import useDoubleClick from "use-double-click";
import MateriaSelect, { MateriaOption } from "@/components/MateriaSelect";
import { isMobile } from "react-device-detect";

export const Slot = ({
  item,
  index,
  handleSwap,
  handlePut,
  options,
}: {
  item: Materia | null;
  index: number[];
  handleSwap: (toIndex: number[], fromIndex: number[]) => void;
  handlePut: (index: number[], id: string | null) => void;
  options: MateriaOption[];
}) => {
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem: { item: Materia; index: number[] | null }) => {
      if (draggedItem.index === null) {
        handlePut(index, draggedItem.item.id);
      } else if (draggedItem.index !== index) {
        handleSwap(index, draggedItem.index); // Trigger swap if dragged into a different slot
      }
    },
  });
  const slotRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [select, setSelect] = useState(false);
  const [context, setContext] = useState(!isMobile);

  useDoubleClick({
    onSingleClick: (e) => {
      if (!select) {
        setSelect(true);
        setContext(false);
      }
    },
    onDoubleClick: (e) => {
      handlePut(index, null);
    },
    ref: slotRef,
    latency: 200,
  });

  useEffect(() => {
    if (slotRef.current) {
      drop(slotRef.current); // Ensure the ref is properly connected
    }
  }, [drop]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setSelect(false);
        setContext(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef, setSelect]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={slotRef} className="grid-slot">
        {item ? (
          <Draggable item={item} index={index} context={context} />
        ) : (
          <Image src={"/materia/empty.svg"} height={32} width={32} alt="/" />
        )}
      </div>
      {select && (
        <div
          style={{
            position: "absolute",
            left: "-3.5rem",
            top: "2.5rem",
          }}
          ref={selectRef}
        >
          <MateriaSelect
            options={options}
            searchable={true}
            value={
              item
                ? {
                    value: item.id,
                    label: item.name,
                    context: item.description,
                    color: item.materia_type,
                  }
                : null
            }
            handler={(option: MateriaOption | null) => {
              if (option !== null) {
                handlePut(index, option.value); //look into clearable logic..
              } else {
                handlePut(index, null);
              }
              setSelect(false);
              setContext(true);
            }}
          />
        </div>
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
  handlePut,
  handleLink,
  options,
}: {
  row: number;
  schema: ("single" | "double")[];
  items: (Materia | null)[];
  links: Link[];
  handleLink: (link: boolean, row: number, col: number) => void;
  handleAdd: (row: number) => void;
  handleRemove: (row: number) => void;
  handlePut: (index: number[], id: string | null) => void;
  handleSwap: (toIndex: number[], fromIndex: number[]) => void;
  options: MateriaOption[];
}) {
  let slots: JSX.Element[] = [];
  let i = 0;
  schema.forEach((slottype) => {
    const col = i;
    if (slottype === "single") {
      slots.push(
        <Slot
          options={options}
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
          options={options}
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
          options={options}
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
