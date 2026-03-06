import { type OpUnitType, type Dayjs } from 'dayjs';

export const isDateInRange = (date: Dayjs, startDate: Dayjs, endDate: Dayjs, unit: OpUnitType = 'day') => {
  return (
    date.isSame(startDate, unit) ||
    date.isSame(endDate, unit) ||
    (date.isAfter(startDate, unit) && date.isBefore(endDate, unit))
  );
};
