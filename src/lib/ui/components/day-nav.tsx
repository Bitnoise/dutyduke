'use client';

import dayjs from 'dayjs';
import { useTranslations as useNextTranslations } from 'next-intl';
import { cn } from '@/shared';
import { Icon } from './icon';

type Props = {
  className?: string;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  currentDay: Date;
};

export function DayNav({ goToNextDay, goToPreviousDay, currentDay, className }: Props) {
  const tNext = useNextTranslations('weekCalendar');

  return (
    <nav
      className={cn(
        'flex h-10 items-center justify-center gap-x-2 border-b border-gray-200 bg-super-light-blue',
        className,
      )}
    >
      <button
        aria-label={tNext('goToPrevDay')}
        className="flex size-10 items-center justify-center"
        onClick={goToPreviousDay}
      >
        <Icon name="arrow-left" />
      </button>
      <span className="h-5 basis-[135px] border-x border-black px-4 text-center text-sm font-semibold text-black">
        {dayjs(currentDay).format('ddd DD.MM')}
      </span>
      <button
        aria-label={tNext('goToNextDay')}
        className="flex size-10 items-center justify-center"
        onClick={goToNextDay}
      >
        <Icon name="arrow-right" />
      </button>
    </nav>
  );
}
