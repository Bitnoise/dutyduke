import type { EventTileData, ParsedEvent } from '@/lib/ui/components/week-view-calendar/types';
import { HOUR_HEIGHT } from '@/lib/ui/components/week-view-calendar/constants';
import type dayjs from 'dayjs';

/**
 * Sorts work orders in single day to optimize display in calendar.
 * Then prepares event tile data needed for display like position, width and height
 *
 * @param workOrders - List of work orders to sort.
 * @param currentDate - date for which work orders are being sorted.
 * @returns sorted workOrders.
 */
export function prepareDayColumnData(workOrders: ParsedEvent[], currentDate: dayjs.Dayjs): EventTileData[] {
  const sortedByColumns = sortByColumns(workOrders);
  const eventTiles = mapColumnsToEventTiles(sortedByColumns, currentDate);
  return widenEventTiles(eventTiles);
}

/**
The idea is to separate all events by as little columns inside a single day as possible
 1. Sorts events by startDate
 2. Creates empty column
 3. Takes the earliest event that was not added to any column, and adds to newly created column
 4. Searches for all non-conflicting events that are candidates for this column
 5. Takes the earliest from non-conflicting and repeats steps 4-5 until there are no more candidates for the column
 6. Starts next empty column and repeats 3-5 until all events are assigned to columns
 */
function sortByColumns(events: ParsedEvent[]): ParsedEvent[][] {
  const sortedByColumns: ParsedEvent[][] = [];
  let sortedByStartDate = events.sort((eventA, eventB) =>
    eventA.startDate.isSame(eventB.startDate) ? 0 : eventA.startDate.isBefore(eventB.startDate) ? -1 : 1,
  );

  const removeFromSortedByStartDate = (id: string) => {
    const index = sortedByStartDate.findIndex((event) => event.id === id);
    sortedByStartDate = [...sortedByStartDate.slice(0, index), ...sortedByStartDate.slice(index + 1)];
  };

  for (let i = 0; sortedByStartDate.length > 0; i++) {
    let candidates = [...sortedByStartDate];
    sortedByColumns[i] = [];
    while (candidates.length > 0) {
      const event = candidates[0];
      removeFromSortedByStartDate(event.id);
      sortedByColumns[i].push(event);
      candidates = candidates.filter(
        ({ startDate, endDate }) =>
          event.startDate.isSameOrAfter(endDate) || event.endDate.isSameOrBefore(startDate),
      );
    }
  }
  return sortedByColumns;
}

/**
 * Columns are flattened to a single array of event tiles.
 * Order number of column that event is in, means how far from the left event should be.
 * Total number of columns determines how wide the event tiles can be to not collide with each other.
 */
function mapColumnsToEventTiles(sortedByColumns: ParsedEvent[][], currentDate: dayjs.Dayjs) {
  const mapped: EventTileData[] = [];
  const columnsTotal = sortedByColumns.length;
  for (let column = 0; column < columnsTotal; column++) {
    for (let i = 0; i < sortedByColumns[column].length; i++) {
      mapped.push(mapToEventTile(sortedByColumns[column][i], column, columnsTotal, currentDate));
    }
  }
  return mapped;
}

function mapToEventTile(
  event: ParsedEvent,
  column: number,
  columnsTotal: number,
  currentDate: dayjs.Dayjs,
): EventTileData {
  const scale = HOUR_HEIGHT / 60;
  const height = event.endDate.diff(event.startDate, 'm') * scale;
  const top = event.startDate.diff(currentDate, 'm') * scale;
  const width = 100 / columnsTotal;
  const left = column * width;
  return {
    event,
    top,
    left,
    height,
    width,
  };
}

/**
 * All events were assigned to columns and all of them had the width of single column.
 * If there were 4 columns in total then each event tile is 25% wide.
 * But some events might be in column 1 with no collision, or event colliding is far right.
 * Those events can take all space until the nearest right event.
 */
function widenEventTiles(eventTiles: EventTileData[]): EventTileData[] {
  return eventTiles.map((eventTileToWiden) => {
    const {
      left,
      event: { startDate, endDate },
    } = eventTileToWiden;
    const overlappingEventTilesFromRight = eventTiles.filter(
      (eventTile) =>
        eventTile.left > left &&
        eventTile.event.startDate.isBefore(endDate) &&
        eventTile.event.endDate.isAfter(startDate),
    );
    const minLeft = overlappingEventTilesFromRight
      .map((eventTile) => eventTile.left)
      .reduce((acc, curr) => Math.min(acc, curr), 100);
    const newWidth = minLeft - left;
    return {
      ...eventTileToWiden,
      width: newWidth,
    };
  });
}
