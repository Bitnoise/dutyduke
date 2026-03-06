export function truncate(stringToTruncate: string, maxLength?: number) {
  const truncateParameter = maxLength ? maxLength : 30;
  return stringToTruncate && stringToTruncate.length > truncateParameter
    ? `${stringToTruncate.substring(0, truncateParameter)}...`
    : stringToTruncate;
}
