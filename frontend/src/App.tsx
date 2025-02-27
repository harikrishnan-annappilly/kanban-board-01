import { useEffect, useState } from "react";
import Column from "./components/Column";
import Card from "./components/Card";
import { closestCenter, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import http from "./services/http";
import { ColumnType, ItemsType } from "./types/KanbanBoard";

const App = () => {
  const columnIdentifierKeyword = "status";
  const taskIdentifierKeyword = "task";

  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [items, setItems] = useState<ItemsType[]>([]);
  const [active, setActive] = useState<{ id: string | null; type: string | null }>({ id: null, type: null });

  useEffect(() => {
    const columnsAbortController = new AbortController();
    const itemsAbortController = new AbortController();

    http
      .get("/sorted-tasks", { signal: itemsAbortController.signal })
      .then((response) =>
        setItems(
          response.data.map((item: ItemsType) => ({
            ...item,
            id: `${taskIdentifierKeyword}${item.id}`,
            columnId: `${columnIdentifierKeyword}${item.columnId}`,
          }))
        )
      )
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        console.log(err);
      });

    http
      .get("/sorted-status", { signal: columnsAbortController.signal })
      .then((response) =>
        setColumns(response.data.map((col: ColumnType) => ({ ...col, id: `${columnIdentifierKeyword}${col.id}` })))
      )
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        console.log(err);
      });

    const cancelFetch = () => {
      columnsAbortController.abort();
      itemsAbortController.abort();
    };

    return () => cancelFetch();
  }, []);

  const getColor = (color: string | undefined) => (color ? color : "bg-gray-300");

  const getActiveData = (): { column: ColumnType; item: ItemsType } => {
    if (active.type === columnIdentifierKeyword)
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
    if (active.data.current?.type === columnIdentifierKeyword) {
      const currentPosition = columns.findIndex((column) => column.id === active.id);
      const targetPosition = columns.findIndex((column) => column.id === over.id);
      if (currentPosition === targetPosition) return;
      setColumns((prev) => arrayMove(prev, currentPosition, targetPosition));
      console.log("make api call column sort");
      const columnIds = arrayMove(columns, currentPosition, targetPosition).map((col) =>
        Number.parseInt(col.id.replace(columnIdentifierKeyword, ""))
      );
      http.put("/sort-status", columnIds).catch((err) => console.log(err));
    }
    if (active.data.current?.type === taskIdentifierKeyword) {
      const currentPosition = items.findIndex((item) => item.id === active.id);
      const targetPosition = items.findIndex((item) => item.id === over.id);
      if (currentPosition === targetPosition) return;
      setItems((prev) => arrayMove(prev, currentPosition, targetPosition));
      const itemIds = arrayMove(items, currentPosition, targetPosition).map((item) =>
        Number.parseInt(item.id.replace(taskIdentifierKeyword, ""))
      );
      http.put("/sort-tasks", itemIds).catch((err) => console.log(err));
      console.log("make api call items sort");
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    if (active.data.current?.type === columnIdentifierKeyword) return;

    const targetColumnId =
      over.data.current?.type === columnIdentifierKeyword ? over.id : over.data.current?.sortable.containerId;
    const currentColumnId = active.data.current?.sortable.containerId;
    if (targetColumnId === currentColumnId) return;

    const dupItems = Array.from(items);
    const index = dupItems.findIndex((item) => item.id === active.id);
    dupItems[index].columnId = targetColumnId;
    setItems(dupItems);

    const itemData = {
      title: dupItems[index].title,
      status_id: Number.parseInt(dupItems[index].columnId.replace(columnIdentifierKeyword, "")),
    };
    const itemId = dupItems[index].id.replace(taskIdentifierKeyword, "");
    console.log("make api call item value edited");
    http.put(`/task/${itemId}`, itemData).catch((err) => console.log(err));
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
              <Column
                key={column.id}
                id={column.id}
                type={columnIdentifierKeyword}
                title={column.title}
                color={getColor(column.color)}
              >
                <SortableContext items={items.filter((fitem) => fitem.columnId === column.id)} id={column.id}>
                  {items
                    .filter((fItem) => fItem.columnId === column.id)
                    .map((item) => (
                      <Card
                        key={item.id}
                        id={item.id}
                        type={taskIdentifierKeyword}
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
          {active.type === columnIdentifierKeyword ? (
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
                    type={taskIdentifierKeyword}
                    title={item.title}
                    color={getColor(getActiveData().column?.color)}
                    content={item.content}
                  />
                ))}
            </Column>
          ) : null}
          {active.type === taskIdentifierKeyword ? (
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
