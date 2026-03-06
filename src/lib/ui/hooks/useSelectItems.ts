import { useCallback } from 'react';
import { type Selection } from 'react-aria-components';
import { SEARCH_PARAM_KEYS } from '@/shared';
import { useQueryParams } from './useQueryParams';

export function useSelectItems(key: keyof typeof SEARCH_PARAM_KEYS) {
  const { setSearchParams, searchParams } = useQueryParams();

  const updateSelectedItems = useCallback(
    (items: Selection) => {
      if (items === 'all') {
        setSearchParams(SEARCH_PARAM_KEYS[key], 'all');
      } else {
        setSearchParams(SEARCH_PARAM_KEYS[key], Array.from(items).join(','));
      }
    },
    [key, setSearchParams],
  );

  const cleanSelectedItems = useCallback(() => {
    setSearchParams(SEARCH_PARAM_KEYS[key], '');
  }, [key, setSearchParams]);

  const selectedItems = searchParams.get(SEARCH_PARAM_KEYS[key]);

  return {
    selectedItems:
      selectedItems === 'all'
        ? selectedItems
        : ((selectedItems ?? '').split(',').filter(Boolean) as 'all' | string[]),
    updateSelectedItems,
    cleanSelectedItems,
  };
}
