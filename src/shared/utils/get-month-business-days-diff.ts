import dayjs from 'dayjs';
import { getBusinessDaysDiff } from './get-business-days-diff';

export function getMonthsEdgeDates(month?: number, year?: number) {
  const parsedMonth = month ?? dayjs().month();
  const parsedYear = year ?? dayjs().year();

  const startOfMonth = dayjs().startOf('month').month(parsedMonth).year(parsedYear);
  const endOfMonth = dayjs().endOf('month').month(parsedMonth).year(parsedYear);

  return [startOfMonth, endOfMonth];
}

export function getMonthBusinessDays(month: number, halfStart?: boolean, halfEnd?: boolean, year?: number) {
  const [startOfMonth, endOfMonth] = getMonthsEdgeDates(month, year);

  return getBusinessDaysDiff(startOfMonth, endOfMonth, halfStart, halfEnd);
}
