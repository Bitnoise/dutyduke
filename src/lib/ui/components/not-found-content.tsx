'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'use-intl';
import { HRIS_ROUTES } from '@/shared';
import { NotFound } from './not-found';
import { DutyDukeLogo } from './dutyduke-logo';
import { Button } from '.';

export function NotFoundContent() {
  const router = useRouter();
  const t = useTranslations('notFound');

  return (
    <div className="flex size-full h-screen flex-1 items-center justify-center bg-white md:bg-background">
      <section className="rounded-lg bg-white p-12 md:shadow-md">
        <div className="flex flex-col gap-12">
          <div className="h-[5.25rem] w-full">
            <DutyDukeLogo />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-8 md:w-[23rem]">
            <NotFound className="max-h-32 w-full" />
            <div className="flex flex-col items-center justify-center">
              <h3 className="whitespace-nowrap text-2xl font-semibold">{t('heading')}</h3>
              <p className="whitespace-nowrap pb-6 font-semibold">{t('title')}</p>
              <p className="whitespace-nowrap font-semibold">{t('subtitle')}</p>
            </div>
            <div className="w-full py-6">
              <Button className="w-full" onClick={() => router.push(HRIS_ROUTES.dashboard)}>
                {t('button')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
