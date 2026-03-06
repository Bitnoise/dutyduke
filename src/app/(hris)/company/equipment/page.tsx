import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { type EquipmentOrderBy, HRIS_ROUTES } from '@/shared';
import { SearchInput, NoResults } from '@/lib/ui';
import {
  EquipmentBulkActions,
  EquipmentFilters,
  EquipmentGridList,
  EquipmentTable,
} from '@/app/(hris)/company/equipment/_components';
import { hrisApi } from '@/api/hris';
import { Pagination } from '@/lib/ui/components/pagination';
import { type EquipmentAssignStatus, type EquipmentStatus } from '@/api/hris/resources/model/dtos';
import { Stack } from '@/lib/ui/components/stack';
import { EquipmentsOptions } from './_components/equipments-options';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'company.equipment' });

  return {
    title: t('title'),
  };
}

type Props = {
  searchParams: Promise<{
    page?: string;
    sort?: EquipmentOrderBy;
    category?: string;
    filter?: string;
    status?: string;
    search?: string;
    perPage?: string;
  }>;
};

export default async function EquipmentPage({ searchParams }: Props) {
  const { sort, page, category, filter, status, search, perPage } = await searchParams;
  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_EQUIPMENT
  const canViewEquipment = permissionChecker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.VIEW);

  if (!canViewEquipment) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  const t = await getTranslations('company.equipment');
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedAssignedFilters = filter?.split(',').filter(Boolean) as EquipmentAssignStatus[];
  const parsedStatusFilter = status?.split(',').filter(Boolean) as EquipmentStatus[];
  const categoryFilter = category === 'ALL' ? undefined : category;
  const parsedPerPage = perPage ? +perPage : undefined;

  const [equipments, categories] = await Promise.all([
    api.resources.getEquipmentList(
      'companyEquipment',
      parsedPage,
      sort,
      parsedStatusFilter,
      parsedAssignedFilters,
      parsedPerPage,
      categoryFilter,
      search,
    ),
    api.resources.getAllCategories(),
  ]);

  const parsedCategories = categories.map((category) => ({
    key: category.id,
    label: category.name,
  }));

  parsedCategories.unshift({ key: 'ALL', label: t('filters.all') });

  return (
    <>
      <EquipmentsOptions />
      <Stack className="pb-4" direction="column">
        <Stack>
          <SearchInput
            aria-label={t('searchEquipment')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: t('search') }}
          />
          <EquipmentBulkActions
            actions={equipments._access.actions}
            category={category}
            equipments={equipments.items}
            filter={filter}
            status={status}
          />
        </Stack>
        <EquipmentFilters assignedFiltersEnabled categories={parsedCategories} className="hidden xl:flex" />
      </Stack>
      <EquipmentTable navigationEnabled className="hidden xl:table" equipments={equipments} />
      <EquipmentGridList
        navigationEnabled
        categories={parsedCategories}
        className="xl:hidden"
        equipments={equipments}
      />
      {equipments.totalItems === 0 && <NoResults />}
      <Pagination
        nextPage={equipments.nextPage}
        prevPage={equipments.prevPage}
        totalPages={equipments.totalPages}
      />
    </>
  );
}
