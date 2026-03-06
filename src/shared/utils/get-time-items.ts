import { type Item } from '@/lib/ui/components/combo-box/types';

export const getTimeItems = (startHour = 0, endHour = 23, jump = 15): Item[] => {
  const items: Item[] = [];

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += jump) {
      const hour = String(h).padStart(2, '0');
      const minute = String(m).padStart(2, '0');
      const time = `${hour}:${minute}`;
      items.push({ key: time, label: time });
    }
  }

  return items;
};
