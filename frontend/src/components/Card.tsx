import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PropType {
  id: string;
  type: string;
  title: string;
  content: string;
  color: string;
  onDelete: () => void;
}

const Card = (props: PropType) => {
  const { id, type, title, content, color, onDelete } = props;
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id, data: { type } });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded text-center border border-gray-400 shadow ${isDragging ? "opacity-30" : ""}`}
    >
      {/* Card Heading */}
      <div className={`flex rounded-t font-semibold text-lg p-1 border-b border-gray-400 bg-${color}-300`}>
        <div className="flex w-full justify-between px-2">
          <div className="grow hover:cursor-grab" {...listeners}>
            <div className="justify-self-center">{title}</div>
          </div>
          <div>
            <div className="justify-self-end">
              <button className="bg-red-600 text-white px-2 rounded cursor-pointer" onClick={onDelete}>
                X
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-1 bg-white rounded-b text-sm">{content}</div>
    </div>
  );
};

export default Card;
