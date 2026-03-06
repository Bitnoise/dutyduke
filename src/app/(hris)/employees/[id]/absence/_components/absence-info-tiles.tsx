import dayjs from 'dayjs';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { Tile } from '@/lib/ui/components/tile';
import { type CUID } from '@/api/hris/types';
import { getBusinessDaysDiff } from '@/shared/utils/get-business-days-diff';
import { isDateInRange } from '@/shared/utils/is-date-in-range';

type Props = {
  employeeId: CUID;
};

export async function AbsenceInfoTiles({ employeeId }: Props) {
  const t = await getTranslations('absences');
  const today = dayjs();
  const startOfMonth = dayjs(`${today.year()}-${today.month() + 1}-01`);
  const endOfMonth = dayjs(`${today.year()}-${today.month() + 1}-${startOfMonth.daysInMonth()}`);

  const api = hrisApi;

  const [
    employee,
    currentMonthTakenDays,
    totalHolidaysTaken,
    totalSickLeaveTaken,
    totalPersonalLeaveTaken,
    daysOff,
  ] = await Promise.all([
    api.employees.getEmployeeById(employeeId),
    api.absences.getAllIssuerAbsenceDaysCount(
      employeeId,
      startOfMonth.toDate(),
      endOfMonth.toDate(),
      undefined,
      true,
    ),
    api.absences.getAllIssuerAbsenceDaysCount(
      employeeId,
      new Date(`${today.year()}-01-01`),
      new Date(`${today.year()}-12-31`),
      'HOLIDAY',
      true,
    ),
    api.absences.getAllIssuerAbsenceDaysCount(
      employeeId,
      new Date(`${today.year()}-01-01`),
      new Date(`${today.year()}-12-31`),
      'SICK',
    ),
    api.absences.getAllIssuerAbsenceDaysCount(
      employeeId,
      new Date(`${today.year()}-01-01`),
      new Date(`${today.year()}-12-31`),
      'PERSONAL',
    ),
    api.absences.getAllAbsences(
      1,
      new Date(`${today.year()}-01-01`),
      new Date(`${today.year()}-12-31`),
      ['APPROVED'],
      ['GLOBAL'],
      undefined,
      'all',
    ),
  ]);

  const employeeJoinDate = employee.joinDate ? dayjs(employee.joinDate) : null;

  const employeeNextYear = employeeJoinDate
    ? dayjs(`${employeeJoinDate.year() + 1}-${employeeJoinDate.month() + 1}-${employeeJoinDate.day()}`)
    : null;

  const isFirstYear = (employeeNextYear?.diff(employeeJoinDate, 'month') ?? 0) < 12;

  const holidays = isFirstYear && employee.firstYearHoliday ? employee.firstYearHoliday : employee.holiday;

  const daysOffCount = daysOff.items.reduce((acc, curr) => {
    const rangeStart = dayjs(curr.startDate);
    const rangeEnd = dayjs(curr.endDate);

    if (!isDateInRange(today, rangeStart, rangeEnd, 'month')) return acc;

    const startDate = rangeStart.isBefore(startOfMonth) ? startOfMonth : rangeStart;
    const endDate = rangeEnd.isAfter(endOfMonth) ? endOfMonth : rangeEnd;

    return acc + getBusinessDaysDiff(startDate, endDate, curr.halfStart, curr.halfEnd);
  }, 0);

  const currentMonthBusinessDays = getBusinessDaysDiff(startOfMonth, endOfMonth) - daysOffCount;

  const currentMonthAvailability = currentMonthBusinessDays - currentMonthTakenDays;

  return (
    <div className="grid grid-cols-2 gap-4 xl:flex">
      <Tile label={t('availabilityThisMonth')}>
        <div className="text-lg font-semibold">
          <span className="text-accent">{currentMonthAvailability}</span> / {currentMonthBusinessDays}
        </div>
      </Tile>
      <Tile className="xl:ml-auto" label={t('usedLeaveDays')}>
        <div className="text-lg font-semibold">
          <span className="text-accent">{totalHolidaysTaken}</span> / {holidays ?? '-'}
        </div>
      </Tile>
      <Tile label={t('sickAbsences')}>
        <div className="text-lg font-semibold text-accent">{totalSickLeaveTaken}</div>
      </Tile>
      <Tile label={t('personalLeave')}>
        <div className="text-lg font-semibold text-accent">{totalPersonalLeaveTaken}</div>
      </Tile>
    </div>
  );
}
