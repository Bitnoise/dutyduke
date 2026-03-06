import { type CUID } from '@/shared';
import { EmployeeListItem } from '@/app/(hris)/employees/[id]/_components/employee-list-item';
import { type Api } from '@/api/hris';

type Props = {
  employeeId: CUID;
  api: Api;
  query?: string;
};

export function EmployeeListSkeleton() {
  return (
    <ul className="flex flex-col gap-y-1">
      <li className="h-14 animate-pulse bg-background"></li>
      <li className="h-14 animate-pulse bg-background"></li>
      <li className="h-14 animate-pulse bg-background"></li>
      <li className="h-14 animate-pulse bg-background"></li>
      <li className="h-14 animate-pulse bg-background"></li>
      <li className="h-14 animate-pulse bg-background"></li>
    </ul>
  );
}

export async function EmployeesList({ employeeId, api, query }: Props): Promise<JSX.Element> {
  const employees = await api.employees.getAllEmployees(query);

  return (
    <ul className="flex flex-col gap-y-1">
      {employees.map((employee) => (
        <EmployeeListItem key={employee.id} employee={employee} employeeId={employeeId} />
      ))}
    </ul>
  );
}
