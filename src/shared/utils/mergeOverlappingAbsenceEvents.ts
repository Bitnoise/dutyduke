import dayjs from 'dayjs';
import { type Event } from '@/lib/ui/components/week-view-calendar/types';

export const mergeOverlappingAbsenceEvents = (events: Event[]): Event[] => {
  const grouped: Record<string, Event> = {};

  for (const event of events) {
    if (event.type !== 'employeeAbsence') continue;

    const dateKey = dayjs(event.startDate).format('YYYY-MM-DD');

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        ...event,
        employee: [...event.employee],
      };
    } else {
      grouped[dateKey].employee = Array.from(new Set([...grouped[dateKey].employee, ...event.employee]));
    }
  }

  return Object.values(grouped);
};
