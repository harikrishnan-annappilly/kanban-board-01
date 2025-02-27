const dummyContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores fugit nihil rem.";

export const defaultColumns = [
  { id: "column1", title: "Todo", color: "sky" },
  { id: "column2", title: "Doing", color: "yellow" },
  { id: "column3", title: "Review", color: "purple" },
  { id: "column4", title: "Done", color: "green" },
];

export const defaultItems = [
  { id: "item1", title: "Item 1", columnId: defaultColumns[0].id, content: dummyContent },
  { id: "item2", title: "Item 2", columnId: defaultColumns[0].id, content: dummyContent },
  { id: "item3", title: "Item 3", columnId: defaultColumns[0].id, content: dummyContent },
  { id: "item4", title: "Item 4", columnId: defaultColumns[1].id, content: dummyContent },
  { id: "item5", title: "Item 5", columnId: defaultColumns[2].id, content: dummyContent },
];
