import { redirect } from 'next/navigation';
import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { SearchInput } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { type CUID, type EquipmentOrderBy, HRIS_ROUTES } from '@/shared';
import { Pagination } from '@/lib/ui/components/pagination';
import { type EquipmentStatus } from '@/api/hris/prisma/client';
import { type EquipmentAssignStatus } from '@/api/hris/resources/model/dtos';
import { EmployeeCard } from '../../_components/employee-card';
import { EmployeeEquipmentFilters } from '../../_components/employee-equipment-filters';
import { AssignEquipmentTable } from '../../_components/assign-equipment-table';
import { AssignEquipmentGridList } from '../../_components/assign-equipment-grid-list';
import { AssignEquipmentBottomButtons } from '../../_components/assign-equipment-bottom-buttons';

type Props = {
  params: Promise<{
    id: CUID;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: EquipmentOrderBy;
    equipment: string;
    filter?: string;
    category?: string;
    status?: string;
    perPage?: string;
  }>;
};

export default async function EmployeeAssignEquipmentPage({ params, searchParams }: Props) {
  const { page, sort, search, equipment, filter, category, status, perPage } = await searchParams;
  const { id } = await params;
  const permissionChecker = await getPermissionChecker();

  // Check if user has ASSIGN permission for COMPANY_EQUIPMENT or EMPLOYEE_EQUIPMENT
  const canAssignCompanyEquipment = permissionChecker.can(
    ResourceType.COMPANY_EQUIPMENT,
    PermissionAction.ASSIGN,
  );
  const canAssignEmployeeEquipment = permissionChecker.can(
    ResourceType.EMPLOYEE_EQUIPMENT,
    PermissionAction.ASSIGN,
  );

  if (!canAssignCompanyEquipment && !canAssignEmployeeEquipment) {
    return redirect(HRIS_ROUTES.employees.base);
  }

  const parsedAssignedFilters = (
    filter ? filter.split(',') : ['ASSIGNED', 'FREE']
  ) as EquipmentAssignStatus[];
  const parsedStatusFilter = (
    status ? status.split(',') : ['WORKING', 'IN_SERVICE', 'BROKEN', 'ARCHIVED']
  ) as EquipmentStatus[];
  const categoryFilter = category === 'ALL' ? undefined : category;
  const parsedPerPage = perPage ? +perPage : undefined;

  const t = await getTranslations('company.equipment.assignPage');
  const tNext = await getNextTranslations('company.equipment.assignPage');
  const api = hrisApi;

  const [equipments, categories] = await Promise.all([
    api.resources.getEquipmentList(
      'employeeAssignEquipment',
      +(page ?? 1),
      sort,
      parsedStatusFilter,
      parsedAssignedFilters,
      parsedPerPage,
      categoryFilter,
      search,
      undefined,
      undefined,
    ),
    api.resources.getAllCategories(),
  ]);

  const chosenEquipments = equipment === 'all' && equipments.items.length ? 'all' : equipment?.split(',');

  const parsedCategories = categories?.map((category) => ({
    key: category.id,
    label: category.name,
  }));

  const isAssigned = !!equipments.items.find((eq) =>
    chosenEquipments === 'all' ? eq.assignee : chosenEquipments?.includes(eq.id),
  )?.assignee;

  return (
    <EmployeeCard
      className="flex flex-1 flex-col justify-between md:pt-0"
      employeeId={id ?? ''}
      showHeader={false}
      showTabs={false}
    >
      <div>
        <BasicHeader>{t('title')}</BasicHeader>
        <section className="flex gap-x-4 pb-2 pt-6">
          <SearchInput
            aria-label={tNext('search')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: tNext('search') }}
          />
        </section>
        <section className="pb-2">
          <EmployeeEquipmentFilters
            assignedFiltersEnabled
            categories={parsedCategories}
            className="hidden xl:flex"
          />
        </section>
        <AssignEquipmentTable navigationEnabled className="hidden xl:table" equipments={equipments} />
        <AssignEquipmentGridList
          navigationEnabled
          categories={parsedCategories}
          className="xl:hidden"
          equipments={equipments}
        />
        <Pagination
          nextPage={equipments.nextPage}
          prevPage={equipments.prevPage}
          totalPages={equipments.totalPages}
        />
      </div>
      <AssignEquipmentBottomButtons
        key={equipment}
        category={category}
        employeeId={id}
        equipmentIds={equipment}
        filter={filter}
        isAssigned={isAssigned}
        status={status}
      />
    </EmployeeCard>
  );
}
