import { type UpdateEmployeeEarningsDto } from '@/api/hris/employees/model/dtos';
import { type CUID } from '@/shared';

export type EmployeeEarningsRepository = {
  updateEarnings: (earnings: UpdateEmployeeEarningsDto) => void;
  editEarnings: (earningId: CUID, earnings: UpdateEmployeeEarningsDto) => Promise<void>;
  deleteEarnings: (id: CUID) => Promise<void>;
};
