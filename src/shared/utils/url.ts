/**
 * Get the base application URL from environment variable
 */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Construct a full URL with the given path
 * @param path - Optional path to append to base URL (e.g., '/dashboard', '/sign-in')
 * @returns Full URL string
 */
export function getFullUrl(path: string = ''): string {
  const base = getAppUrl();

  // Ensure path starts with / if provided
  if (path && !path.startsWith('/')) {
    path = `/${path}`;
  }

  return `${base}${path}`;
}
