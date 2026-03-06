import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { parseDate, type AbsenceListOrderBy } from '@/shared';
import { type AbsenceType, type AbsenceStatus } from '@/api/hris/prisma/client';
import { NoResults, SearchInput } from '@/lib/ui';
import { Pagination } from '@/lib/ui/components/pagination';
import { Stack } from '@/lib/ui/components/stack';
import { type CUID } from '@/api/hris/types';
import { type BaseEmployeeDto } from '@/api/hris/employees/model/dtos';
import { AbsencesTable } from './_components/absences-table';
import { AbsencesGridList } from './_components/absences-grid-list';
import { AbsencesFiltersStatus, AbsencesFiltersType } from './_components/absences-filters';
import { AbsencesBulkActions } from './_components/absences-bulk-actions';
import { AbsencesCard } from './_components/absences-card';

type Props = {
  searchParams: Promise<{
    sort?: AbsenceListOrderBy;
    status: string;
    type: string;
    absences: string;
    search?: string;
    perPage?: string;
    page?: string;
  }>;
};

export default async function AbsencesPage({ searchParams }: Props) {
  const api = hrisApi;
  const t = await getTranslations('absences');
  const tNext = await getNextTranslations('absences');
  const params = await searchParams;
  const parsedStatusesFilter = params.status ? (params.status.split(',') as AbsenceStatus[]) : [];
  const parsedTypesFilter = params.type ? (params.type.split(',') as AbsenceType[]) : [];
  const perPage = params.perPage ? +params.perPage : undefined;
  const page = params.page ? +params.page : 1;

  const me = await api.auth.getMe();

  const searchedEmployees = params.search
    ? await api.employees.queryEmployees(decodeURIComponent(params.search))
    : undefined;

  const absences = await api.absences.getAllAbsences(
    page,
    undefined,
    undefined,
    parsedStatusesFilter,
    parsedTypesFilter,
    params.sort ?? 'requestedAt-desc',
    perPage,
    searchedEmployees,
  );

  // Extract all unique issuer and reviewer IDs from absences (including archived employees)
  const employeeIdsFromAbsences = new Set<CUID>();
  absences.items.forEach((absence) => {
    employeeIdsFromAbsences.add(absence.issuerId);
    if (absence.reviewerId) {
      employeeIdsFromAbsences.add(absence.reviewerId);
    }
  });

  // Fetch employees: searched employees + issuer/reviewer employees from absences
  // Using getEmployeesById ensures archived employees are included
  const allEmployeeIds = searchedEmployees?.length
    ? Array.from(new Set([...searchedEmployees, ...employeeIdsFromAbsences]))
    : Array.from(employeeIdsFromAbsences);

  const employees = allEmployeeIds.length > 0 ? await api.employees.getEmployeesById(allEmployeeIds) : [];

  const employeesMap = employees.reduce(
    (acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    },
    {} as Record<CUID, BaseEmployeeDto>,
  );

  const absencesWithEmployees = absences.items.map(({ issuerId, startDate, endDate, days, ...absence }) => ({
    ...absence,
    dateRange: `${parseDate(startDate, me.dateFormat)} - ${parseDate(endDate, me.dateFormat)} (${days}d)`,
    issuer: employeesMap[issuerId] ?? null,
  }));

  return (
    <AbsencesCard header={t('header')}>
      <Stack className="pb-4" direction="column">
        <Stack>
          <SearchInput className="w-full max-w-[380px]" placeholder={tNext('search')} />
          <AbsencesBulkActions
            actions={absences._access.actions}
            className="hidden xl:flex"
            reviewerId={me.id}
          />
        </Stack>
        {absences._access.actions.includes('filter') && (
          <div className="hidden flex-wrap gap-x-8 gap-y-4 py-1.5 xl:flex">
            <AbsencesFiltersStatus />
            <AbsencesFiltersType />
          </div>
        )}
      </Stack>
      <AbsencesTable
        absences={{
          ...absences,
          items: absencesWithEmployees,
        }}
        className="hidden xl:table"
        dateFormat={me.dateFormat}
        reviewerId={me.id}
      />
      <AbsencesGridList
        absences={{
          ...absences,
          items: absencesWithEmployees,
        }}
        className="xl:hidden"
        dateFormat={me.dateFormat}
        reviewerId={me.id}
      />
      {absences.totalItems === 0 && <NoResults />}
      <Pagination
        nextPage={absences.nextPage}
        prevPage={absences.prevPage}
        totalPages={absences.totalPages}
      />
    </AbsencesCard>
  );
}
