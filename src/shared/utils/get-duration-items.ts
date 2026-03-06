import { type Item } from '@/lib/ui/components/combo-box/types';

export const getDurationItems = (
  hourLabel = 'h',
  minuteLabel = 'm',
  totalMinutes = 480,
  jump = 15,
): Item[] => {
  const items: Item[] = [];

  for (let i = 0; i <= totalMinutes; i += jump) {
    if (!i) continue;

    const hours = i / 60;
    const mins = i % 60;

    let label = '';

    label =
      `${hours >= 1 ? Math.floor(hours) : 0}${hourLabel}` + ':' + `${mins}`.padStart(2, '0') + minuteLabel;

    items.push({ key: i, label });
  }

  return items;
};
