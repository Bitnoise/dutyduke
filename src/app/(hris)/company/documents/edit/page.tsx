import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES, type Nullable } from '@/shared';
import { getPermissionChecker, ResourceType, PermissionAction } from '@/api/hris/authorization';
import { hrisApi } from '@/api/hris';
import { type DocumentDto } from '@/api/hris/documents/model/dtos';
import { EditDocumentsForm } from '../_forms';
import { DEFAULT_CATEGORY_PRIORITY, DOCUMENTS_CATEGORIES_PRIORITY } from '../_constants';

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

  if (!documents) redirect(HRIS_ROUTES.equipment.base);
  const parsedDocumentIds = documents === 'all' ? documents : documents.split(',');

  const api = hrisApi;

  const [categories, me] = await Promise.all([
    api.documents.getAllCategories(undefined, undefined, 'all'),
    api.auth.getMe(),
  ]);
  const parsedCategories = [
    ...categories.items
      .map(({ id, name }) => ({ key: id, label: name }))
      .sort(
        (a, b) =>
          (DOCUMENTS_CATEGORIES_PRIORITY[a.label] || DEFAULT_CATEGORY_PRIORITY) -
          (DOCUMENTS_CATEGORIES_PRIORITY[b.label] || DEFAULT_CATEGORY_PRIORITY),
      ),
  ];

  let singleDocument: Nullable<DocumentDto> = null;

  if (parsedDocumentIds.length === 1) {
    singleDocument = await api.documents.getDocumentById(parsedDocumentIds[0]);
  }

  return (
    <section className="w-full">
      <h1 className="text-lg font-semibold">{t('modal.header.edit')}</h1>
      <p className="py-4 text-sm">{t('modal.content.editDocuments')}</p>
      <EditDocumentsForm
        assignmentFilter={filter}
        categories={parsedCategories}
        dateFormat={me.dateFormat}
        documentIds={parsedDocumentIds}
        filterCategory={category}
        filterStatus={status}
        singleDocument={singleDocument}
      />
    </section>
  );
}
