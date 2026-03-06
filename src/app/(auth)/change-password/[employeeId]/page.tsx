import { getTranslations } from '@/shared/service/locale/get-translations';
import { ChangePasswordForm } from '@/app/(auth)/change-password/[employeeId]/_forms';
import { hrisApi } from '@/api/hris';

export default async function ChangePasswordPage(): Promise<JSX.Element> {
  const t = await getTranslations('changePassword');

  const api = hrisApi;
  const me = await api.auth.getMe();

  return (
    <>
      <h1 className="pb-8 text-center text-4xl font-bold">{t('title')}</h1>
      <ChangePasswordForm email={me.email} />
    </>
  );
}
