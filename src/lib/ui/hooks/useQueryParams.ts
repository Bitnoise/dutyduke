'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { type SortDir, type OrderByKey } from '@/shared';

/**
 * @param sortOrderBy - custom sort key, by default set to "lastName"
 * Hook that manages query parameters in the URL for sorting and searching.
 * @returns Contains functions and state to handle URL updates for sorting and searching.
 */
export const useQueryParams = () => {
  const { replace } = useRouter();
  const pathName = usePathname();

  const [queryPhrase, setQueryPhrase] = useState('');

  // Get the current search parameters from the URL
  const searchParams = useSearchParams();

  // Memoize parsed values to avoid recalculating on every render
  const sort = useMemo(() => searchParams.get('sort')?.split('-'), [searchParams]);
  const currSort = useMemo(
    () => ({
      sortName: sort?.[0],
      sortDir: sort?.[1],
    }),
    [sort],
  );
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  // Use refs to store latest values for the debounced function
  const pathNameRef = useRef(pathName);
  const replaceRef = useRef(replace);
  const searchParamsRef = useRef(searchParams);

  // Update refs when values change (only when they actually change)
  useEffect(() => {
    pathNameRef.current = pathName;
  }, [pathName]);

  useEffect(() => {
    replaceRef.current = replace;
  }, [replace]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // Create debounced function once, it will read from refs to get latest values
  const debouncedSearch = useRef(
    debounce((queryPhrase: string) => {
      if (queryPhrase) {
        setQueryPhrase(queryPhrase);
        const newSearchParams = new URLSearchParams(searchParamsRef.current);
        newSearchParams.set('search', queryPhrase);
        newSearchParams.set('page', '1');
        replaceRef.current(`${pathNameRef.current}?${newSearchParams}`, { scroll: false });
      } else {
        setQueryPhrase('');
        const newSearchParams = new URLSearchParams(searchParamsRef.current);
        newSearchParams.delete('search');
        newSearchParams.set('page', '1');
        replaceRef.current(`${pathNameRef.current}?${newSearchParams}`, { scroll: false });
      }
    }, 300),
  );

  // Cleanup debounced function on unmount to prevent memory leaks
  useEffect(() => {
    const cancel = debouncedSearch.current;
    return () => {
      cancel.cancel();
    };
  }, []);

  /**
   * Handles search input changes.
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch.current.cancel();
    debouncedSearch.current(encodeURIComponent(e.target.value));
  };

  /**
   * Handles sorting by a given header ID.
   * @param {string} headerId - The header ID to sort by.
   */
  const handleSort = (headerId: OrderByKey, sortDir?: SortDir) => {
    const newSortDir = currSort.sortDir === 'desc' ? 'asc' : 'desc';
    params.set('sort', `${headerId}-${sortDir ?? newSortDir}`);
    replace(`${pathName}?${params}`, { scroll: false });
  };

  const setSearchParams = useCallback(
    (key: string, value: string, prefix?: string) => {
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set(prefix ? `${prefix}_${key}` : key, value);

      return replace(`${pathName}?${newSearchParams.toString()}`, { scroll: false });
    },
    [searchParams, pathName, replace],
  );

  const removeSearchParam = useCallback(
    (key: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(key);
      return replace(`${pathName}?${newSearchParams.toString()}`, { scroll: false });
    },
    [searchParams, pathName, replace],
  );

  const setMultipleSearchParams = useCallback(
    (params: { key: string; value: string }[], prefix?: string) => {
      const newSearchParams = new URLSearchParams(searchParams);

      for (const param of params) {
        newSearchParams.set(prefix ? `${prefix}_${param.key}` : param.key, param.value);
      }

      return replace(`${pathName}?${newSearchParams.toString()}`, { scroll: false });
    },
    [searchParams, pathName, replace],
  );

  return {
    handleSearch,
    handleSort,
    queryPhrase,
    currSort,
    setSearchParams,
    searchParams,
    setMultipleSearchParams,
    removeSearchParam,
  };
};
