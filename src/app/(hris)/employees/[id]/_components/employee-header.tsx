import { getTranslations as getNextTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { cn, type PropsWithClassName, type CUID, HRIS_ROUTES, parseString } from '@/shared';
import { Avatar, Flag, Icon } from '@/lib/ui';
import { type Api } from '@/api/hris';
import { EmployeeItemMenu } from '@/app/(hris)/employees/[id]/_components/employee-item-menu';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';

type Props = {
  employeeId: CUID;
  api: Api;
};

const flag: Record<EmployeeStatusDto, 'info' | 'warning' | 'success' | 'info-grey'> = {
  ACTIVE: 'success',
  ARCHIVED: 'info-grey',
};

export async function EmployeeHeader({
  employeeId,
  className,
  api,
}: PropsWithClassName<Props>): Promise<JSX.Element> {
  const t = await getTranslations();
  const tNext = await getNextTranslations();

  const [me, employee] = await Promise.all([api.auth.getMe(), api.employees.getEmployeeById(employeeId)]);

  const { firstName, lastName, _access, id, avatarId, role } = employee;

  return (
    <div
      className={cn(
        'bg-white flex relative flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:justify-between items-center pb-2',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-between gap-x-4 lg:flex-row">
        <Link
          aria-label={tNext('navigation.goBack')}
          className="absolute left-0 top-1/4 -translate-y-1/2 p-4 text-accent lg:hidden"
          href={HRIS_ROUTES.employees.base}
        >
          <Icon name="arrow-left" size="sm" />
        </Link>
        <Avatar avatarId={avatarId} />
        <div className="flex flex-col items-center pt-1 text-center lg:items-start lg:text-left">
          <h1 className="text-xl font-bold leading-none">{`${firstName} ${lastName}`}</h1>
          <h2 className="text-xs text-accent">{parseString(role)}</h2>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <Flag className="absolute right-4 top-4 lg:static" intent={flag[employee.status]}>
          {t(`employees.statuses.${employee.status.toLowerCase()}`)}
        </Flag>
        {me.id !== id && <EmployeeItemMenu actions={_access.actions} employee={employee} />}
      </div>
    </div>
  );
}
