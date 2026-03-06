import { type OrderByKey } from './sort';

export type ColumnConfig = {
  label: string;
  sortKey?: OrderByKey;
  widthPx?: number;
  flex?: 1 | 2 | 3;
  widthClassName?: string;
};

export type Columns = Record<string, ColumnConfig>;
