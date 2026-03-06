import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn } from '@/shared';
import { type EventTileData, type ParsedEvent } from './types';

export function EventTile({
  data,
  onEventClick,
}: {
  data: EventTileData;
  onEventClick?: (event: ParsedEvent) => void;
}) {
  const t = useTranslations('weekCalendar');

  const { event, top, left, width, height } = data;

  const Tag = onEventClick ? 'button' : 'div';

  return (
    <Tag
      key={event.id}
      className={cn(
        'border text-left border-white flex flex-col absolute top-0 pt-1 text-white px-1 rounded-lg',
        {
          'pointer-events-none': !onEventClick,
          'justify-center pt-0': height <= 45,
        },
      )}
      style={{
        backgroundColor: `${event.backgroundColor}4D`,
        height,
        top,
        width: width + '%',
        left: left + '%',
        border: `1px dashed #7A8D9F`,
      }}
      title={`${event.startDate.format('HH:mm')} - ${event.endDate.format('HH:mm')} | ${event.title} | ${event.employee.join(', ')}`}
      onClick={() => onEventClick?.(event)}
    >
      <span className="truncate text-xxs font-semibold text-gray-500">{t(event.title)}</span>
      {height >= 45 &&
        event.employee.map((name) => (
          <span key={name} className="block truncate pt-1 text-xxs text-gray-500">
            {name}
          </span>
        ))}
    </Tag>
  );
}
