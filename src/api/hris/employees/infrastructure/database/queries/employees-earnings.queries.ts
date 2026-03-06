import { type OrganizationContext } from '@/api/hris';
import { type EmployeeEarningsDto } from '@/api/hris/employees/model/dtos';
import { type CUID } from '@/shared';

type EmployeesEarningsQuery = {
  getEmployeeEarnings: (employeeId: CUID) => Promise<EmployeeEarningsDto[]>;
  getEmployeeEarningsById: (employeeId: CUID, earningId: CUID) => Promise<EmployeeEarningsDto | null>;
};

export function employeesEarningsQueries(organizationContext: OrganizationContext): EmployeesEarningsQuery {
  const { db } = organizationContext;

  const getEmployeeEarnings = async (employeeId: CUID) => {
    const earnings = await db.employeeEarnings.findMany({ where: { employeeId }, orderBy: { date: 'desc' } });

    return earnings.map((earning) => ({ ...earning, value: earning.value.toNumber() }));
  };
  const getEmployeeEarningsById = async (employeeId: CUID, earningId: CUID) => {
    const earning = await db.employeeEarnings.findUnique({
      where: { employeeId: employeeId, id: earningId },
    });

    if (!earning) return null;

    return {
      ...earning,
      value: earning.value.toNumber(),
    };
  };

  return {
    getEmployeeEarnings,
    getEmployeeEarningsById,
  };
}
