import { type Dayjs } from 'dayjs';
import { isWeekend } from './is-weekend';

export function getBusinessDaysDiff(
  startDate: Dayjs,
  endDate: Dayjs,
  halfStart: boolean = false,
  halfEnd: boolean = false,
) {
  let diff = 0;

  for (
    let date = startDate;
    date.isBefore(endDate, 'day') || date.isSame(endDate, 'd');
    date = date.add(1, 'day')
  ) {
    if (isWeekend(date.day())) continue;
    diff++;
  }

  if (halfStart) diff -= 0.5;
  if (halfEnd) diff -= 0.5;

  return diff;
}
