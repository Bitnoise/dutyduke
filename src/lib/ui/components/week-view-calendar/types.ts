import { type Prettify, type CUID } from '@/shared';
import type dayjs from 'dayjs';

export type Cell = {
  date: Date;
  hour: string;
  minute: string;
  hourAndMinute: string;
  disabled: boolean;
};

export type Day = {
  date: Date;
  isToday: boolean;
  name: string;
  shortName: string;
  dayOfMonth: string;
  dayOfMonthWithZero: string;
  dayOfMonthWithSuffix: string;
  disabled: boolean;
  cells: Cell[];
};

export type Event = {
  id: CUID;
  title: string;
  startDate: string;
  endDate: string;
  employee: string[];
  createdAt: Date;
  backgroundColor: string;
  type: 'globalAbsence' | 'employeeAbsence';
};

export type ParsedEvent = Prettify<
  Omit<Event, 'startDate' | 'endDate' | 'createdAt'> & {
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    createdAt: dayjs.Dayjs;
  }
>;

export type EventTileData = {
  event: ParsedEvent;
  top: number; // INFO: how many pixels from the top
  height: number; // INFO: how many pixels in height
  left: number; // INFO: percentage value
  width: number; // INFO: percentage value
};

export type WeekViewCalendarProps = {
  events: Event[];
  absenceEvents: Event[];
  selectedDate?: string;
  initialDate?: Date;
  minuteStep?: number;
  onCellClick?: (cell: Cell) => void;
  onEventClick?: (event: ParsedEvent) => void;
  locale: string;
  dateFormat: string;
};
