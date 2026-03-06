import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { type CUID, type OrderBy, detectMobileDevice } from '@/shared';
import { Pagination } from '@/lib/ui/components/pagination';
import { Section } from '@/lib/ui';
import { DragAndDrop } from '@/lib/ui/components/drag-and-drop';
import { DocumentsList } from './_tables/documents-list';
import { uploadEquipmentDocument } from './_actions';
import { DocumentsTable } from './_tables/documents-table';
import { DocumentsBulkButtons } from './_components';

type Props = {
  id: CUID;
  sort?: Extract<OrderBy, 'expDate-asc' | 'expDate-desc'>;
  page?: number;
  perPage?: number;
};

export default async function EquipmentDocumentsContent({
  id,
  sort = 'expDate-asc',
  page = 1,
  perPage,
}: Props) {
  const t = await getTranslations('company.equipment.documents');
  const tNext = await getNextTranslations('company.equipment.documents');
  const api = hrisApi;
  const isMobile = await detectMobileDevice();

  const equipment = await api.resources.getEquipmentById(id);

  if (!equipment) return null;

  const [documents, me] = await Promise.all([
    api.resources.getEquipmentDocuments(equipment?.documentIds, page, sort, perPage),
    api.auth.getMe(),
  ]);

  const isDisabled = !documents._access.actions.includes('edit') || equipment.status === 'ARCHIVED';

  return (
    <Section heading={t('header')}>
      <div className="pb-4">
        <DocumentsBulkButtons equipmentId={id} isDisabled={isDisabled} isMobile={isMobile} />
      </div>
      {documents.items.length ? (
        <>
          <DocumentsList
            className="xl:hidden"
            dateFormat={me.dateFormat}
            documents={documents}
            equipmentId={id}
            isDisabled={isDisabled}
          />
          <DragAndDrop
            action={uploadEquipmentDocument}
            defaultState={{ status: 'idle', form: { equipmentId: id, file: '' } }}
            isDisabled={isDisabled}
            showSubmittingState={false}
          >
            <DocumentsTable
              aria-label={tNext('table')}
              dateFormat={me.dateFormat}
              documents={documents}
              equipmentId={id}
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
          action={uploadEquipmentDocument}
          defaultState={{ status: 'idle', form: { equipmentId: id, file: '' } }}
        />
      ) : null}
    </Section>
  );
}
