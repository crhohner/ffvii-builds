import { useEffect, useRef } from "react";
import MateriaView from "../MateriaView";
import { useDrag } from "react-dnd";
import { Materia } from "@/utils/frontend-types";

export const ITEM_TYPE = "GRID_ITEM";
const Draggable = ({
  item,
  index,
}: {
  item: Materia;
  index: number[] | null;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { item, index }, // Provide the item's index to identify its position
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
export default Draggable;
