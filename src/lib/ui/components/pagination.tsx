'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { cn, PAGINATION_OFFSET, SEARCH_PARAM_KEYS } from '@/shared';
import { useQueryParams } from '../hooks';
import { Button } from '.';

type Props = {
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
};

export function Pagination({ totalPages, nextPage, prevPage }: Props) {
  const { setSearchParams, searchParams } = useQueryParams();
  const currentPage = +(searchParams.get(SEARCH_PARAM_KEYS.PAGE) ?? 1);

  const tNext = useNextTranslations('pagination');
  const hasNextPage = !!nextPage;
  const hasPrevPage = !!prevPage;

  const navigateToPage = (pageToNavigate: number | undefined) =>
    pageToNavigate ? setSearchParams(SEARCH_PARAM_KEYS.PAGE, pageToNavigate.toString()) : '#';

  // Validate totalPages to prevent "Invalid array length" error
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? Math.floor(totalPages) : 1;

  let paginationPages: (number | string)[] = Array.from(Array(safeTotalPages).keys()).map((item) => item + 1);

  const firstPage = paginationPages[0];
  const lastPage = paginationPages[paginationPages.length - 1];

  const halfOffset = Math.floor(PAGINATION_OFFSET / 2);

  if (safeTotalPages <= PAGINATION_OFFSET) {
    paginationPages = paginationPages;
  } else if (currentPage < PAGINATION_OFFSET)
    paginationPages = [...paginationPages.slice(0, PAGINATION_OFFSET), '...', lastPage];
  else if (currentPage > safeTotalPages - PAGINATION_OFFSET) {
    paginationPages = [
      firstPage,
      '...',
      ...paginationPages.slice(safeTotalPages - PAGINATION_OFFSET - 1, safeTotalPages),
    ];
  } else {
    paginationPages = [
      firstPage,
      '...',
      ...paginationPages.slice(currentPage - halfOffset, currentPage + halfOffset),
      '...',
      lastPage,
    ];
  }

  if (safeTotalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-y-1">
      <div className="mt-4 flex items-center justify-center gap-x-2 py-4 text-base">
        {hasPrevPage && (
          <div>
            <Button
              aria-label={tNext('goToPrev')}
              icon="arrow-left"
              intent="tertiary"
              onClick={() => prevPage && navigateToPage(prevPage)}
            />
          </div>
        )}
        <ul className="flex items-center gap-x-2">
          {paginationPages.map((paginationPage, index) => {
            const isActive = paginationPage === currentPage;

            if (typeof paginationPage === 'string') {
              return (
                <span key={`${paginationPage}--${index}`} className="hidden sm:block">
                  {paginationPage}
                </span>
              );
            }

            return (
              <li
                key={paginationPage}
                className={cn({
                  'sm:block': paginationPage,
                  hidden: paginationPage !== currentPage,
                })}
              >
                <Button
                  aria-label={
                    isActive
                      ? tNext('currentPage', { page: paginationPage })
                      : tNext('goToPage', { page: paginationPage })
                  }
                  className="relative"
                  intent="ghost"
                  onClick={() => navigateToPage(paginationPage)}
                >
                  <span
                    className={cn({
                      'font-semibold text-gray-900': isActive,
                    })}
                  >
                    {paginationPage}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
        {hasNextPage && (
          <div>
            <Button
              aria-label={tNext('goToNext')}
              icon="arrow-right"
              intent="tertiary"
              onClick={() => nextPage && navigateToPage(nextPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
