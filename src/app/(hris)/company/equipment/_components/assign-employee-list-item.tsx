import { type EmployeeListItemDto } from '@/api/hris/employees/model/dtos';

type Props = {
  employee: EmployeeListItemDto;
};

export function AssignEmployeeListItem({ employee }: Props) {
  return (
    <li key={employee.id} className="block w-full rounded-lg px-2 transition-colors hover:bg-hover">
      <div className="flex h-14 items-center gap-x-2">
        <span className="hidden text-sm md:block">
          {employee.firstName} {employee.lastName}
        </span>
        <span className="hidden text-xxs md:block">{employee.role}</span>
      </div>
    </li>
  );
}
