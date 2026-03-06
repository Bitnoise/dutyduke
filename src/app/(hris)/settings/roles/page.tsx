import { hrisApi } from '@/api/hris';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { RolesTable } from './_components/roles-table';
import { CreateRoleButton } from './_components/create-role-button';

export default async function RolesPage() {
  const t = await getTranslations('settings.roles');
  const api = hrisApi;
  const roles = await api.authorization.roles.getAllRoles();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <CreateRoleButton />
      </div>

      <RolesTable roles={roles} />
    </div>
  );
}
