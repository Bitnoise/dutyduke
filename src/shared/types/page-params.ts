import { type CUID } from './cuid';
import { type OrderBy } from './sort';

export type IdParams = {
  id: CUID;
  earningId?: CUID;
};

export type PaginationSearchParams = {
  page: string;
  perPage?: string;
};

export type SortSearchParams<T = OrderBy> = {
  sort: T;
};

export type PageParams<TParams, TSearchParams = undefined> = {
  params: TParams;
  searchParams?: TSearchParams;
};
