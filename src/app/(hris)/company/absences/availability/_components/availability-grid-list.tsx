'use client';

import dayjs from 'dayjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, GridList, GridListHeader, GridListItem, NoResults } from '@/lib/ui';
import { cn, HRIS_ROUTES, SEARCH_PARAM_KEYS, type OrderBy, type PropsWithClassName } from '@/shared';
import { useQueryParams } from '@/lib/ui/hooks';
import { type EmployeeWithAbsences } from '@/shared/utils/parse-employees-with-absences';
import { getMonthBusinessDays } from '@/shared/utils/get-month-business-days-diff';
import { countDays, getEmployeeAvailability } from '@/shared/utils/get-employee-availability';
import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';

type Props = {
  data: EmployeeWithAbsences[];
  globalAbsences: AbsenceDTO[];
  year: number;
};

const SORT_KEYS = [
  { key: 'firstName-asc' },
  { key: 'firstName-desc' },
  { key: 'lastName-asc' },
  { key: 'lastName-desc' },
] as Array<{ key: OrderBy }>;

export function AvailabilityGridList({
  data,
  className,
  globalAbsences,
  year = dayjs().year(),
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const { setMultipleSearchParams } = useQueryParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const yearMonthParam = searchParams.get(SEARCH_PARAM_KEYS.YEAR_MONTH)
    ? dayjs(searchParams.get(SEARCH_PARAM_KEYS.YEAR_MONTH)).format('YYYY-MM')
    : dayjs().format('YYYY-MM');

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const yearMonth = (
      direction === 'next'
        ? dayjs(yearMonthParam).add(1, 'month')
        : dayjs(yearMonthParam).subtract(1, 'month')
    ).format('YYYY-MM');
    setMultipleSearchParams([{ key: SEARCH_PARAM_KEYS.YEAR_MONTH, value: yearMonth }]);
  };

  const globalAbsencesDaysCount = globalAbsences.reduce(
    (acc, absence) => countDays(dayjs(yearMonthParam).month(), year, acc, absence),
    0,
  );

  const workDays = getMonthBusinessDays(dayjs(yearMonthParam).get('month'), false, false, year);

  if (!data.length) {
    return <NoResults />;
  }

  return (
    <>
      <GridListHeader
        className={cn(className, 'border-b border-b-divider')}
        searchParamKey="EMPLOYEES"
        sortKeys={SORT_KEYS}
      >
        <div className="ml-auto">
          <div className="flex items-center gap-2.5">
            <Button
              aria-label={tNext('absences.availability.prevMonth')}
              icon="arrow-left"
              intent="tertiary"
              onClick={() => handleMonthChange('prev')}
            />
            <div>
              <p className="text-center text-sm text-accent">
                {t(`months.${dayjs(yearMonthParam).get('month') + 1}`)} {dayjs(yearMonthParam).get('year')}
              </p>
              <p className="text-text-light-body text-center text-xxs">
                {`${t('absences.availability.workdays')}: `}
                <span className="font-semibold">
                  {t('absences.availability.days', { number: workDays - globalAbsencesDaysCount })}
                </span>
              </p>
            </div>
            <Button
              aria-label={tNext('absences.availability.nextMonth')}
              icon="arrow-right"
              intent="tertiary"
              onClick={() => handleMonthChange('next')}
            />
          </div>
        </div>
      </GridListHeader>
      <GridList
        aria-label={tNext('absences.availability.listTitle')}
        className={cn(className)}
        searchParamKey="EMPLOYEES"
      >
        {data.map((employee) => (
          <GridListItem
            key={employee.id}
            className="border-b border-b-divider py-2"
            id={employee.id}
            textValue={`${employee.id} ${employee.firstName}`}
            onAction={() => router.push(HRIS_ROUTES.employees.absence.base(employee.id))}
          >
            <div className="flex w-full flex-col">
              <div className="flex gap-x-3">
                <span className="max-w-[12.375rem] truncate whitespace-nowrap text-sm sm:max-w-[21.875rem] md:max-w-[30rem]">
                  {`${employee.firstName} ${employee.lastName}`}
                </span>
              </div>
              <div className="text-text-light-body flex w-full justify-between text-xs">
                <span className="mr-4 whitespace-nowrap text-xxs">{employee.role || '-'}</span>
                <div>
                  <span className="mr-1 whitespace-nowrap text-xxs">
                    {t('absences.availability.availability')}:
                  </span>
                  <span className="whitespace-nowrap text-xxs font-semibold md:max-w-full">
                    {getEmployeeAvailability(
                      yearMonthParam,
                      workDays,
                      employee.absences,
                      globalAbsences,
                      year,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </GridListItem>
        ))}
      </GridList>
    </>
  );
}
