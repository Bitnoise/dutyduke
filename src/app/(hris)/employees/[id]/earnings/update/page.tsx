import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES, type IdParams, type PageParams } from '@/shared';
import { hrisApi } from '@/api/hris';
import {
  getPermissionChecker,
  ResourceType,
  PermissionAction,
  PermissionScope,
} from '@/api/hris/authorization';
import { UpdateEarningsForm } from '../_forms';

export default async function EarningsModal(props: PageParams<IdParams>) {
  const params = await props.params;
  const t = await getTranslations();
  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  // Check if user can create earnings
  const canCreate = permissionChecker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.CREATE);
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEE_EARNINGS);

  if (!canCreate) {
    redirect(HRIS_ROUTES.employees.earnings.base(params.id));
  }

  // If scope is SELF, verify this is the current user's employee record
  if (scope === PermissionScope.SELF && me.id !== params.id) {
    redirect(HRIS_ROUTES.employees.earnings.base(params.id));
  }

  return (
    <div className="flex-1 rounded-lg bg-white px-4 pb-20 pt-10 shadow-xl">
      <h4 className="text-xl font-semibold">{t('earnings.update')}</h4>
      <UpdateEarningsForm dateFormat={me.dateFormat} employeeId={params.id} />
    </div>
  );
}
