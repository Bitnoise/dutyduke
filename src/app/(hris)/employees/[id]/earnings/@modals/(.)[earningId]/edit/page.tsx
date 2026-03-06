import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES, type IdParams, type PageParams } from '@/shared';
import { hrisApi } from '@/api/hris';
import { redirect } from '@/shared/utils/redirect';
import {
  getPermissionChecker,
  ResourceType,
  PermissionAction,
  PermissionScope,
} from '@/api/hris/authorization';
import { EditEarningsForm } from '../../../_forms';

export default async function EarningsModal({ params }: PageParams<IdParams>) {
  const { id, earningId } = await params;
  if (!earningId || !id) {
    return await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  const t = await getTranslations();
  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  // Check if user can edit earnings
  const canEdit = permissionChecker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.EDIT);
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEE_EARNINGS);

  if (!canEdit) {
    await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  // If scope is SELF, verify this is the current user's employee record
  if (scope === PermissionScope.SELF && me.id !== id) {
    await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  const earning = await api.employees.getEmployeeEarningsById(id, earningId);

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.edit')} />
      <EditEarningsForm dateFormat={me.dateFormat} earning={earning} employeeId={id} />
    </Modal>
  );
}
