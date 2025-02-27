export type ColumnType = {
  id: string;
  title: string;
  color?: string;
};

export type ItemsType = {
  id: string;
  title: string;
  content: string;
  columnId: string;
};
