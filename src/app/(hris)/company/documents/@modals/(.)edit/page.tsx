import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES, type Nullable } from '@/shared';
import { getPermissionChecker, ResourceType, PermissionAction } from '@/api/hris/authorization';
import { hrisApi } from '@/api/hris';
import { type DocumentDto } from '@/api/hris/documents/model/dtos';
import { EditDocumentsForm } from '../../_forms';
import { DEFAULT_CATEGORY_PRIORITY, DOCUMENTS_CATEGORIES_PRIORITY } from '../../_constants';

type Props = {
  searchParams: Promise<{
    documents: string;
    category?: string;
    filter?: string;
    status?: string;
  }>;
};

export default async function EditDocuments({ searchParams }: Props) {
  const { documents, category, filter, status } = await searchParams;
  const permissionChecker = await getPermissionChecker();

  if (!permissionChecker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT)) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  const t = await getTranslations();
  const api = hrisApi;

  if (!documents) redirect(HRIS_ROUTES.documents.base);
  const parsedDocumentIds = documents === 'all' ? documents : documents.split(',');
  let singleDocument: Nullable<DocumentDto> = null;

  if (parsedDocumentIds.length === 1) {
    singleDocument = await api.documents.getDocumentById(parsedDocumentIds[0]);
  }

  const categories = await api.documents.getAllCategories(undefined, undefined, 'all');
  const parsedCategories = [
    ...categories.items
      .map(({ id, name }) => ({ key: id, label: name }))
      .sort(
        (a, b) =>
          (DOCUMENTS_CATEGORIES_PRIORITY[a.label] || DEFAULT_CATEGORY_PRIORITY) -
          (DOCUMENTS_CATEGORIES_PRIORITY[b.label] || DEFAULT_CATEGORY_PRIORITY),
      ),
  ];

  const me = await api.auth.getMe();
  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.edit')} />
      <p className="py-4 text-sm">{t('modal.content.editDocuments')}</p>
      {status?.split(',').includes('ARCHIVED') && (
        <p className="pb-4 text-xs italic text-gray-400">
          {t('company.documents.editModal.archivedOmitted')}
        </p>
      )}
      <EditDocumentsForm
        assignmentFilter={filter}
        categories={parsedCategories}
        dateFormat={me.dateFormat}
        documentIds={parsedDocumentIds}
        filterCategory={category}
        filterStatus={status}
        singleDocument={singleDocument}
      />
    </Modal>
  );
}
