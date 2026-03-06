import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES, type IdParams, type PageParams } from '@/shared';
import { hrisApi } from '@/api/hris';
import { redirect } from '@/shared/utils/redirect';
import {
  getPermissionChecker,
  ResourceType,
  PermissionAction,
  PermissionScope,
} from '@/api/hris/authorization';
import { EditEarningsForm } from '../../_forms';

export default async function EditEarningsModal({ params: { id, earningId } }: PageParams<IdParams>) {
  const t = await getTranslations();

  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  if (!earningId || !id) return await redirect(HRIS_ROUTES.employees.earnings.base(id));

  // Check if user can edit earnings
  const canEdit = permissionChecker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.EDIT);
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEE_EARNINGS);

  if (!canEdit) {
    return await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  // If scope is SELF, verify this is the current user's employee record
  if (scope === PermissionScope.SELF && me.id !== id) {
    return await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  const earning = await api.employees.getEmployeeEarningsById(id, earningId);

  return (
    <div className="flex-1 rounded-lg bg-white px-4 pb-20 pt-10 shadow-xl">
      <h4 className="text-xl font-semibold">{t('earnings.edit')}</h4>
      <EditEarningsForm dateFormat={me.dateFormat} earning={earning} employeeId={id} />
    </div>
  );
}
