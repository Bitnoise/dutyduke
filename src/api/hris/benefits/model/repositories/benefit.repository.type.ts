import { type CUID, type Nullable } from '@/shared';
import {
  type CreateBenefitDto,
  type UpdateBenefitDto,
  type BenefitDto,
  type EmployeeBenefitDto,
} from '../dtos';

export type BenefitRepository = {
  createBenefit: (benefit: CreateBenefitDto) => Promise<CUID>;
  updateBenefit: (benefitId: CUID, data: UpdateBenefitDto) => Promise<void>;
  deleteBenefit: (benefitId: CUID) => Promise<void>;
  getBenefitById: (benefitId: CUID) => Promise<Nullable<BenefitDto>>;
  assignBenefit: (benefitId: CUID, employeeId: CUID, startDate: Date) => Promise<CUID>;
  unassignBenefit: (employeeBenefitId: CUID) => Promise<void>;
  getEmployeeBenefitByBenefitAndEmployee: (
    benefitId: CUID,
    employeeId: CUID,
  ) => Promise<Nullable<EmployeeBenefitDto>>;
};
