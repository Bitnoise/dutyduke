import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID, type Nullable } from '@/shared';
import { type BenefitRepository } from '../../../model/repositories/benefit.repository.type';
import {
  type CreateBenefitDto,
  type UpdateBenefitDto,
  type BenefitDto,
  type EmployeeBenefitDto,
} from '../../../model/dtos/benefit.dtos';

export function benefitRepository(db: OrganizationPrismaClient): BenefitRepository {
  const createBenefit = async (benefit: CreateBenefitDto): Promise<CUID> => {
    const createdBenefit = await db.benefit.create({
      data: benefit,
    });

    return createdBenefit.id;
  };

  const updateBenefit = async (benefitId: CUID, data: UpdateBenefitDto): Promise<void> => {
    await db.benefit.update({
      where: { id: benefitId },
      data,
    });
  };

  const deleteBenefit = async (benefitId: CUID): Promise<void> => {
    await db.benefit.delete({
      where: { id: benefitId },
    });
  };

  const getBenefitById = async (benefitId: CUID): Promise<Nullable<BenefitDto>> => {
    const benefit = await db.benefit.findUnique({
      where: { id: benefitId },
    });

    if (!benefit) {
      return null;
    }

    return {
      id: benefit.id,
      name: benefit.name,
      note: benefit.note,
      createdAt: benefit.createdAt,
      updatedAt: benefit.updatedAt,
    };
  };

  const assignBenefit = async (benefitId: CUID, employeeId: CUID, startDate: Date): Promise<CUID> => {
    const employeeBenefit = await db.employeeBenefit.create({
      data: {
        benefitId,
        employeeId,
        startDate,
      },
    });

    return employeeBenefit.id;
  };

  const unassignBenefit = async (employeeBenefitId: CUID): Promise<void> => {
    await db.employeeBenefit.delete({
      where: { id: employeeBenefitId },
    });
  };

  const getEmployeeBenefitByBenefitAndEmployee = async (
    benefitId: CUID,
    employeeId: CUID,
  ): Promise<Nullable<EmployeeBenefitDto>> => {
    const employeeBenefit = await db.employeeBenefit.findFirst({
      where: {
        benefitId,
        employeeId,
      },
      include: {
        benefit: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            avatarId: true,
          },
        },
      },
    });

    if (!employeeBenefit) {
      return null;
    }

    return {
      id: employeeBenefit.id,
      benefitId: employeeBenefit.benefitId,
      employeeId: employeeBenefit.employeeId,
      startDate: employeeBenefit.startDate,
      createdAt: employeeBenefit.createdAt,
      updatedAt: employeeBenefit.updatedAt,
      benefit: {
        id: employeeBenefit.benefit.id,
        name: employeeBenefit.benefit.name,
        note: employeeBenefit.benefit.note,
        createdAt: employeeBenefit.benefit.createdAt,
        updatedAt: employeeBenefit.benefit.updatedAt,
      },
      employee: {
        id: employeeBenefit.employee.id,
        firstName: employeeBenefit.employee.firstName,
        lastName: employeeBenefit.employee.lastName,
        isActive: employeeBenefit.employee.status === 'ACTIVE',
        avatarId: employeeBenefit.employee.avatarId,
      },
    };
  };

  return {
    createBenefit,
    updateBenefit,
    deleteBenefit,
    getBenefitById,
    assignBenefit,
    unassignBenefit,
    getEmployeeBenefitByBenefitAndEmployee,
  };
}
