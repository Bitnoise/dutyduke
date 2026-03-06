import dayjs from 'dayjs';
import { useCallback } from 'react';
import { DOCUMENTS_WARNING_BADGE_TIME, type Nullable } from '@/shared';

export function useBadge() {
  const getBadge = useCallback((date: Date | null): Nullable<'critical' | 'ok' | 'warning'> => {
    if (!date) return null;

    const daysDiff = dayjs(date).diff(dayjs(), 'day');

    if (daysDiff <= 0) {
      return 'critical';
    }

    if (daysDiff <= DOCUMENTS_WARNING_BADGE_TIME) {
      return 'warning';
    }

    return null;
  }, []);

  return getBadge;
}
