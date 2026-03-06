'use client';

import '@bitnoi.se/react-scheduler/dist/style.css';
import { type SchedulerData } from '@bitnoi.se/react-scheduler';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { HRIS_ROUTES, ALL_ITEMS_PER_PAGE, parseDate, SEARCH_PARAM_KEYS } from '@/shared';
import { useQueryParams } from '@/lib/ui/hooks';
import { logger } from '@/shared/service/pino';

// Dynamically import Scheduler to avoid SSR issues
const Scheduler = dynamic(() => import('@bitnoi.se/react-scheduler').then((mod) => mod.Scheduler), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center">
      <p>Loading scheduler...</p>
    </div>
  ),
});

type Props = {
  data: SchedulerData;
  dateFormat: string;
};

const _LOCALE_MAP = {
  en: 'en',
  pl: 'pl',
} as const;

export function AvailabilityChart({ data, dateFormat }: Props) {
  const router = useRouter();
  const { setMultipleSearchParams } = useQueryParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert serialized date strings back to Date objects for the Scheduler component
  // Only process on client side after mount to avoid hydration mismatches
  const processedData = useMemo(() => {
    if (!isMounted) {
      return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item) => {
      const label = item.label || {};

      const absenceData = (item.data || []).map((absence) => {
        const startDate =
          typeof absence.startDate === 'string' ? new Date(absence.startDate) : absence.startDate;
        const endDate = typeof absence.endDate === 'string' ? new Date(absence.endDate) : absence.endDate;

        return {
          ...absence,
          startDate,
          endDate,
        };
      });

      return {
        id: item.id,
        label: {
          icon: label.icon || '',
          title: label.title || 'Unknown',
          subtitle: label.subtitle || '',
        },
        data: absenceData,
      };
    });
  }, [data, isMounted]);

  const handleRangeChange = useCallback(
    (range: { startDate: Date; endDate: Date }) => {
      setMultipleSearchParams([
        { key: SEARCH_PARAM_KEYS.FROM, value: parseDate(range.startDate, 'YYYY-MM-DD') },
        { key: SEARCH_PARAM_KEYS.TO, value: parseDate(range.endDate, 'YYYY-MM-DD') },
      ]);
    },
    [setMultipleSearchParams],
  );

  if (!isMounted || !Array.isArray(processedData) || processedData.length === 0) {
    return (
      <section className="relative flex flex-1 items-center justify-center border border-t-grey">
        <p className="text-text-light-body">{!isMounted ? 'Loading...' : 'No employees available'}</p>
      </section>
    );
  }

  return (
    <section
      className="relative flex flex-1 border border-t-grey"
      style={{
        minHeight: '500px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          minHeight: '600px',
        }}
      >
        <Scheduler
          key={`scheduler-${processedData.length}-${processedData[0]?.id || 'default'}`}
          config={{
            zoom: 1,
            filterButtonState: -1,
            maxRecordsPerPage: ALL_ITEMS_PER_PAGE || 1000,
            showTooltip: false,
            lang: 'en',
          }}
          data={processedData}
          onItemClick={(item) => router.push(HRIS_ROUTES.employees.absence.base(item.id))}
          onRangeChange={handleRangeChange}
          onTileClick={(absenceInfo) =>
            logger.info(
              `Go to absence approval - ${parseDate(absenceInfo.startDate, dateFormat)}, ${parseDate(absenceInfo.endDate, dateFormat)}`,
            )
          }
        />
      </div>
    </section>
  );
}
