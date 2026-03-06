import { redirect } from 'next/navigation';
import { getLocale, getTranslations as getNextTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { type DocumentsOrderBy, HRIS_ROUTES } from '@/shared';
import { SearchInput } from '@/lib/ui';
import { hrisApi } from '@/api/hris';
import { Pagination } from '@/lib/ui/components/pagination';
import { type DocumentsAssignStatus, type DocumentsStatus } from '@/api/hris/documents/model/dtos';
import { Stack } from '@/lib/ui/components/stack';
import { getTranslations } from '@/shared/service/locale/get-translations';
import {
  DocumentsBulkActions,
  DocumentsFilters,
  DocumentsGridList,
  DocumentsHeader,
  DocumentsTable,
} from './_components';
import { DEFAULT_CATEGORY_PRIORITY, DOCUMENTS_CATEGORIES_PRIORITY } from './_constants';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getNextTranslations({ locale, namespace: 'company.equipment' });

  return {
    title: t('title'),
  };
}

type Props = {
  searchParams: Promise<{
    documents?: string;
    category?: string;
    status?: string;
    page?: string;
    filter?: string;
    sort?: DocumentsOrderBy;
    search?: string;
    perPage?: string;
  }>;
};

export default async function DocumentsPage({ searchParams }: Props) {
  const {
    category,
    filter,
    documents: documentIds,
    search,
    sort,
    status,
    page,
    perPage,
  } = await searchParams;

  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_DOCUMENTS
  const canViewDocuments = permissionChecker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.VIEW);

  if (!canViewDocuments) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  const t = await getTranslations('company.documents');
  const tNext = await getNextTranslations('company.documents');
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedDocumentIds = documentIds === 'all' ? 'all' : documentIds?.split(',');
  const parsedAssignedFilters = (filter?.split(',').filter(Boolean) as DocumentsAssignStatus[]) ?? [];
  const parsedStatusFilter = (status?.split(',').filter(Boolean) as DocumentsStatus[]) ?? [];
  const categoryFilter = (category === 'ALL' ? null : category) ?? null;
  const parsedPerPage = perPage ? +perPage : undefined;

  const [documents, categories, me] = await Promise.all([
    api.documents.getDocumentsList(
      'companyDocument',
      parsedPage,
      sort ?? 'createdAt-desc',
      parsedStatusFilter,
      parsedAssignedFilters,
      categoryFilter,
      undefined,
      search,
      parsedPerPage,
    ),
    api.documents.getAllCategories(undefined, 1, 'all'),
    api.auth.getMe(),
  ]);

  const parsedCategories = [
    { key: 'ALL', label: tNext('filters.all') },
    ...categories.items
      .map(({ id, name }) => ({ key: id, label: name }))
      .sort(
        (a, b) =>
          (DOCUMENTS_CATEGORIES_PRIORITY[a.label] || DEFAULT_CATEGORY_PRIORITY) -
          (DOCUMENTS_CATEGORIES_PRIORITY[b.label] || DEFAULT_CATEGORY_PRIORITY),
      ),
  ];

  return (
    <>
      <DocumentsHeader title={t('title')} />
      <Stack className="pb-4" direction="column">
        <Stack>
          <SearchInput
            aria-label={tNext('search')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: tNext('search') }}
          />
          <DocumentsBulkActions
            actions={['addFile', 'delete', 'edit']}
            category={category}
            documentsIds={parsedDocumentIds}
            filter={filter}
            status={status}
          />
        </Stack>
        <DocumentsFilters
          assignedFiltersEnabled
          categories={parsedCategories}
          className="hidden flex-wrap xl:flex"
        />
      </Stack>
      <DocumentsTable
        navigationEnabled
        className="hidden xl:table"
        dateFormat={me.dateFormat}
        documents={documents}
      />
      <DocumentsGridList
        navigationEnabled
        categories={parsedCategories}
        className="xl:hidden"
        dateFormat={me.dateFormat}
        documents={documents}
      />
      <Pagination
        nextPage={documents.nextPage}
        prevPage={documents.prevPage}
        totalPages={documents.totalPages}
      />
    </>
  );
}
