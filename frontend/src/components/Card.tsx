import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PropType {
  id: string;
  type: string;
  title: string;
  content: string;
  color: string;
}

const Card = (props: PropType) => {
  const { id, type, title, content, color } = props;
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id, data: { type } });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded text-center border border-gray-400 shadow ${isDragging ? "opacity-30" : ""}`}
    >
      {/* Card Heading */}
      <div
        {...attributes}
        {...listeners}
        className={`rounded-t font-semibold text-lg p-1 border-b border-gray-400 bg-${color}-300`}
      >
        {title}
      </div>
      {/* Card Body */}
      <div className="p-1 bg-white rounded-b text-sm">{content}</div>
    </div>
  );
};

export default Card;
