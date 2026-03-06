import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { type EquipmentStatus } from '@/api/hris/resources/model/dtos';
import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';
import { SearchInput, Section } from '@/lib/ui';
import { Pagination } from '@/lib/ui/components/pagination';
import { type CUID, type EquipmentOrderBy } from '@/shared';
import { Stack } from '@/lib/ui/components/stack';
import { EmployeeEquipmentTable } from '../_components/employee-equipment-table';
import { EmployeeEquipmentBulkActions } from '../_components/employee-equipment-bulk-actions';
import { EmployeeEquipmentGridList } from '../_components/employee-equipment-grid-list';
import { EmployeeEquipmentFilters } from '../_components/employee-equipment-filters';

type Props = {
  params: Promise<{
    id: CUID;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: EquipmentOrderBy;
    category?: string;
    status?: string;
    search?: string;
    filter?: string;
    equipment?: string;
    perPage?: string;
  }>;
};

export default async function EmployeeEquipmentPage(props: Props) {
  const [{ id }, { page, status, category, sort, filter, search, equipment, perPage }] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const permissionChecker = await getPermissionChecker();
  const canViewEquipment = permissionChecker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.VIEW);

  const t = await getTranslations('employees.equipment');
  const tNext = await getNextTranslations('employees.equipment');
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedPerPage = perPage ? +perPage : undefined;

  const eqStatuses = (status ? status.split(',') : []) as EquipmentStatus[];

  const [equipments, categories] = await Promise.all([
    api.resources.getEquipmentList(
      'employeeEquipment',
      parsedPage,
      sort,
      eqStatuses,
      ['ASSIGNED'],
      parsedPerPage,
      category === 'ALL' ? undefined : category,
      search,
      id,
    ),
    api.resources.getAllCategories(),
  ]);

  const parsedCategories = categories.map((category) => ({
    key: category.id,
    label: category.name,
  }));

  parsedCategories.unshift({ key: 'ALL', label: tNext('filters.all') });
  return (
    <EmployeeCard employeeId={id}>
      <Section heading={t('title')}>
        <Stack className="pb-4" direction="column">
          <Stack>
            <SearchInput
              aria-label={tNext('searchEquipment')}
              className="basis-full xl:basis-2/5"
              inputProps={{ placeholder: tNext('search') }}
            />
            <EmployeeEquipmentBulkActions
              actions={equipments._access.actions.filter((action) => action !== 'create')}
              category={category}
              employeeId={id}
              equipmentIds={equipment}
              filter={filter}
              status={status}
            />
          </Stack>
          <EmployeeEquipmentFilters categories={parsedCategories} className="hidden xl:flex" />
        </Stack>
        <EmployeeEquipmentTable
          category={category}
          className="hidden xl:table"
          employeeId={id}
          equipments={equipments}
          filter={filter}
          includeAssignee={false}
          navigationEnabled={canViewEquipment}
          status={status}
        />
        <EmployeeEquipmentGridList
          assignedFiltersEnabled={false}
          categories={parsedCategories}
          category={category}
          className="xl:hidden"
          employeeId={id}
          equipmentIds={equipment}
          equipments={equipments}
          filter={filter}
          includeAssignee={false}
          navigationEnabled={canViewEquipment}
          status={status}
        />
        <Pagination
          nextPage={equipments.nextPage}
          prevPage={equipments.prevPage}
          totalPages={equipments.totalPages}
        />
      </Section>
    </EmployeeCard>
  );
}
