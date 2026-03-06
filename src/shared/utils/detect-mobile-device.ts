'use server';

import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export const detectMobileDevice = async () => {
  const headersList = await headers();
  const ua = headersList.get('user-agent');
  const device = new UAParser(ua || '').getDevice();
  return device.type === 'mobile';
};
