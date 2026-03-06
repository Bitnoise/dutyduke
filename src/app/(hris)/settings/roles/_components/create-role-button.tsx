'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/lib/ui/components/button';
import { HRIS_ROUTES } from '@/shared';

export function CreateRoleButton(): JSX.Element {
  const router = useRouter();
  const t = useTranslations('settings.roles');

  return (
    <Button
      intent="primary"
      onClick={() => {
        router.push(`${HRIS_ROUTES.settings.roles}/create`);
      }}
    >
      {t('createRole')}
    </Button>
  );
}
