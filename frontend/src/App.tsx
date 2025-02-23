import { useEffect, useState } from "react";

type ColumnType = {
  id: string;
  title: string;
  color?: string;
};

type ItemsType = {
  id: string;
  title: string;
  columnId: string;
};

const defaultColumns = [
  { id: "column1", title: "Todo", color: "bg-sky-300" },
  { id: "column2", title: "Doing", color: "bg-yellow-300" },
  { id: "column3", title: "Review", color: "bg-purple-300" },
  { id: "column4", title: "Done", color: "bg-green-300" },
];

const defaultItems = [
  { id: "item1", title: "Item 1", columnId: "column1" },
  { id: "item2", title: "Item 2", columnId: "column1" },
  { id: "item3", title: "Item 3", columnId: "column1" },
  { id: "item4", title: "Item 4", columnId: "column2" },
  { id: "item5", title: "Item 4", columnId: "column3" },
];

const App = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [items, setItems] = useState<ItemsType[]>([]);

  useEffect(() => {
    const fetchColumn = setTimeout(() => {
      setColumns(defaultColumns);
      console.log("Column fetched");
    }, 200);

    const fetchItems = setTimeout(() => {
      setItems(defaultItems);
      console.log("Items fetched");
    }, 400);

    const cancelFetch = () => {
      clearInterval(fetchColumn);
      clearInterval(fetchItems);
      console.warn("Cancelled fetch");
    };

    return () => cancelFetch();
  }, []);

  const getColor = (color: string | undefined) => (color ? color : "bg-gray-300");

  return (
    <div className="flex flex-col h-screen">
      {/* Main Heading */}
      <div className="bg-gray-950 text-white">
        <div className="text-center text-4xl font-bold underline m-5">Kanban Board</div>
      </div>
      {/* Board */}
      <div className="bg-gray-200 grow flex p-4 gap-4 overflow-x-auto ">
        {/* Columns Inside Board */}
        {columns.map((column) => (
          <div
            key={column.id}
            className={`border border-gray-400 min-w-52 w-full max-w-96 flex flex-col rounded ${`${
              getColor(column.color).split("-")[1]
            }-scroll`}`}
          >
            {/* Column Heading */}
            <div
              className={`text-center text-2xl p-3 font-semibold rounded-t border-b border-gray-400 ${getColor(
                column.color
              )}`}
            >
              {column.title}
            </div>
            {/* Column Body */}
            <div className="grow flex flex-col p-3 gap-3 overflow-y-auto bg-white rounded-b">
              {items
                .filter((fItem) => fItem.columnId === column.id)
                .map((item) => (
                  <div key={item.id} className="rounded text-center border border-gray-400 shadow">
                    {/* Card Heading */}
                    <div
                      className={`rounded-t font-semibold text-lg p-1 border-b border-gray-400 ${getColor(
                        column.color
                      )}`}
                    >
                      {item.title}
                    </div>
                    {/* Card Body */}
                    <div className="p-1 bg-white rounded-b text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt officia nam impedit accusamus
                      animi in quaerat tempora laboriosam nobis debitis ipsa error.
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
