import { type CSSProperties } from 'react';
import { type ColumnConfig } from '../types/column';

const FLEX_MIN_WIDTH_MAP: Record<NonNullable<ColumnConfig['flex']>, string> = {
  1: 'min-w-32',
  2: 'min-w-48',
  3: 'min-w-64',
};

export type ColumnLayoutResult = {
  className?: string;
  style?: CSSProperties;
};

/**
 * Computes layout classes and styles for a table column based on its configuration.
 * Uses inline styles for pixel widths (to avoid Tailwind JIT issues) and Tailwind classes for flex.
 */
export function getColumnLayout(column: ColumnConfig | undefined): ColumnLayoutResult {
  if (!column) {
    return {};
  }

  // Explicit width classes take precedence over everything else.
  if (column.widthClassName) {
    return { className: column.widthClassName };
  }

  // Numeric fixed width in pixels - use inline styles for reliability.
  if (typeof column.widthPx === 'number') {
    const width = column.widthPx;
    return {
      style: {
        maxWidth: `${width}px`,
        minWidth: `${width}px`,
        width: `${width}px`,
      },
    };
  }

  // Flex-like relative importance: map to different min-width buckets.
  if (column.flex) {
    const minWidthClass = FLEX_MIN_WIDTH_MAP[column.flex];
    return { className: minWidthClass };
  }

  return {};
}

/**
 * @deprecated Use getColumnLayout instead. This function is kept for backward compatibility.
 */
export function getColumnLayoutClasses(column: ColumnConfig | undefined): string | undefined {
  const result = getColumnLayout(column);
  return result.className;
}
