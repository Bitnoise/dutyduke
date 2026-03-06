export type Paginated<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
};
