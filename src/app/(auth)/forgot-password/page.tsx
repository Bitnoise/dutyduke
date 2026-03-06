import { useTranslations } from '@/shared/service/locale/use-translations';
import { ForgotPasswordForm } from './_forms';

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <>
      <h1 className="pb-8 text-center text-4xl font-bold">{t('forgotPassword.title')}</h1>
      <ForgotPasswordForm />
    </>
  );
}
