'use client';

import { usePathname } from 'next/navigation';
import { PAGE_HEADERS } from '@/shared';

export function useDynamicHeader(): string {
  const currentUrl = usePathname(); // Get the current URL path directly
  const headerKey = currentUrl.split('/').pop();

  return PAGE_HEADERS[headerKey as keyof typeof PAGE_HEADERS];
}
