import { type PropsWithChildren } from 'react';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { Card } from '@/lib/ui';
import { EmployeeCreationForm } from './_forms';

export default async function EmployeesCreatePage({}: PropsWithChildren) {
  const api = hrisApi;

  const [companyName, me] = await Promise.all([
    api.employees.getEmployeeOrganizationName(),
    api.auth.getMe(),
  ]);

  return (
    <div className="flex min-h-full gap-x-1">
      <Card>
        <BasicHeader className="pb-6" />
        <EmployeeCreationForm companyName={companyName ?? ''} dateFormat={me.dateFormat} />
      </Card>
    </div>
  );
}
