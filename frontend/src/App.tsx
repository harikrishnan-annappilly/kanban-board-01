import { useEffect, useState } from "react";
import Card from "./components/Card";
import Column from "./components/Column";
import { closestCenter, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

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
  { id: "item5", title: "Item 5", columnId: "column3", content: dummyContent },
];

const App = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [items, setItems] = useState<ItemsType[]>([]);
  const [active, setActive] = useState<{ id: string | null; type: string | null }>({ id: null, type: null });

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

  const getActiveData = (): { column: ColumnType; item: ItemsType } => {
    if (active.type === "column")
      return {
        column: columns.find((col) => col.id === active.id) || { id: "", title: "NA" },
        item: { id: "", title: "NA", content: "NA", columnId: "" },
      };
    return {
      item: items.find((item) => item.id === active.id) || { id: "", title: "NA", content: "NA", columnId: "" },
      column: columns.find((column) => column.id === items.find((item) => item.id === active.id)?.columnId) || {
        id: "",
        title: "NA",
      },
    };
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActive({ id: event.active.id.toString(), type: event.active.data.current?.type });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActive({ id: null, type: null });

    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type === "column") {
      const currentPosition = columns.findIndex((column) => column.id === active.id);
      const targetPosition = columns.findIndex((column) => column.id === over.id);
      if (currentPosition === targetPosition) return;
      setColumns((prev) => arrayMove(prev, currentPosition, targetPosition));
      console.log("make api call column sort");
    }
    if (active.data.current?.type === "item") {
      const currentPosition = items.findIndex((item) => item.id === active.id);
      const targetPosition = items.findIndex((item) => item.id === over.id);
      if (currentPosition === targetPosition) return;
      setItems((prev) => arrayMove(prev, currentPosition, targetPosition));
      console.log("make api call items sort");
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    if (active.data.current?.type === "column") return;

    const targetColumnId = over.data.current?.type === "column" ? over.id : over.data.current?.sortable.containerId;
    const currentColumnId = active.data.current?.sortable.containerId;
    if (targetColumnId === currentColumnId) return;

    const dupItems = Array.from(items);
    const index = dupItems.findIndex((item) => item.id === active.id);
    dupItems[index].columnId = targetColumnId;
    setItems(dupItems);
    console.log("make api call item value edited");
  };

  return (
    <div className="flex flex-col h-screen">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {/* Main Heading */}
        <div className="bg-gray-950 text-white">
          <div className="text-center text-4xl font-bold underline m-5">Kanban Board</div>
        </div>
        {/* Board */}
        <div className="bg-gray-200 grow flex p-4 gap-4 overflow-x-auto">
          <SortableContext items={columns} id="main">
            {/* Columns Inside Board */}
            {columns.map((column) => (
              <Column key={column.id} id={column.id} type="column" title={column.title} color={getColor(column.color)}>
                <SortableContext items={items.filter((fitem) => fitem.columnId === column.id)} id={column.id}>
                  {items
                    .filter((fItem) => fItem.columnId === column.id)
                    .map((item) => (
                      <Card
                        key={item.id}
                        id={item.id}
                        type="item"
                        title={item.title}
                        color={getColor(column.color)}
                        content={item.content}
                      />
                    ))}
                </SortableContext>
              </Column>
            ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {active.type === "column" ? (
            <Column
              id=""
              type=""
              title={getActiveData().column?.title || "NA"}
              color={getColor(getActiveData().column?.color)}
            >
              {items
                .filter((fItem) => fItem.columnId === active.id)
                .map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    type="item"
                    title={item.title}
                    color={getColor(getActiveData().column?.color)}
                    content={item.content}
                  />
                ))}
            </Column>
          ) : null}
          {active.type === "item" ? (
            <Card
              id=""
              type=""
              title={getActiveData().item?.title || "NA"}
              content={getActiveData().item?.content || "NA"}
              color={getColor(getActiveData().column?.color)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default App;
