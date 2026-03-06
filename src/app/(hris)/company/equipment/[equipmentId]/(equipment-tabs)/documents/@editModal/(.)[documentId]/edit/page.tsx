import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES, type CUID, type PageParams } from '@/shared';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { EditEquipmentDocumentForm } from '../../../_forms';

export default async function EditEquipmentDocumentModal({
  params: { equipmentId, documentId },
}: PageParams<{ equipmentId: CUID; documentId: CUID }>) {
  const t = await getTranslations('company.equipment.documents.edit');

  const api = hrisApi;
  const permissionChecker = await getPermissionChecker();

  // Check if user has EDIT permission for COMPANY_DOCUMENTS
  const canEditDocuments = permissionChecker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT);

  if (!canEditDocuments) {
    redirect(HRIS_ROUTES.equipment.documents.base(equipmentId));
  }

  const [me, document] = await Promise.all([
    api.auth.getMe(),
    api.resources.getEquipmentDocumentById(documentId),
  ]);

  return (
    <Modal isOpen>
      <ModalHeader title={t('header')} />
      <EditEquipmentDocumentForm dateFormat={me.dateFormat} document={document} equipmentId={equipmentId} />
    </Modal>
  );
}
