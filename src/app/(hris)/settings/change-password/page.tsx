import { ChangePasswordForm } from '@/app/(hris)/settings/change-password/_forms';

export default async function SettingsChangePasswordPage(): Promise<JSX.Element> {
  return (
    <div className="flex flex-col gap-y-8">
      <ChangePasswordForm />
    </div>
  );
}
