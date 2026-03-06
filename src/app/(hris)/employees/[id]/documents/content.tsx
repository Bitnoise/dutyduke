import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { type CUID, type OrderBy, detectMobileDevice } from '@/shared';
import { DocumentsTable } from '@/app/(hris)/employees/[id]/documents/_tables';
import { DocumentsList } from '@/app/(hris)/employees/[id]/documents/_tables/documents-list';
import { Pagination } from '@/lib/ui/components/pagination';
import { Section } from '@/lib/ui';
import { DragAndDrop } from '@/lib/ui/components/drag-and-drop';
import { DocumentsBulkButtons } from './_components';
import { uploadEmployeeDocument } from './_actions';

type Props = {
  id: CUID;
  sort?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>;
  page?: number;
};

export default async function EmployeeDocumentsContent({ id, sort = 'expDate-asc', page = 1 }: Props) {
  const t = await getTranslations('employees.documents');
  const tNext = await getNextTranslations('employees.documents');

  const api = hrisApi;

  const isMobile = await detectMobileDevice();

  const employee = await api.employees.getEmployeeById(id);

  const [documents, me] = await Promise.all([
    api.employees.getEmployeeDocuments(employee.documentIds, page, sort),
    api.auth.getMe(),
  ]);

  const isDisabled = !documents._access.actions.includes('edit') || employee.status === 'ARCHIVED';
  return (
    <Section heading={t('header')}>
      {documents.items.length ? (
        <>
          <div className="pb-4">
            <DocumentsBulkButtons employeeId={id} isDisabled={isDisabled} isMobile={isMobile} />
          </div>
          <DocumentsList
            className="xl:hidden"
            dateFormat={me.dateFormat}
            documents={documents}
            employeeId={id}
            isDisabled={isDisabled}
            isMobile={isMobile}
          />
          <DragAndDrop
            action={uploadEmployeeDocument}
            defaultState={{ status: 'idle', form: { employeeId: id, file: '' } }}
            isDisabled={isDisabled}
            showSubmittingState={false}
          >
            <DocumentsTable
              aria-label={tNext('table')}
              dateFormat={me.dateFormat}
              documents={documents}
              employeeId={id}
              isMobile={isMobile}
              selectionMode={!isDisabled ? 'multiple' : undefined}
            />
          </DragAndDrop>
          <Pagination
            nextPage={documents.nextPage}
            prevPage={documents.prevPage}
            totalPages={documents.totalPages}
          />
        </>
      ) : !isDisabled ? (
        <DragAndDrop
          action={uploadEmployeeDocument}
          defaultState={{ status: 'idle', form: { employeeId: id, file: '' } }}
        />
      ) : null}
    </Section>
  );
}
