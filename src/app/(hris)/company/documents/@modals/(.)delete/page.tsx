import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { getPermissionChecker, ResourceType, PermissionAction } from '@/api/hris/authorization';
import { DeleteDocumentsForm } from '../../_forms';

type Props = {
  searchParams: Promise<{
    documents: string;
    category?: string;
    filter?: string;
    status?: string;
  }>;
};

export default async function DeleteDocuments({ searchParams }: Props) {
  const { documents, category, filter, status } = await searchParams;
  const permissionChecker = await getPermissionChecker();

  if (!permissionChecker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.DELETE)) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  const t = await getTranslations();

  if (!documents) redirect(HRIS_ROUTES.documents.base);
  const parsedDocumentIds = documents === 'all' ? documents : documents.split(',');

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.deleteDocuments', { count: parsedDocumentIds.length })} />
      <p className="py-4 text-sm">
        {t('modal.content.deleteDocuments', { count: parsedDocumentIds.length })}
      </p>
      {status?.split(',').includes('ARCHIVED') && (
        <p className="pb-4 text-xs italic text-gray-400">
          {t('company.documents.editModal.archivedOmitted')}
        </p>
      )}
      <DeleteDocumentsForm
        assignmentFilter={filter}
        documentIds={parsedDocumentIds}
        filterCategory={category}
        filterStatus={status}
      />
    </Modal>
  );
}
