import dayjs from 'dayjs';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, parseDate, SEARCH_PARAM_KEYS } from '@/shared';
import { useQueryParams } from '@/lib/ui/hooks';
import { type Day } from './types';
import { HOUR_HEIGHT } from './constants';

export function SelectedTile({ day, dateFormat }: { day: Day; dateFormat: string }) {
  const t = useTranslations('weekCalendar');
  const { searchParams } = useQueryParams();
  const date = searchParams.get(SEARCH_PARAM_KEYS.DATE) ?? '';
  const startTime = searchParams.get(SEARCH_PARAM_KEYS.START_TIME) ?? '';
  const duration = +(searchParams.get(SEARCH_PARAM_KEYS.DURATION) || '60');

  const dayStart = dayjs(day.date).set('hour', 0).set('minute', 0);
  if (!date || !startTime || !duration || date !== dayStart.format('YYYY-MM-DD')) return null;

  const startDate = dayjs(`${date}T${startTime}:00`);

  const scale = HOUR_HEIGHT / 60;
  const topOffset = startDate.diff(dayStart, 'm') * scale;

  return (
    <div
      className={cn(
        'absolute z-19 flex size-full flex-col items-center gap-y-1 rounded-lg border-none bg-[#4E927F] text-white justify-center outline-none',
        {
          'gap-y-0': duration === 30,
        },
      )}
      style={{
        height: duration * scale,
        top: topOffset,
        width: '100%',
        left: '0%',
        border: 'none',
      }}
    >
      {duration >= 30 && <span className="text-xxs font-semibold uppercase">{t('selectedDate')}</span>}
      <span className="text-xxs font-semibold uppercase">
        {parseDate(date, dateFormat)} {startTime}
      </span>
    </div>
  );
}
