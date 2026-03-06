import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import dayjs from 'dayjs';
import { SearchInput } from '@/lib/ui';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { type EmployeeListOrderBy, HRIS_ROUTES } from '@/shared';
import { hrisApi } from '@/api/hris';
import { Pagination } from '@/lib/ui/components/pagination';
import { parseEmployeesWithAbsences } from '@/shared/utils/parse-employees-with-absences';
import { Legend } from '@/lib/ui/components/legend';
import { ABSENCE_LEGEND } from '@/shared/constants/absences-legend';
import { AbsencesCard } from '../_components/absences-card';
import { AvailabilityChart } from './_components/availability-chart';
import { AvailabilityGridList } from './_components/availability-grid-list';

type Props = {
  searchParams: Promise<{
    from: string;
    to: string;
    sort: EmployeeListOrderBy;
    search: string;
    page: string;
    yearMonth: string;
    perPage: string;
  }>;
};

const absenceLegendWithoutCompanyOff = ABSENCE_LEGEND.slice(0, 3);

export default async function AvailabilityPage(props: Props) {
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_ABSENCES
  const canViewAbsences = permissionChecker.can(ResourceType.COMPANY_ABSENCES, PermissionAction.VIEW);

  if (!canViewAbsences) {
    return redirect(HRIS_ROUTES.dashboard);
  }
  const api = hrisApi;
  const page = searchParams?.page ? +searchParams.page : 1;
  const sort = searchParams?.sort ?? 'lastName-desc';
  const search = searchParams?.search ?? '';
  const yearMonth = (searchParams.yearMonth ? dayjs(searchParams.yearMonth) : dayjs()).format('YYYY-MM-DD');
  const perPage = searchParams.perPage ? +searchParams.perPage : undefined;

  const year = dayjs(yearMonth).year();

  const [employeesData, me] = await Promise.all([
    api.employees.getAllEmployeesList(+page, search, sort, perPage, ['ACTIVE']),
    api.auth.getMe(),
  ]);

  const [absencesData, schedulerData] = await Promise.all([
    api.absences.getAllAbsences(
      1,
      undefined,
      undefined,
      ['APPROVED', 'PENDING'],
      ['HOLIDAY', 'PERSONAL', 'SICK', 'GLOBAL'],
      undefined,
      perPage,
      employeesData.items.map((employee) => employee.id),
    ),
    api.absences.getSchedulerAvailabilityData(
      searchParams.from ? searchParams.from : yearMonth,
      searchParams.to,
      ['APPROVED', 'PENDING'],
    ),
  ]);

  const employeesWithAbsences = parseEmployeesWithAbsences(employeesData.items, absencesData.items);

  const globalAbsences = absencesData.items.filter((absence) => absence.type === 'GLOBAL');

  return (
    <AbsencesCard className="lg:flex lg:flex-1" header={t('absences.header')}>
      <div className="flex w-full flex-col gap-y-6">
        <Legend className="hidden lg:flex" items={absenceLegendWithoutCompanyOff} />
        <div className="hidden min-h-max lg:flex lg:flex-1">
          <AvailabilityChart data={schedulerData} dateFormat={me.dateFormat} />
        </div>
      </div>

      <div className="lg:hidden">
        <SearchInput aria-label={t('ctaLabels.search')} placeholder={t('ctaLabels.search')} />
        <AvailabilityGridList data={employeesWithAbsences} globalAbsences={globalAbsences} year={year} />
        <Pagination
          nextPage={employeesData.nextPage}
          prevPage={employeesData.prevPage}
          totalPages={employeesData.totalPages}
        />
      </div>
    </AbsencesCard>
  );
}
