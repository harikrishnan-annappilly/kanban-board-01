interface PropType {
  title: string;
  content: string;
  color: string;
}

const Card = (props: PropType) => {
  const { title, content, color } = props;

  return (
    <div className="rounded text-center border border-gray-400 shadow">
      {/* Card Heading */}
      <div className={`rounded-t font-semibold text-lg p-1 border-b border-gray-400 ${color}`}>{title}</div>
      {/* Card Body */}
      <div className="p-1 bg-white rounded-b text-sm">{content}</div>
    </div>
  );
};

export default Card;
