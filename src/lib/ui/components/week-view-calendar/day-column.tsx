import dayjs from 'dayjs';
import { isDateInRange } from '@/shared/utils/is-date-in-range';
import { cn } from '@/shared';
import { prepareDayColumnData } from '@/lib/ui/components/week-view-calendar/sort-day-column';
import { SelectedTile } from '@/lib/ui/components/week-view-calendar/selected-tile';
import { type ParsedEvent, type Day, type Cell as CellType } from './types';
import { Cell } from './cell';
import { EventTile } from './event-tile';

type Props = {
  events: ParsedEvent[];
  day: Day;
  onCellClick?: (cell: CellType) => void;
  onEventClick?: (event: ParsedEvent) => void;
  dateFormat: string;
};

export function DayColumn({ day, events, dateFormat, onCellClick, onEventClick }: Props) {
  const date = dayjs(day.date);
  const eventsWithinDay = [...events].filter((event) => isDateInRange(date, event.startDate, event.endDate));

  const eventsWithAbsences = eventsWithinDay.some((event) => event.type === 'globalAbsence')
    ? eventsWithinDay.filter((event) => event.type === 'globalAbsence')
    : eventsWithinDay;

  const eventTileData = prepareDayColumnData(eventsWithAbsences, date);

  return (
    <div
      key={day.date.toString()}
      className={cn('relative', {
        'bg-super-light-blue': date.isSame(dayjs(), 'd'),
      })}
    >
      {day.cells.map((cell, cellIndex) => (
        <Cell
          key={cell.date.toString()}
          cell={cell}
          isLastInColumn={cellIndex === day.cells.length - 1}
          onCellClick={onCellClick}
        />
      ))}
      {eventTileData.map((tile) => {
        return <EventTile key={tile.event.id} data={tile} onEventClick={onEventClick} />;
      })}
      <SelectedTile dateFormat={dateFormat} day={day} />
    </div>
  );
}
