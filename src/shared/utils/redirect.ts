import { redirect as nextRedirect } from 'next/navigation';
import { headers } from 'next/headers';

const RETURN_URL_QUERY_PARAM = 'returnUrl';

export async function redirect(path: string) {
  const redirectUrl = await getRedirectUrl(path);

  return nextRedirect(redirectUrl.toString());
}

export async function getUnauthenticatedRedirectUrl(path: string): Promise<URL> {
  const headersList = await headers();
  const referer = headersList.get('referer');
  const returnUrl = referer ? new URL(referer).pathname : '';

  return await getRedirectUrl(`${path}?${RETURN_URL_QUERY_PARAM}=${encodeURIComponent(returnUrl)}`);
}

export async function getRedirectUrl(path: string): Promise<URL> {
  const headersList = await headers();
  const host = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, '')
    : (headersList.get('Host') as string);

  const proto = <string>headersList.get('X-Forwarded-Proto') || 'http';
  const url = `${proto}://${host}`;

  return new URL(path, url);
}

export async function getAuthenticatedRedirectReturnTo(): Promise<string> {
  const headersList = await headers();
  const referer = headersList.get('referer');
  return referer ? (new URL(referer).searchParams.get(RETURN_URL_QUERY_PARAM) ?? '') : '';
}
