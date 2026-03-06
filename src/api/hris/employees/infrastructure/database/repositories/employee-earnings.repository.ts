import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import type { CUID } from '@/api/hris/types';
import { type EmployeeEarningsRepository } from '@/api/hris/employees/model/repositories';
import { type UpdateEmployeeEarningsDto } from '@/api/hris/employees/model/dtos';

export function employeeEarningsRepository(db: OrganizationPrismaClient): EmployeeEarningsRepository {
  const updateEarnings = async (earnings: UpdateEmployeeEarningsDto) => {
    await db.employeeEarnings.create({
      data: earnings,
    });
  };

  const editEarnings = async (earningId: CUID, earnings: UpdateEmployeeEarningsDto) => {
    await db.employeeEarnings.update({
      where: { employeeId: earnings.employeeId, id: earningId },
      data: earnings,
    });
  };

  const deleteEarnings = async (id: CUID) => {
    await db.employeeEarnings.delete({ where: { id } });
  };

  return {
    updateEarnings,
    editEarnings,
    deleteEarnings,
  };
}
