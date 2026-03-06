'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { AUTH_ROUTES } from '@/shared';
import { ErrorLayout } from '@/lib/ui';

export default function Error() {
  const t = useTranslations();

  return (
    <ErrorLayout
      goBackLink={AUTH_ROUTES.signIn}
      heading={t('errorMessages.resetPassword.somethingWentWrong')}
      message={t('errorMessages.resetPassword.unknown')}
    />
  );
}
