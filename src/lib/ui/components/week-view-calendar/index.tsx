'use client';

import { type PropsWithClassName } from '@/shared';
import { useDateLocale } from '../../hooks/use-date-locale';
import { type WeekViewCalendarProps } from './types';
import { WeekView } from './week-view';

export function WeekViewCalendar({
  events,
  initialDate = new Date(),
  minuteStep = 60,
  onCellClick,
  onEventClick,
  absenceEvents,
  className,
  locale,
  dateFormat,
}: PropsWithClassName<WeekViewCalendarProps>) {
  const dateLocale = useDateLocale(locale);

  return (
    <WeekView
      absenceEvents={absenceEvents}
      className={className}
      dateFormat={dateFormat}
      dateLocale={dateLocale}
      events={events}
      initialDate={initialDate}
      minuteStep={minuteStep}
      onCellClick={onCellClick}
      onEventClick={onEventClick}
    />
  );
}
