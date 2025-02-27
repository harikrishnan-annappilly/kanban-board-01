import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface PropType {
  id: string;
  type: string;
  title: string;
  color: string;
  children: React.ReactNode;
}

const Column = (props: PropType) => {
  const { id, type, title, color, children } = props;
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id, data: { type } });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-400 h-full min-w-52 w-full max-w-96 flex flex-col rounded ${
        isDragging ? "opacity-30" : ""
      } ${`${color.split("-")[1]}-scroll`}`}
    >
      {/* Column Heading */}
      <div
        {...attributes}
        {...listeners}
        className={`text-center text-2xl p-3 font-semibold rounded-t border-b border-gray-400 bg-${color}-300`}
      >
        {title}
      </div>
      {/* Column Body */}
      <div className="grow flex flex-col p-3 gap-3 overflow-y-auto overflow-x-hidden bg-white rounded-b">
        {children}
      </div>
    </div>
  );
};

export default Column;
