import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ChangePasswordForm } from '@/app/(auth)/forgot-password/[token]/_forms';
import { AUTH_ROUTES } from '@/shared';

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ChangePasswordPage(props: Props) {
  const { token } = await props.params;
  const t = await getTranslations('resetPassword');

  if (!token) return redirect(AUTH_ROUTES.forgotPassword);

  return (
    <>
      <h1 className="pb-8 text-center text-4xl font-bold">{t('title')}</h1>
      <ChangePasswordForm token={token} />
    </>
  );
}
