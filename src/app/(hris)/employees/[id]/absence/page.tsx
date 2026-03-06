import { Suspense } from 'react';
import dayjs from 'dayjs';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Section } from '@/lib/ui';
import { hrisApi } from '@/api/hris';
import { Legend } from '@/lib/ui/components/legend';
import { ABSENCE_LEGEND } from '@/shared/constants/absences-legend';
import { parseDate } from '@/shared/utils';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { EmployeeCard } from '../_components/employee-card';
import { CalendarsGrid } from './_components/calendars-grid';
import { AbsenceInfoTiles } from './_components/absence-info-tiles';
import { PendingAbsencesList } from './_components/pending-absences-list';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    year: string;
  }>;
};

export default async function EmployeeAbsencePage(props: Props) {
  const [{ id }, { year }] = await Promise.all([props.params, props.searchParams]);
  const api = hrisApi;
  const t = await getTranslations('absences');
  const parsedYear = +(year ?? dayjs().year());
  const me = await api.auth.getMe();
  const isOwner = me.roles.includes('OWNER');
  const permissionChecker = await getPermissionChecker();
  const canEditCompanyAbsences = permissionChecker.can(ResourceType.COMPANY_ABSENCES, PermissionAction.EDIT);
  const canEditEmployeeAbsences = permissionChecker.can(
    ResourceType.EMPLOYEE_ABSENCES,
    PermissionAction.EDIT,
  );
  const canManagePendingAbsences = isOwner || canEditCompanyAbsences || canEditEmployeeAbsences;

  const [absences, globalAbsences, pendingAbsences] = await Promise.all([
    api.absences.getAllAbsences(
      1,
      new Date(`${parsedYear}-01-01`),
      new Date(`${parsedYear}-12-31`),
      ['APPROVED', 'PENDING'],
      ['HOLIDAY', 'SICK', 'PERSONAL'],
      'requestedAt-desc',
      'all',
      [id],
    ),
    api.absences.getAllAbsences(
      1,
      new Date(`${parsedYear}-01-01`),
      new Date(`${parsedYear}-12-31`),
      ['APPROVED'],
      ['GLOBAL'],
      'requestedAt-desc',
      'all',
    ),
    canManagePendingAbsences
      ? api.absences.getAllAbsences(
          1,
          undefined,
          undefined,
          ['PENDING'],
          ['HOLIDAY', 'PERSONAL', 'SICK'],
          'requestedAt-desc',
          'all',
          [id],
        )
      : undefined,
  ]);

  // Fetch employee data for pending absences
  const pendingAbsencesWithEmployees =
    canManagePendingAbsences && pendingAbsences
      ? await Promise.all(
          pendingAbsences.items.map(async ({ days, endDate, issuerId, startDate, ...absence }) => ({
            ...absence,
            dateRange: `${parseDate(startDate, me.dateFormat)} - ${parseDate(endDate, me.dateFormat)} (${days}d)`,
            issuer: await api.employees.getEmployeeById(issuerId),
          })),
        )
      : [];

  return (
    <EmployeeCard employeeId={id}>
      <div className="flex flex-col gap-y-8">
        <Suspense>
          <AbsenceInfoTiles employeeId={id} />
        </Suspense>
        {canManagePendingAbsences && pendingAbsencesWithEmployees.length > 0 && (
          <PendingAbsencesList
            absences={pendingAbsencesWithEmployees}
            actions={pendingAbsences!._access.actions}
            dateFormat={me.dateFormat}
            reviewerId={me.id}
          />
        )}
        <Section heading={t('header')}>
          <Legend className="pb-6" items={ABSENCE_LEGEND} />
          <CalendarsGrid
            absences={absences.items.concat(globalAbsences.items)}
            employeeId={id}
            year={parsedYear}
          />
        </Section>
      </div>
    </EmployeeCard>
  );
}
