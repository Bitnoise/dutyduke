import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { API_ERROR_MESSAGES, ApiError, hasAccess, HRIS_ROUTES, type CUID, type PageParams } from '@/shared';
import { hrisApi } from '@/api/hris';
import { EditEmployeeDocumentForm } from '@/app/(hris)/employees/[id]/documents/_forms';

export default async function EditEmployeeDocumentPage({
  params: { id, documentId },
}: PageParams<{ id: CUID; documentId: CUID }>) {
  const t = await getTranslations();

  const api = hrisApi;
  const [me, document] = await Promise.all([api.auth.getMe(), api.documents.getDocumentById(documentId)]);

  if (!hasAccess(me.roles, 'employees.documents.edit') || !document) {
    redirect(HRIS_ROUTES.employees.documents.base(id));
  }

  if (!document) {
    throw new ApiError(404, API_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND(documentId));
  }

  return (
    <div className="flex-1 rounded-lg bg-white px-4 pb-20 pt-10 shadow-xl">
      <h4 className="pb-10 text-xl font-semibold">{t('employees.documents.edit.header')}</h4>
      <EditEmployeeDocumentForm dateFormat={me.dateFormat} document={document} employeeId={id} />
    </div>
  );
}
