import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import type { CUID } from '@/api/hris/types';
import {
  type CreateEmployeeDto,
  type EmployeeChildDto,
  type UpdateEmployeeGeneralInfoDto,
} from '@/api/hris/employees/model/dtos/employee.dto';
import { type EmployeeRepository } from '@/api/hris/employees/model/repositories';
import { type EmployeeStatusDto } from '../../../model/dtos';

export function employeeRepository(db: OrganizationPrismaClient): EmployeeRepository {
  const createEmployee = async (employee: CreateEmployeeDto): Promise<CUID> => {
    const createdEmployee = await db.employee.create({ data: employee });

    return <CUID>createdEmployee.id;
  };

  const updateEmployee = async (
    employeeId: CUID,
    employee: Partial<UpdateEmployeeGeneralInfoDto>,
  ): Promise<void> => {
    await db.employee.update({ where: { id: employeeId }, data: employee });
  };

  const updateAllChildren = async (employeeId: CUID, children: EmployeeChildDto[]): Promise<void> => {
    await db.employeeChild.deleteMany({ where: { employeeId } });

    if (!children.length) {
      return;
    }

    const records = children.map((child) => ({
      employeeId,
      ...child,
    }));

    await db.employeeChild.createMany({ data: records });
  };

  const updateStatus = async (employeeId: CUID, status: EmployeeStatusDto) => {
    await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        status,
      },
    });
  };

  const updateAdditionalEmails = async (employeeId: CUID, emails: string[]) => {
    await db.additionalEmail.deleteMany({ where: { employeeId } });

    await db.additionalEmail.createMany({
      data: emails.map((email) => ({ email, employeeId })),
    });
  };

  const deleteAllEmployees = async () => {
    await db.employee.deleteMany({});
  };

  return {
    createEmployee,
    updateEmployee,
    updateChildren: updateAllChildren,
    updateStatus,
    updateAdditionalEmails,
    deleteAllEmployees,
  };
}
