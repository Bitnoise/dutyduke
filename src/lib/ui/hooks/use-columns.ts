/**
 * Hook that returns a subset of columns based on the provided keys.
 * @param {Record<string, unknown>} columns - The columns to filter.
 * @param {(keyof T)[]} keys - The keys to filter the columns by.
 * @returns {T} The filtered columns.
 */
export function useColumns<T extends Record<string, unknown>>(columns: T, keys: (keyof T)[]): T {
  return keys.reduce((acc, key) => {
    if (key in columns) {
      acc[key] = columns[key];
    }

    return acc;
  }, {} as T);
}
