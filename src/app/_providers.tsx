import { type PropsWithChildren } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'jotai';
import { getMessages } from 'next-intl/server';

export async function Providers({ children }: PropsWithChildren) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Provider>{children}</Provider>
    </NextIntlClientProvider>
  );
}
