import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface PropType {
  id: string;
  type: string;
  title: string;
  color: string;
  children: React.ReactNode;
  onAddNew?: () => void;
}

const Column = (props: PropType) => {
  const { id, type, title, color, children, onAddNew = () => console.log("button clicked") } = props;
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id, data: { type } });
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
        {...listeners}
        className={`flex justify-center rounded-t border-b border-gray-400 bg-${color}-300 hover:cursor-grab`}
      >
        <div className="text-center text-2xl p-3 font-semibold">{title}</div>
      </div>
      {/* Column Body */}
      <div className="p-3 bg-white">
        <button
          className={`border-2 border-dashed text-gray-700 border-${color}-300 p-2 rounded w-full hover:cursor-pointer hover:text-gray-900 text-lg font-semibold hover:bg-${color}-300`}
          onClick={onAddNew}
        >
          Add New
        </button>
      </div>
      <div className="grow flex flex-col p-3 gap-3 overflow-y-auto overflow-x-hidden bg-white text-gray-900 rounded-b">
        {children}
      </div>
    </div>
  );
};

export default Column;
