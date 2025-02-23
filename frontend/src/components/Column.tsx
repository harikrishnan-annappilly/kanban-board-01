import React from "react";

interface PropType {
  title: string;
  color: string;
  children: React.ReactNode;
}

const Column = (props: PropType) => {
  const { title, color, children } = props;

  return (
    <div
      className={`border border-gray-400 min-w-52 w-full max-w-96 flex flex-col rounded ${`${
        color.split("-")[1]
      }-scroll`}`}
    >
      {/* Column Heading */}
      <div className={`text-center text-2xl p-3 font-semibold rounded-t border-b border-gray-400 ${color}`}>
        {title}
      </div>
      {/* Column Body */}
      <div className="grow flex flex-col p-3 gap-3 overflow-y-auto bg-white rounded-b">{children}</div>
    </div>
  );
};

export default Column;
