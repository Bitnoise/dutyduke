'use client';

import { useWeekView } from 'react-weekview';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type Locale } from 'date-fns';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, SEARCH_PARAM_KEYS, type PropsWithClassName } from '@/shared';
import { getDateIgnoringTime } from '@/shared/utils/get-date-from-string';
import dayjs from '@/shared/utils/dayjs-plugins';
import { Icon } from '../icon';
import { useQueryParams } from '../../hooks';
import { type WeekViewCalendarProps } from './types';
import { DayColumn } from './day-column';
import { TimeStepsColumn } from './time-steps-column';

export function WeekView({
  className,
  events,
  minuteStep = 60,
  initialDate = new Date(),
  onCellClick,
  onEventClick,
  dateFormat,
  dateLocale,
  absenceEvents,
}: PropsWithClassName<Omit<WeekViewCalendarProps, 'locale'> & { dateLocale: Locale; dateFormat: string }>) {
  const { days, viewTitle, goToToday, nextWeek, previousWeek, weekNumber } = useWeekView({
    minuteStep,
    initialDate,
    locale: dateLocale,
  });
  const { setSearchParams } = useQueryParams();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const parsedEvents = useMemo(
    () =>
      events.map(({ startDate, endDate, createdAt, ...restEvent }) => ({
        ...restEvent,
        startDate: dayjs.utc(startDate).local(),
        endDate: dayjs.utc(endDate).local(),
        createdAt: dayjs.utc(createdAt).local(),
      })),
    [events],
  );

  const parsedAbsenceEvents = useMemo(
    () =>
      absenceEvents.map(({ startDate, endDate, createdAt, ...restAbsence }) => ({
        startDate: getDateIgnoringTime(startDate).startOf('day'),
        endDate: getDateIgnoringTime(endDate).endOf('day'),
        createdAt: dayjs(createdAt),
        ...restAbsence,
      })),
    [absenceEvents],
  );

  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const t = useTranslations('weekCalendar');
  const tNext = useNextTranslations('weekCalendar');

  useEffect(() => {
    const startOfDayTimeStep = document.getElementById('desktop-06:00');

    if (!wrapperRef.current || !startOfDayTimeStep) return;

    wrapperRef.current.scrollTo({
      top: startOfDayTimeStep.offsetTop,
    });
  }, []);

  const handleGoToNextWeek = () => {
    setSearchParams(SEARCH_PARAM_KEYS.WEEK, (+weekNumber + 1).toString());
    nextWeek();
  };

  const handleGoToPreviousWeek = () => {
    setSearchParams(SEARCH_PARAM_KEYS.WEEK, (+weekNumber - 1).toString());
    previousWeek();
  };

  const handleGoToToday = () => {
    goToToday();
    setSearchParams(SEARCH_PARAM_KEYS.WEEK, dayjs().isoWeek().toString());
  };

  return (
    <div
      className={cn('relative size-full overflow-y-auto rounded-lg border border-gray-200', className)}
      ref={wrapperRef}
    >
      <div className="sticky left-0 top-0 z-50 bg-white">
        <header className="flex items-center justify-between border-b border-gray-200 px-10">
          <h2 className="text-sm font-semibold uppercase">{viewTitle}</h2>
          <nav className="ml-auto flex items-center gap-x-2">
            <button
              aria-label={tNext('goToPrevWeek')}
              className="flex size-10 items-center justify-center"
              onClick={handleGoToPreviousWeek}
            >
              <Icon name="arrow-left" />
            </button>
            <button
              aria-label={tNext('goToToday')}
              className="h-5 border-x border-black px-4 text-sm font-semibold text-black"
              onClick={handleGoToToday}
            >
              {t('today')}
            </button>
            <button
              aria-label={tNext('goToNextWeek')}
              className="flex size-10 items-center justify-center"
              onClick={handleGoToNextWeek}
            >
              <Icon name="arrow-right" />
            </button>
          </nav>
        </header>
        <section className="grid min-h-[22px] grid-cols-[40px_repeat(7,1fr)] border-b border-gray-200">
          <div />
          {days.map((day) => {
            const parsedDay = dayjs(day.date).format('YYYY-MM-DD');

            const dayAbsences = parsedAbsenceEvents.filter(
              (absence) => dayjs(absence.startDate).format('YYYY-MM-DD') === parsedDay,
            );

            const isExpanded = expandedDays[parsedDay] ?? false;
            const absencesToShow = isExpanded ? dayAbsences : dayAbsences.slice(0, 3);
            return (
              <div
                key={day.date.toString()}
                className="flex min-w-0 flex-col items-center border-l border-gray-200 bg-super-light-blue"
              >
                <div className="mb-1 flex h-[22px] w-full items-center justify-center gap-x-2">
                  <h3 className=" text-center text-xs font-semibold uppercase">
                    {day.shortName.replace('.', '')}
                  </h3>
                  <span className="text-xs font-semibold text-dark-grey">{day.date.getDate()}</span>
                </div>
                {dayAbsences.length > 0 && (
                  <div className="w-full self-start border-t border-gray-200 p-1">
                    <ul className="flex w-full flex-col gap-y-0.5">
                      {absencesToShow.map((absence) => {
                        const label = absence.employee.length ? absence.employee[0] : tNext('companyOff');
                        return (
                          <li
                            key={absence.id}
                            className="flex h-4 w-full gap-x-1 rounded border border-gray-500 bg-gray-50 px-1 text-xxs font-semibold text-gray-500"
                            title={absence.employee[0]}
                          >
                            <Icon name="sun-fog" size="xxs" />
                            <span className="truncate">{label}</span>
                          </li>
                        );
                      })}
                    </ul>
                    {dayAbsences.length > 3 && (
                      <button
                        className="mt-1 text-xxs text-gray-500 hover:underline"
                        onClick={() =>
                          setExpandedDays((prev) => ({
                            ...prev,
                            [parsedDay]: !isExpanded,
                          }))
                        }
                      >
                        {isExpanded ? tNext('showLess') : tNext('showMore')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
      <section className="relative grid grid-cols-[40px_repeat(7,1fr)]">
        <TimeStepsColumn day={days[0]} idPrefix="desktop" />
        {days.map((day) => (
          <DayColumn
            key={day.date.toString()}
            dateFormat={dateFormat}
            day={day}
            events={parsedEvents}
            onCellClick={onCellClick}
            onEventClick={onEventClick}
          />
        ))}
      </section>
    </div>
  );
}
