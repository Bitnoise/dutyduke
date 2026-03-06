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
import { DeleteEarningsForm } from '../../_forms';

export default async function DeleteEarningsModal({ params: { id, earningId } }: PageParams<IdParams>) {
  const t = await getTranslations();
  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  if (!earningId || !id) return redirect(HRIS_ROUTES.employees.earnings.base(id));

  // Check if user can delete earnings
  const canDelete = permissionChecker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.DELETE);
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEE_EARNINGS);

  if (!canDelete) {
    return redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  // If scope is SELF, verify this is the current user's employee record
  if (scope === PermissionScope.SELF && me.id !== id) {
    return redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  return (
    <div className="flex-1 rounded-lg bg-white px-4 pb-20 pt-10 shadow-xl">
      <div>
        <h4 className="text-xl font-semibold">{t('earnings.delete')}</h4>
      </div>
      <DeleteEarningsForm employeeId={id} id={earningId} />
    </div>
  );
}
