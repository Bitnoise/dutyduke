import { ITEMS_PER_PAGE } from '@/shared/constants';
import { type Paginated } from '@/shared/types';

//! FOR API USE ONLY

/**
 * Parses data to pagination data
 * @param items - items on given page
 * @param currPage - current page
 * @param totalItems - total count of items in database
 * @returns pagination data
 */
export function getPaginatedData<TItem>(
  items: TItem[],
  currPage: number,
  totalItems: number,
  perPage: number = ITEMS_PER_PAGE,
): Paginated<TItem> {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const nextPage = Math.min(currPage + 1, totalPages);
  const prevPage = Math.max(1, currPage - 1);

  return {
    items,
    totalItems,
    totalPages,
    nextPage: nextPage <= totalPages && nextPage !== currPage ? nextPage : null,
    prevPage: prevPage >= 1 && prevPage !== currPage ? prevPage : null,
  };
}
