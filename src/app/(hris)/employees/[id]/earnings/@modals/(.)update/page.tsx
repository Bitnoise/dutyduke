import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES, type IdParams, type PageParams } from '@/shared';
import { redirect } from '@/shared/utils/redirect';
import { hrisApi } from '@/api/hris';
import {
  getPermissionChecker,
  ResourceType,
  PermissionAction,
  PermissionScope,
} from '@/api/hris/authorization';
import { UpdateEarningsForm } from '../../_forms';

export default async function EarningsModal({ params: { id } }: PageParams<IdParams>) {
  const t = await getTranslations();

  if (!id) return await redirect(HRIS_ROUTES.employees.earnings.base(id));

  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  // Check if user can create earnings
  const canCreate = permissionChecker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.CREATE);
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEE_EARNINGS);

  if (!canCreate) {
    await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  // If scope is SELF, verify this is the current user's employee record
  if (scope === PermissionScope.SELF && me.id !== id) {
    await redirect(HRIS_ROUTES.employees.earnings.base(id));
  }

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.update')} />
      <UpdateEarningsForm dateFormat={me.dateFormat} employeeId={id} />
    </Modal>
  );
}
