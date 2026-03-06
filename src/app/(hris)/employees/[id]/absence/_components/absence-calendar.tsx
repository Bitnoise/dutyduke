'use client';
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from 'react-aria-components';
import { CalendarDate } from '@internationalized/date';
import { useRef } from 'react';
import dayjs from 'dayjs';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, countTakenDaysOff, getCurrMonthAbsences } from '@/shared';
import { isDateInRange } from '@/shared/utils/is-date-in-range';
import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { isWeekend } from '@/shared/utils/is-weekend';
import { getMonthBusinessDays } from '@/shared/utils/get-month-business-days-diff';
import { getBusinessDaysDiff } from '@/shared/utils/get-business-days-diff';

type Props = {
  month: number;
  year: number;
  ranges: AbsenceDTO[];
};

export function AbsenceCalendar({ month, year, ranges }: Props) {
  const t = useTranslations();
  const date = useRef(new CalendarDate(year, month, 1));
  const rangesRef = useRef(ranges);
  const parsedMonth = month - 1;

  const currentMonth = dayjs().month(parsedMonth);
  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');

  const globalInCurrMonth = getCurrMonthAbsences(rangesRef.current, ['GLOBAL'], parsedMonth);

  const restAbsencesInCurrMonth = getCurrMonthAbsences(
    rangesRef.current,
    ['HOLIDAY', 'PERSONAL', 'SICK'],
    parsedMonth,
  );

  const takenDays =
    restAbsencesInCurrMonth.reduce((acc, curr) => acc + curr.days, 0) -
    countTakenDaysOff(globalInCurrMonth, restAbsencesInCurrMonth);

  const globalDaysOffCount = rangesRef.current.reduce((acc, range) => {
    if (range.type !== 'GLOBAL') return acc;

    const rangeStart = dayjs(range.startDate);
    const rangeEnd = dayjs(range.endDate);

    if (!isDateInRange(currentMonth, rangeStart, rangeEnd, 'month')) {
      return acc;
    }

    const isStartBefore = rangeStart.isBefore(startOfMonth);
    const isEndAfter = rangeEnd.isAfter(endOfMonth);

    const startDate = isStartBefore ? startOfMonth : rangeStart;
    const endDate = isEndAfter ? endOfMonth : rangeEnd;

    return (
      acc +
      getBusinessDaysDiff(
        startDate,
        endDate,
        isStartBefore ? undefined : range.halfStart,
        isEndAfter ? undefined : range.halfEnd,
      )
    );
  }, 0);

  const totalWorkingDays = getMonthBusinessDays(parsedMonth, undefined, undefined, year) - globalDaysOffCount;

  const availableDays = totalWorkingDays - takenDays;

  return (
    <Calendar
      key={year}
      isReadOnly
      className="h-[231px] flex-1 rounded-lg border border-gray-200"
      defaultValue={date.current}
    >
      <header className="flex h-[47px] flex-col items-center rounded-t-lg border-b border-gray-200 bg-super-light-blue py-1">
        <Heading className="text-sm font-semibold">{t(`months.${date.current.month}`)}</Heading>
        <p className="text-xs">
          {t('absences.availability.availability')}{' '}
          <span className="font-bold text-accent">{availableDays}</span>/{totalWorkingDays}
        </p>
      </header>
      <CalendarGrid className="flex flex-col items-center px-2">
        <CalendarGridHeader className="mx-auto flex h-9 items-center justify-center">
          {(day) => (
            <CalendarHeaderCell className="h-5 w-[2.375rem] text-xxs font-semibold">{day}</CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => {
            const parsedDate = dayjs(date.toString());
            const range = rangesRef.current
              .filter((range) => isDateInRange(parsedDate, dayjs(range.startDate), dayjs(range.endDate)))
              .pop();

            const isToday = parsedDate.isSame(dayjs(), 'day');
            const isStartRange = range && parsedDate.isSame(range.startDate, 'day');
            const isEndRange = range && parsedDate.isSame(range.endDate, 'day');

            return (
              <CalendarCell
                className={cn(
                  'flex cursor-default h-5 w-9 items-center justify-center text-[0.625rem] data-[outside-visible-range]:hidden font-semibold',
                  {
                    'rounded-l-lg': isStartRange,
                    'rounded-r-lg': isEndRange,
                    'text-white': range && range.status !== 'REJECTED',
                    'bg-green-500': range?.type === 'HOLIDAY' && range?.status === 'APPROVED',
                    'bg-green-500/50 border-dashed border border-green-800':
                      range?.type === 'HOLIDAY' && range?.status === 'PENDING',
                    'bg-orange-400': range?.type === 'SICK' && range?.status === 'APPROVED',
                    'bg-orange-400/50 border-dashed border border-orange-400':
                      range?.type === 'SICK' && range?.status === 'PENDING',
                    'bg-blue-400': range?.type === 'PERSONAL' && range?.status === 'APPROVED',
                    'bg-blue-400/50 border-dashed border border-blue-400':
                      range?.type === 'PERSONAL' && range?.status === 'PENDING',
                    'bg-gray-600': range?.type === 'GLOBAL' && range?.status === 'APPROVED',
                    'text-accent': isToday,
                    'text-gray-300': isWeekend(parsedDate.day()) && !range,
                  },
                )}
                date={date}
              />
            );
          }}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  );
}
