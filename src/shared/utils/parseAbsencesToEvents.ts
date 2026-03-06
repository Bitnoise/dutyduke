import dayjs, { extend } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { type Event } from '@/lib/ui/components/week-view-calendar/types';

extend(utc);

export const parseAbsencesToEvents = (absences: AbsenceDTO[]): Event[] => {
  const events: Event[] = [];

  for (const absence of absences) {
    const { startDate, endDate, id, issuerId, requestedAt, days } = absence;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const dayCount = end.diff(start, 'day') + 1;

    for (let i = 0; i < dayCount; i++) {
      const date = start.add(i, 'day');
      const type = absence.type === 'GLOBAL' ? 'globalAbsence' : 'employeeAbsence';

      events.push({
        id: `${id}-${i}`,
        title: type === 'globalAbsence' ? 'companyOff' : days < 1 ? 'halfDayOff' : 'dayOff',
        startDate: dayjs.utc(date).startOf('day').toISOString(),
        endDate: dayjs.utc(date).endOf('day').toISOString(),
        employee: type === 'employeeAbsence' ? [issuerId] : [],
        createdAt: dayjs.utc(requestedAt).toDate(),
        backgroundColor: '#B5BFC9',
        type,
      });
    }
  }

  return events;
};
