import dayjs, { type Dayjs } from 'dayjs';

const DATE_STRING_LENGTH_WITHOUT_TIME = 10;

export function getDateIgnoringTime(date: string): Dayjs {
  return dayjs(date.slice(0, DATE_STRING_LENGTH_WITHOUT_TIME));
}
