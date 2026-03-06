import { Inter } from 'next/font/google';
import { getLocale, getTranslations } from 'next-intl/server';
import { Providers } from '@/app/_providers';
import { cn } from '@/shared';
import { ClientTooltip } from '@/lib/ui/components/client-tooltip';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const theme = process.env.NEXT_PUBLIC_THEME;

  return (
    <html lang={locale}>
      <body
        className={cn(
          inter.className,
          'text-black bg-background md:bg-white tracking-[0.0625em] antialiased',
          theme || 'hris',
        )}
      >
        <Providers>{children}</Providers>
        <ClientTooltip />
      </body>
    </html>
  );
}
