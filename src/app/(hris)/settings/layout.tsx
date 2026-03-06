import { type PropsWithChildren } from 'react';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { SettingsTabs } from '@/lib/ui';
import { getPermissionChecker } from '@/api/hris/authorization';

export default async function SettingsLayout({ children }: PropsWithChildren): Promise<JSX.Element> {
  const t = await getTranslations('navigation');
  const permissionChecker = await getPermissionChecker();

  // Serialize permissions for client component
  const permissions = permissionChecker.serialize();

  return (
    <div className="min-h-full flex-1 rounded-lg bg-white px-4 pb-20 pt-2 md:p-6">
      <BasicHeader>{t('settings')}</BasicHeader>
      <SettingsTabs permissions={permissions} />
      <section className="pt-2 md:pt-8">{children}</section>
    </div>
  );
}
