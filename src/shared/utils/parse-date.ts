import dayjs from 'dayjs';

export const DEFAULT_DATE_PATTERN = 'DD/MM/YYYY';

export function parseDate(
  date: dayjs.Dayjs | Date | string | null | undefined,
  dateFormat: string = DEFAULT_DATE_PATTERN,
): string {
  if (!date) return '';

  const parsedDate = date instanceof Date || typeof date === 'string' ? dayjs(date) : date;

  return parsedDate.format(dateFormat);
}

export function calculatePeriod(startDate: Date, endDate: Date): string {
  if (startDate > endDate) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();

  let monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
  const daysDiff = endDay - startDay;

  if (daysDiff < 0) {
    monthsDiff--;
  }

  const years = Math.floor(monthsDiff / 12);
  let months = monthsDiff % 12;

  if (years === 0 && months === 0) {
    months = 1;
  }

  let result = '';
  if (years > 0) {
    result += years + ' years';
  } else if (months > 0) {
    result += months + ' months';
  }

  return result;
}
