import { redirect } from 'next/navigation';
import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import {
  AssignEmployeeBottomButtons,
  AssignEmployeesGridList,
  AssignEmployeeTable,
} from '@/app/(hris)/company/equipment/_components';
import { SearchInput } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { type EmployeeListOrderBy, HRIS_ROUTES } from '@/shared';
import { Pagination } from '@/lib/ui/components/pagination';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';
import { FilterTag } from '@/lib/ui/components/filter-tag';

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: EmployeeListOrderBy;
    filter?: EmployeeStatusDto;
    equipment: string;
    employees?: string;
    eqFilter?: string;
    eqCategory?: string;
    eqStatus?: string;
    perPage?: string;
  }>;
};

export default async function AssignEquipmentPage({ searchParams }: Props) {
  const {
    page,
    sort,
    search,
    equipment,
    filter,
    employees: employeeId,
    eqCategory,
    eqFilter,
    eqStatus,
    perPage,
  } = await searchParams;
  const permissionChecker = await getPermissionChecker();

  // Check if user has ASSIGN permission for COMPANY_EQUIPMENT
  const canAssignEquipment = permissionChecker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.ASSIGN);

  if (!canAssignEquipment) {
    return redirect(HRIS_ROUTES.equipment.base);
  }

  const parsedEquipmentIds = equipment === 'all' ? 'all' : equipment.split(',');

  const parsedFilters = (filter ? filter.split(',') : ['ACTIVE']) as EmployeeStatusDto[];

  const parsedPerPage = perPage ? +perPage : undefined;

  const t = await getTranslations('company.equipment.assignPage');
  const tNext = await getNextTranslations('company.equipment.assignPage');
  const api = hrisApi;

  const [equipments, employees] = await Promise.all([
    api.resources.getEquipmentList(
      'companyEquipment',
      +(page ?? 1),
      'signature-asc',
      ['ARCHIVED', 'BROKEN', 'IN_SERVICE', 'WORKING'],
      ['ASSIGNED', 'FREE'],
      parsedPerPage,
      undefined,
      undefined,
      undefined,
      parsedEquipmentIds === 'all' ? undefined : parsedEquipmentIds,
    ),
    api.employees.getAllEmployeesList(
      +(page ?? 1),
      search ?? '',
      sort ?? 'lastName-desc',
      parsedPerPage,
      parsedFilters,
    ),
  ]);

  const equipmentIds = equipments.items.map((eq) => eq.id);

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <BasicHeader>{t('title')}</BasicHeader>
        <p className="pt-3">
          {t(equipments.items.length > 1 ? 'assignChosenEquipments' : 'assignChosenEquipment')}
        </p>
        <section className="flex gap-x-4 pb-2 pt-6">
          <SearchInput
            aria-label={tNext('search')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: tNext('search') }}
          />
        </section>
        <section>
          <div className="hidden items-center gap-x-4 pb-6 pt-3.5 xl:flex">
            {employees._access.actions.includes('filter') && (
              <>
                <p className="text-sm font-semibold">{t('filters.filters')}:</p>
                <FilterTag searchParamKey="FILTER" value="ACTIVE" variant="green">
                  {t('filters.active')}
                </FilterTag>
                <FilterTag searchParamKey="FILTER" value="ARCHIVED" variant="gray">
                  {t('filters.archived')}
                </FilterTag>
              </>
            )}
          </div>
        </section>
        <AssignEmployeeTable
          disallowEmptySelection
          aria-label="employees table"
          className="hidden xl:table"
          data={employees}
          selectionMode="single"
        />
        <AssignEmployeesGridList className="xl:hidden" data={employees} selectionMode="single" />
        <Pagination
          nextPage={employees.nextPage}
          prevPage={employees.prevPage}
          totalPages={employees.totalPages}
        />
      </div>
      <AssignEmployeeBottomButtons
        key={employeeId}
        category={eqCategory}
        employeeId={employeeId}
        equipmentIds={equipmentIds}
        filter={eqFilter}
        status={eqStatus}
      />
    </div>
  );
}
