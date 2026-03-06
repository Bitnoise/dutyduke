import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES, type CUID, type PageParams } from '@/shared';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { EditEquipmentDocumentForm } from '../../_forms';

export default async function EditEquipmentDocumentPage({
  params: { id, documentId },
}: PageParams<{ id: CUID; documentId: CUID }>) {
  const t = await getTranslations('company.equipment.documents.edit');

  const api = hrisApi;
  const permissionChecker = await getPermissionChecker();

  // Check if user has EDIT permission for COMPANY_DOCUMENTS
  const canEditDocuments = permissionChecker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT);

  if (!canEditDocuments) {
    redirect(HRIS_ROUTES.equipment.documents.base(id));
  }

  const [me, document] = await Promise.all([
    api.auth.getMe(),
    api.resources.getEquipmentDocumentById(documentId),
  ]);

  return (
    <div className="flex-1 rounded-lg bg-white px-4 pb-20 pt-10 shadow-xl">
      <h4 className="pb-10 text-xl font-semibold">{t('header')}</h4>
      <EditEquipmentDocumentForm dateFormat={me.dateFormat} document={document} equipmentId={id} />
    </div>
  );
}
