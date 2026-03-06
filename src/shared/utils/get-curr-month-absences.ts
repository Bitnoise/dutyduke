import dayjs from 'dayjs';
import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { type AbsenceType } from '../../../.prisma-generated/organization-client';
import { isInMonthsRange } from './get-employee-availability';

export function getCurrMonthAbsences(absences: AbsenceDTO[], absenceTypes: AbsenceType[], monthNum: number) {
  return absences.filter(
    ({ startDate, endDate, type }) =>
      isInMonthsRange(monthNum, dayjs(startDate)) &&
      isInMonthsRange(monthNum, dayjs(endDate)) &&
      absenceTypes.includes(type),
  );
}
