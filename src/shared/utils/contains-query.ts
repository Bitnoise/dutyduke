/**
 * Searches through an object to check if any value matches a given query string.
 *
 * @param obj - The object to search within.
 * @param query - The query string to search for within the values of the object.
 * @returns `true` if the query is found in any value, otherwise `false`.
 */
export function containsQuery<T extends object>(obj: T, query: string) {
  const parsedQuery = query.toLowerCase().trim();

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (typeof value === 'undefined' || value === null) continue;

    if (typeof value === 'string' && value.toLowerCase().includes(parsedQuery)) return true;
    else if (typeof value === 'number' && value.toString().toLowerCase().includes(parsedQuery)) return true;
    else if (typeof value === 'object') {
      if (containsQuery(value, query)) {
        return true;
      }
    }
  }

  return false;
}
