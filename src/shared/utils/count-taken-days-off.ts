import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import dayjs from './dayjs-plugins';
import { getBusinessDaysDiff } from './get-business-days-diff';

/**
 * Calculates the total number of business days where employee absences intersect
 * with global absences including halfDays off.
 *
 * @param issuerGlobalAbsences - An array of global absences that affect the employee.
 * @param absences - An array of employee-specific absences (e.g., Personal, Sick Leave, Holiday).
 * @returns The total count of intersecting business days.
 *
 * @example
 * // Global absence: 01.01.2025 - 05.05.2025
 * // Employee absence: 01.01.2025 - 03.01.2025
 * // Returns: 3 (assuming that these were all business days)
 */
export function countTakenDaysOff(issuerGlobalAbsences: AbsenceDTO[], absences: AbsenceDTO[]) {
  return issuerGlobalAbsences.reduce((acc, globalAbsenceCurr) => {
    const interSectingCount = absences.reduce((absenceAcc, absenceCurr) => {
      const absenceStart = dayjs(absenceCurr.startDate);
      const absenceEnd = dayjs(absenceCurr.endDate);
      const globalAbsenceStartDate = dayjs(globalAbsenceCurr.startDate);
      const globalAbsenceEndDate = dayjs(globalAbsenceCurr.endDate);

      const earliestDate = absenceStart.isAfter(globalAbsenceStartDate)
        ? { date: absenceStart, halfStart: absenceCurr.halfStart }
        : { date: globalAbsenceStartDate, halfStart: globalAbsenceCurr.halfStart };

      const latestDate = absenceEnd.isBefore(globalAbsenceEndDate)
        ? { date: absenceEnd, halfEnd: absenceCurr.halfEnd }
        : { date: globalAbsenceEndDate, halfEnd: globalAbsenceCurr.halfEnd };

      if (earliestDate.date.isSameOrBefore(latestDate.date)) {
        const businessDays = getBusinessDaysDiff(
          earliestDate.date,
          latestDate.date,
          earliestDate.halfStart,
          latestDate.halfEnd,
        );
        return absenceAcc + businessDays;
      }

      return absenceAcc;
    }, 0);

    return acc + interSectingCount;
  }, 0);
}
