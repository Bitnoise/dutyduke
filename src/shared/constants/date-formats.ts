export const DATE_FORMATS = {
  DD_MM_YYYY: { key: 'DD_MM_YYYY', label: 'DD/MM/YYYY', pattern: 'DD/MM/YYYY', example: '28/01/2026' },
  MM_DD_YYYY: { key: 'MM_DD_YYYY', label: 'MM/DD/YYYY', pattern: 'MM/DD/YYYY', example: '01/28/2026' },
  YYYY_MM_DD: { key: 'YYYY_MM_DD', label: 'YYYY-MM-DD', pattern: 'YYYY-MM-DD', example: '2026-01-28' },
  DD_MM_YYYY_DOT: {
    key: 'DD_MM_YYYY_DOT',
    label: 'DD.MM.YYYY',
    pattern: 'DD.MM.YYYY',
    example: '28.01.2026',
  },
} as const;

export type DateFormatKey = keyof typeof DATE_FORMATS;

export const DATE_FORMAT_ITEMS = Object.values(DATE_FORMATS);

export const DATE_FORMAT_KEYS = Object.keys(DATE_FORMATS) as DateFormatKey[];

export const DEFAULT_DATE_FORMAT: DateFormatKey = 'DD_MM_YYYY';

export const getDateFormatPattern = (key: DateFormatKey): string => DATE_FORMATS[key].pattern;

export const getDateFormatLabel = (key: DateFormatKey): string => DATE_FORMATS[key].label;

export const getDateFormatItem = (key: DateFormatKey) => DATE_FORMATS[key];
