import { useEffect, useState } from "react";
import Card from "./components/Card";
import Column from "./components/Column";

type ColumnType = {
  id: string;
  title: string;
  color?: string;
};

type ItemsType = {
  id: string;
  title: string;
  content: string;
  columnId: string;
};

const dummyContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores fugit nihil rem.";

const defaultColumns = [
  { id: "column1", title: "Todo", color: "bg-sky-300" },
  { id: "column2", title: "Doing", color: "bg-yellow-300" },
  { id: "column3", title: "Review", color: "bg-purple-300" },
  { id: "column4", title: "Done", color: "bg-green-300" },
];

const defaultItems = [
  { id: "item1", title: "Item 1", columnId: "column1", content: dummyContent },
  { id: "item2", title: "Item 2", columnId: "column1", content: dummyContent },
  { id: "item3", title: "Item 3", columnId: "column1", content: dummyContent },
  { id: "item4", title: "Item 4", columnId: "column2", content: dummyContent },
  { id: "item5", title: "Item 4", columnId: "column3", content: dummyContent },
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
          <Column key={column.id} title={column.title} color={getColor(column.color)}>
            {items
              .filter((fItem) => fItem.columnId === column.id)
              .map((item) => (
                <Card key={item.id} title={item.title} color={getColor(column.color)} content={item.content} />
              ))}
          </Column>
        ))}
      </div>
    </div>
  );
};

export default App;
