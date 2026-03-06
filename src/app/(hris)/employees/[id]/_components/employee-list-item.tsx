'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type BaseEmployeeDto } from '@/api/hris/employees/model/dtos';
import { Avatar } from '@/lib/ui';
import { cn, type CUID } from '@/shared';

type Props = {
  employee: BaseEmployeeDto;
  employeeId: CUID;
};

export function EmployeeListItem({ employee, employeeId }: Props) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const params = category && status && `?category=${category}&status=${status}`;
  const href = `${pathName.replace(employeeId, employee.id)}${params ?? ''}`;

  return (
    <li key={employee.id} className="w-full">
      <Link
        className={cn('block px-2 rounded-lg hover:bg-hover transition-color', {
          'bg-hover': employee.id === employeeId,
        })}
        href={href}
      >
        <div className="flex h-14 items-center gap-x-2">
          <Avatar key={employee.avatarId} avatarId={employee.avatarId} size="sm" />
          <span className="hidden text-sm md:block">
            {employee.firstName} {employee.lastName}
          </span>
        </div>
      </Link>
    </li>
  );
}
