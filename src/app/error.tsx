'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'use-intl';
import { HRIS_ROUTES } from '@/shared';
import { Button, Icon } from '@/lib/ui';
import { DutyDukeLogo } from '@/lib/ui/components/dutyduke-logo';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const router = useRouter();
  const t = useTranslations('somethingWentWrong');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex size-full h-screen flex-1 items-center justify-center bg-white md:bg-background">
      <section className="rounded-lg bg-white p-12 md:shadow-md">
        <div className="flex flex-col gap-12">
          <div className="h-[5.25rem] w-full">
            <DutyDukeLogo />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-8 md:w-[23rem]">
            <Icon className="text-warning" name="warning-full" size="2xl" />
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-semibold">{t('heading')}</h3>
              <p className="pb-6 font-semibold">{t('title')}</p>
              <p className="font-semibold">{t('subtitle')}</p>
            </div>
            <div className="flex w-full flex-col gap-3 py-6">
              <Button className="w-full" onClick={reset}>
                {t('tryAgain')}
              </Button>
              <Button className="w-full" intent="tertiary" onClick={() => router.push(HRIS_ROUTES.dashboard)}>
                {t('goHome')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
