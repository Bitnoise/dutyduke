import dayjs from 'dayjs';
import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { isDateInRange } from './is-date-in-range';
import { getMonthsEdgeDates } from './get-month-business-days-diff';
import { getBusinessDaysDiff } from './get-business-days-diff';
import { countTakenDaysOff } from './count-taken-days-off';
import { getCurrMonthAbsences } from './get-curr-month-absences';

export function isInMonthsRange(month: number, date: dayjs.Dayjs) {
  const [startOfMonth, endOfMonth] = getMonthsEdgeDates(month);

  return isDateInRange(date, startOfMonth, endOfMonth);
}

export function countDays(month: number, year: number, acc: number, range: AbsenceDTO) {
  const parsedRangeStartDate = dayjs(range.startDate);
  const parsedRangeEndDate = dayjs(range.endDate);

  const isRangeStartInMonthsRange = isInMonthsRange(month, parsedRangeStartDate);
  const isRangeEndInMonthsRange = isInMonthsRange(month, parsedRangeEndDate);

  if (!isRangeStartInMonthsRange && !isRangeEndInMonthsRange) return acc;

  const [startOfMonth, endOfMonth] = getMonthsEdgeDates(month, year);

  const startDate = isRangeStartInMonthsRange ? parsedRangeStartDate : startOfMonth;
  const endDate = isRangeEndInMonthsRange ? parsedRangeEndDate : endOfMonth;

  return acc + getBusinessDaysDiff(startDate, endDate, range.halfStart, range.halfEnd);
}

/**
 * Calculates the number of available workdays for an employee in a given month,
 * considering their absences.
 *
 * @param {string} yearMonth - The target month in 'YYYY-MM' format.
 * @param {number} businessDays - Total number of business days in the given month.
 * @param {AbsenceDTO[]} employeeAbsences - List of employee absences.
 * @returns {number} - The number of available workdays in the given month after subtracting absences.
 */
export function getEmployeeAvailability(
  yearMonth: string,
  businessDays: number,
  employeeAbsences: AbsenceDTO[],
  globalAbsences: AbsenceDTO[],
  year: number,
): number {
  const month = dayjs(yearMonth).month();

  const globalAbsencesDaysCount = globalAbsences.reduce(
    (acc, absence) => countDays(month, year, acc, absence),
    0,
  );

  const globalInCurrMonth = getCurrMonthAbsences(globalAbsences, ['GLOBAL'], month);

  const employeeAbsencesInCurrMonth = getCurrMonthAbsences(
    employeeAbsences,
    ['HOLIDAY', 'PERSONAL', 'SICK'],
    month,
  );

  const takenDays =
    employeeAbsencesInCurrMonth.reduce((acc, curr) => acc + curr.days, 0) -
    countTakenDaysOff(globalInCurrMonth, employeeAbsencesInCurrMonth);

  const availability = businessDays - globalAbsencesDaysCount - takenDays;

  return Math.max(availability, 0);
}
