import Link from 'next/link';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { AUTH_ROUTES } from '@/shared';
import { LoginForm } from '@/app/(auth)/sign-in/_forms';

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <>
      <h1 className="pb-8 text-center text-4xl font-bold">{t('login.title')}</h1>
      <LoginForm />
      <div className="mt-6 flex w-full items-center justify-end gap-x-6">
        <Link className="text-xs underline sm:text-sm" href={AUTH_ROUTES.forgotPassword}>
          {t('ctaLabels.forgotPassword')}
        </Link>
      </div>
    </>
  );
}
