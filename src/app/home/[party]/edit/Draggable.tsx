import { useEffect, useRef } from "react";
import MateriaView from "../MateriaView";
import { DragPreviewImage, useDrag } from "react-dnd";
import { Materia } from "@/utils/frontend-types";

export const ITEM_TYPE = "GRID_ITEM";
const Draggable = ({
  item,
  index,
  context,
}: {
  item: Materia;
  index: number[] | null;
  context: boolean;
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { item, index }, // Provide the item's index to identify its position
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    const dragPreviewImage = new Image();
    dragPreviewImage.src = `/materia/${item.materia_type}.svg`;

    dragPreviewImage.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = 16;
      const height = 16;
      canvas.width = width;
      canvas.height = height;
      context!.drawImage(dragPreviewImage, 0, 0, width, height);
      preview(canvas);
    };
  }, [preview, item.materia_type]);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current); // Ensure the ref is properly connected
    }
  }, [drag]);

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <MateriaView m={item} context={context} />
    </div>
  );
};
export default Draggable;
